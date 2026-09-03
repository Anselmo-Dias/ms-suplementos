/**
 * Migração do catálogo antigo (public_html/catalogo-deploy) para este projeto.
 *
 * Roda uma vez — depois disso a fonte da verdade passa a ser src/data/.
 *   node scripts/migrar-catalogo.mjs
 *
 * O que faz:
 *   1. extrai os arrays `produtos` e `categorias` do script.js legado
 *   2. normaliza cada produto (preço em centavos, `detalhes` em campos tipados)
 *   3. converte só as imagens realmente referenciadas para .webp em public/img
 *   4. escreve um JSON por categoria em src/data/produtos/
 *   5. imprime e salva um relatório do que mudou e do que ficou pendente
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const raiz = path.resolve(fileURLToPath(import.meta.url), '../..')
const legado = path.resolve(raiz, '../public_html/catalogo-deploy')
const destinoDados = path.join(raiz, 'src/data/produtos')
const destinoImgs = path.join(raiz, 'public/img')

const LARGURA_MAX = 800
const QUALIDADE = 82

const relatorio = {
  produtos: 0,
  porCategoria: {},
  imagensConvertidas: 0,
  imagensReaproveitadas: 0,
  bytesAntes: 0,
  bytesDepois: 0,
  imagensAusentes: [],
  semPreco: [],
  indisponiveis: [],
  semMarca: [],
  extrasEncontrados: {},
  idsDuplicados: [],
}

/* ---------------------------------------------------------------- utilidades */

function slug(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** "R$ 18,00" -> 1800 ; vazio / "R$ 0,00" -> null */
function centavos(preco) {
  if (!preco) return null
  const n = Number(String(preco).replace(/[^\d,]/g, '').replace(',', '.'))
  if (!Number.isFinite(n) || n <= 0) return null
  return Math.round(n * 100)
}

/* ------------------------------------------------- 1. extrair do script.js */

async function extrairLegado() {
  const fonte = await fs.readFile(path.join(legado, 'script.js'), 'utf8')

  const trecho = (abertura, fim) => {
    const i = fonte.indexOf(abertura)
    const j = fonte.indexOf(fim, i)
    if (i < 0 || j < 0) throw new Error(`não achei o bloco: ${abertura}`)
    return fonte.slice(i + abertura.length, j).replace(/;\s*$/, '')
  }

  // O script legado é um arquivo solto, sem exports: avaliar o literal do
  // array é a forma mais direta de ler os dados sem reescrevê-los à mão.
  const produtos = eval(trecho('const produtos = ', '\nlet categoriaAtiva'))
  const categorias = eval(trecho('const categorias = ', '\n// Um produto entra'))
  return { produtos, categorias }
}

/* ------------------------------------------------------- 2. imagens -> webp */

const cacheImagem = new Map() // origem absoluta -> caminho público já gerado

/** Resolve o arquivo real de uma referência do catálogo antigo. */
async function acharArquivo(ref) {
  const limpo = decodeURIComponent(String(ref).split('?')[0])
  const alvo = path.join(legado, limpo)
  try {
    await fs.access(alvo)
    return alvo
  } catch {
    // As pastas legadas misturam .jpg/.jpeg/.png/.webp — tenta as irmãs.
    const dir = path.dirname(alvo)
    const base = path.basename(alvo, path.extname(alvo))
    try {
      const irmas = await fs.readdir(dir)
      const achou = irmas.find((f) => path.basename(f, path.extname(f)) === base)
      return achou ? path.join(dir, achou) : null
    } catch {
      return null
    }
  }
}

/**
 * Converte para .webp com largura máxima fixa e devolve o caminho público.
 * A mesma imagem de origem só é processada uma vez.
 */
async function migrarImagem(ref, destinoRelativo, contexto) {
  if (!ref) return null

  const origem = await acharArquivo(ref)
  if (!origem) {
    relatorio.imagensAusentes.push({ produto: contexto, ref })
    return null
  }

  const saida = path.join(destinoImgs, destinoRelativo)
  const publico = `/img/${destinoRelativo.replace(/\\/g, '/')}`
  await fs.mkdir(path.dirname(saida), { recursive: true })

  const jaFeito = cacheImagem.get(origem)
  if (jaFeito) {
    // Mesma foto usada por outro produto: copia o arquivo já otimizado.
    await fs.copyFile(path.join(raiz, 'public', jaFeito), saida)
    relatorio.imagensReaproveitadas++
    return publico
  }

  const antes = (await fs.stat(origem)).size
  await sharp(origem)
    .rotate()
    .resize({ width: LARGURA_MAX, withoutEnlargement: true })
    .webp({ quality: QUALIDADE })
    .toFile(saida)

  relatorio.bytesAntes += antes
  relatorio.bytesDepois += (await fs.stat(saida)).size
  relatorio.imagensConvertidas++
  cacheImagem.set(origem, publico)
  return publico
}

/* --------------------------------------------------------- 3. normalização */

const CAMPOS_DETALHE = {
  'Para que serve': 'paraQueServe',
  'Modo de uso': 'modoDeUso',
  Porção: 'porcao',
  Embalagem: 'embalagem',
  Marca: 'marca',
  Doses: 'doses',
}

async function normalizar(p) {
  const detalhes = p.detalhes || {}
  const extras = {}
  const campos = {}

  for (const [chave, valor] of Object.entries(detalhes)) {
    const destino = CAMPOS_DETALHE[chave]
    if (destino) campos[destino] = valor
    else {
      extras[chave] = valor
      relatorio.extrasEncontrados[chave] = (relatorio.extrasEncontrados[chave] || 0) + 1
    }
  }

  const preco = centavos(p.preco)
  if (preco === null && !p.indisponivel) relatorio.semPreco.push(p.id)
  if (p.indisponivel) relatorio.indisponiveis.push(p.id)
  if (!campos.marca) relatorio.semMarca.push(p.id)

  // O id do catálogo antigo entra no slug antes de qualquer uso: alguns têm
  // acento e um deles tinha `%`, que num caminho de URL abre uma sequência de
  // escape e faz a imagem nunca carregar. O id também vai para a URL, em
  // ?produto=<id>, então precisa ser seguro pelos dois motivos.
  const pasta = slug(p.categoria)
  const base = slug(p.id)
  const imagem = await migrarImagem(p.imagem, `${pasta}/${base}.webp`, p.id)

  const variacoes = []
  for (const v of p.variacoes || []) {
    const img = await migrarImagem(
      v.imagem,
      `${pasta}/${base}--${slug(v.nome)}.webp`,
      `${p.id} (${v.nome})`,
    )
    if (img) variacoes.push({ nome: v.nome, imagem: img })
  }

  return {
    id: base,
    nome: p.nome,
    categoria: p.categoria,
    precoCentavos: preco,
    imagem,
    ...(variacoes.length ? { variacoes } : {}),
    spec: p.spec,
    tags: p.tags || [],
    ...(p.badge ? { badge: p.badge } : {}),
    // "Mais Vendidos" era derivado por regex sobre o badge, que oscila entre
    // "Mais vendida" e "Mais Vendido". Vira um campo próprio.
    ...(/mais vendid/i.test(p.badge || '') ? { destaque: true } : {}),
    ...(p.indisponivel ? { indisponivel: true } : {}),
    descricao: p.descricao,
    paraQueServe: campos.paraQueServe ?? '',
    modoDeUso: campos.modoDeUso ?? '',
    ...(campos.marca ? { marca: campos.marca } : {}),
    ...(campos.porcao ? { porcao: campos.porcao } : {}),
    ...(campos.embalagem ? { embalagem: campos.embalagem } : {}),
    ...(campos.doses ? { doses: campos.doses } : {}),
    ...(Object.keys(extras).length ? { extras } : {}),
  }
}

/* -------------------------------------------------------------- 4. execução */

const mb = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`

async function main() {
  const { produtos, categorias } = await extrairLegado()
  console.log(`Lidos ${produtos.length} produtos e ${categorias.length} categorias.`)

  const vistos = new Set()
  const porCategoria = {}

  for (const p of produtos) {
    if (vistos.has(p.id)) relatorio.idsDuplicados.push(p.id)
    vistos.add(p.id)

    const normalizado = await normalizar(p)
    ;(porCategoria[p.categoria] ||= []).push(normalizado)
    relatorio.produtos++
    if (relatorio.produtos % 40 === 0) {
      console.log(`  ... ${relatorio.produtos}/${produtos.length}`)
    }
  }

  await fs.mkdir(destinoDados, { recursive: true })
  for (const [categoria, lista] of Object.entries(porCategoria)) {
    lista.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
    const arquivo = path.join(destinoDados, `${slug(categoria)}.json`)
    await fs.writeFile(arquivo, `${JSON.stringify(lista, null, 2)}\n`, 'utf8')
    relatorio.porCategoria[categoria] = lista.length
  }

  await fs.writeFile(
    path.join(raiz, 'src/data/categorias.json'),
    `${JSON.stringify(
      categorias.map(({ id, nome }) => ({ id, nome })),
      null,
      2,
    )}\n`,
    'utf8',
  )

  /* ------------------------------------------------------------ relatório */
  const linhas = [
    '# Relatório da migração do catálogo',
    '',
    `Produtos migrados: **${relatorio.produtos}**`,
    '',
    '## Por categoria',
    ...Object.entries(relatorio.porCategoria)
      .sort((a, b) => b[1] - a[1])
      .map(([c, n]) => `- ${c}: ${n}`),
    '',
    '## Imagens',
    `- convertidas para webp: ${relatorio.imagensConvertidas}`,
    `- reaproveitadas (mesma foto em mais de um produto): ${relatorio.imagensReaproveitadas}`,
    `- peso: ${mb(relatorio.bytesAntes)} -> ${mb(relatorio.bytesDepois)}`,
    `- **referenciadas mas ausentes no disco: ${relatorio.imagensAusentes.length}**`,
    ...relatorio.imagensAusentes.map((a) => `  - ${a.produto}: \`${a.ref}\``),
    '',
    '## Pendências de dados',
    `- sem preço (e não marcados como indisponíveis): ${relatorio.semPreco.length}`,
    ...relatorio.semPreco.map((id) => `  - ${id}`),
    `- marcados como indisponíveis: ${relatorio.indisponiveis.length}`,
    `- sem marca: ${relatorio.semMarca.length}`,
    ...relatorio.semMarca.map((id) => `  - ${id}`),
    `- ids duplicados: ${relatorio.idsDuplicados.length}`,
    ...relatorio.idsDuplicados.map((id) => `  - ${id}`),
    '',
    '## Chaves de `detalhes` que viraram `extras`',
    ...Object.entries(relatorio.extrasEncontrados)
      .sort((a, b) => b[1] - a[1])
      .map(([k, n]) => `- ${k}: ${n}`),
    '',
  ]

  const caminhoRelatorio = path.join(raiz, 'scripts/relatorio-migracao.md')
  await fs.writeFile(caminhoRelatorio, `${linhas.join('\n')}\n`, 'utf8')

  console.log(`\n${linhas.join('\n')}`)
  console.log(`Relatório salvo em ${path.relative(raiz, caminhoRelatorio)}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
