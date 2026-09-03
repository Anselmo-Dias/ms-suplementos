/** Categorias reais — as que existem no campo `categoria` de um produto. */
export const CATEGORIAS = [
  'whey',
  'creatina',
  'pre-treino',
  'hipercalorico',
  'termogenico',
  'saude',
  'pre-hormonais',
  'coqueteleira',
  'gourmet',
] as const

export type Categoria = (typeof CATEGORIAS)[number]

/** Inclui as duas categorias virtuais usadas só na navegação. */
export type FiltroCategoria = Categoria | 'todos' | 'mais-vendidos'

export type Variacao = {
  /** Sabor, cor ou tamanho — o que diferencia a variação. */
  nome: string
  imagem: string
}

export type Produto = {
  id: string
  nome: string
  categoria: Categoria
  /** Em centavos. `null` = sob consulta ou sem preço definido. */
  precoCentavos: number | null
  imagem: string | null
  variacoes?: Variacao[]
  /** Linha curta abaixo do nome: "300g • 3g creatina por dose" */
  spec: string
  tags: string[]
  /** Selo visual no canto do card. */
  badge?: string
  /** Entra na categoria virtual "Mais Vendidos". */
  destaque?: boolean
  indisponivel?: boolean
  descricao: string
  paraQueServe: string
  modoDeUso: string
  marca?: string
  porcao?: string
  embalagem?: string
  doses?: string
  /** Campos que só aparecem em poucos produtos (Calorias, Sabores, Cor…). */
  extras?: Record<string, string>
}
