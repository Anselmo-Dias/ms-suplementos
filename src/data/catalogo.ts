import coqueteleira from './produtos/coqueteleira.json'
import creatina from './produtos/creatina.json'
import gourmet from './produtos/gourmet.json'
import hipercalorico from './produtos/hipercalorico.json'
import preHormonais from './produtos/pre-hormonais.json'
import preTreino from './produtos/pre-treino.json'
import saude from './produtos/saude.json'
import termogenico from './produtos/termogenico.json'
import whey from './produtos/whey.json'
import type { Categoria, FiltroCategoria, Produto } from './types'
import { CATEGORIAS } from './types'

/** Produtos agrupados por categoria, na ordem em que a navegação os mostra. */
export const PRODUTOS_POR_CATEGORIA: Record<Categoria, Produto[]> = {
  whey,
  creatina,
  'pre-treino': preTreino,
  hipercalorico,
  termogenico,
  saude,
  'pre-hormonais': preHormonais,
  coqueteleira,
  gourmet,
} as Record<Categoria, Produto[]>

export const PRODUTOS: Produto[] = CATEGORIAS.flatMap(
  (c) => PRODUTOS_POR_CATEGORIA[c],
)

const PRODUTOS_POR_ID = new Map(PRODUTOS.map((p) => [p.id, p]))

export function produtoPorId(id: string): Produto | undefined {
  return PRODUTOS_POR_ID.get(id)
}

export function produtosDe(filtro: FiltroCategoria): Produto[] {
  if (filtro === 'todos') return PRODUTOS
  if (filtro === 'mais-vendidos') return PRODUTOS.filter((p) => p.destaque)
  return PRODUTOS_POR_CATEGORIA[filtro] ?? []
}

export function contarCategoria(filtro: FiltroCategoria): number {
  return produtosDe(filtro).length
}

/** Marcas presentes no catálogo, ordenadas — base do filtro por marca. */
export const MARCAS: string[] = [
  ...new Set(PRODUTOS.map((p) => p.marca).filter((m): m is string => !!m)),
].sort((a, b) => a.localeCompare(b, 'pt-BR'))

/** Texto usado pela busca — nome, marca, tags e spec num campo só. */
const indiceBusca = new Map(
  PRODUTOS.map((p) => [
    p.id,
    [p.nome, p.marca, p.spec, ...p.tags]
      .filter(Boolean)
      .join(' ')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase(),
  ]),
)

export function buscar(produtos: Produto[], termo: string): Produto[] {
  const t = termo
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
  if (!t) return produtos
  const palavras = t.split(/\s+/)
  return produtos.filter((p) => {
    const alvo = indiceBusca.get(p.id) ?? ''
    return palavras.every((palavra) => alvo.includes(palavra))
  })
}
