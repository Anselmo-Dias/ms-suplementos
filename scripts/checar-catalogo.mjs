/**
 * Confere a integridade dos dados do catálogo.
 *   npm run checar
 *
 * Verifica, para os 261 produtos:
 *   - toda imagem referenciada existe em public/
 *   - nenhuma imagem em public/img sobrou sem referência
 *   - ids e caminhos são seguros para URL (sem %, #, ?, espaço, acento…)
 *   - não há id repetido
 *
 * O `%` motivou este script: um produto tinha `100%` no id, o caminho da
 * imagem virava `.../nutrata-n-pro-100%-whey-900g.webp` e o `%` abria uma
 * sequência de escape inválida — a foto simplesmente não carregava.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = path.resolve(fileURLToPath(import.meta.url), '../..')
const dirDados = path.join(raiz, 'src/data/produtos')
const dirImgs = path.join(raiz, 'public/img')

/** Caracteres com significado próprio em URL ou em caminho de arquivo. */
const INSEGURO = /[^a-z0-9\-./]/

const problemas = []
const referenciadas = new Set()
const ids = new Set()

for (const arquivo of fs.readdirSync(dirDados)) {
  for (const p of JSON.parse(fs.readFileSync(path.join(dirDados, arquivo), 'utf8'))) {
    if (ids.has(p.id)) problemas.push(`id repetido: ${p.id}`)
    ids.add(p.id)

    if (INSEGURO.test(p.id)) {
      problemas.push(`id inseguro para URL: ${p.id} (em ${arquivo})`)
    }

    const caminhos = [p.imagem, ...(p.variacoes ?? []).map((v) => v.imagem)].filter(Boolean)
    for (const c of caminhos) {
      referenciadas.add(c)
      if (INSEGURO.test(c)) problemas.push(`caminho inseguro para URL: ${c}`)
      if (!fs.existsSync(path.join(raiz, 'public', c))) {
        problemas.push(`imagem ausente no disco: ${c} (${p.id})`)
      }
    }
  }
}

const noDisco = []
;(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const c = path.join(dir, e.name)
    if (e.isDirectory()) walk(c)
    else noDisco.push('/' + path.relative(path.join(raiz, 'public'), c).split(path.sep).join('/'))
  }
})(dirImgs)

for (const f of noDisco) {
  // os banners não pertencem a nenhum produto
  if (!referenciadas.has(f) && !f.startsWith('/img/banners/')) {
    problemas.push(`imagem sem referência: ${f}`)
  }
}

console.log(`produtos: ${ids.size}`)
console.log(`imagens referenciadas: ${referenciadas.size}`)
console.log(`imagens no disco: ${noDisco.length}`)

if (problemas.length) {
  console.error(`\n${problemas.length} problema(s):`)
  for (const p of problemas) console.error(`  - ${p}`)
  process.exit(1)
}

console.log('\nTudo certo.')
