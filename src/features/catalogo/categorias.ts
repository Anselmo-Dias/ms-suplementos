import type { FiltroCategoria } from '../../data/types'

/**
 * Ordem e rótulos da barra de categorias.
 * "todos" e "mais-vendidos" são virtuais: não existem no campo `categoria`
 * de nenhum produto, são derivadas na hora de filtrar.
 */
export const CATEGORIAS_NAV: Array<{ id: FiltroCategoria; nome: string }> = [
  { id: 'todos', nome: 'Todos os Produtos' },
  { id: 'mais-vendidos', nome: 'Mais Vendidos' },
  { id: 'whey', nome: 'Whey Protein' },
  { id: 'creatina', nome: 'Creatina' },
  { id: 'pre-treino', nome: 'Pré-Treino' },
  { id: 'hipercalorico', nome: 'Hipercalóricos' },
  { id: 'termogenico', nome: 'Termogênico' },
  { id: 'saude', nome: 'Vitaminas & Saúde' },
  { id: 'pre-hormonais', nome: 'Pré Hormonais' },
  { id: 'coqueteleira', nome: 'Acessórios' },
  { id: 'gourmet', nome: 'Produtos Gourmet' },
]

const IDS = new Set(CATEGORIAS_NAV.map((c) => c.id))

export function ehCategoriaValida(id: string): id is FiltroCategoria {
  return IDS.has(id as FiltroCategoria)
}

export function nomeDaCategoria(id: FiltroCategoria): string {
  return CATEGORIAS_NAV.find((c) => c.id === id)?.nome ?? 'Catálogo'
}
