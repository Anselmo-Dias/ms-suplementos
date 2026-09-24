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
  // Não tem aba própria: é o conteúdo de "Combos do Mês" (id `mais-vendidos`).
  'combos',
] as const

export type Categoria = (typeof CATEGORIAS)[number]

/** Inclui as duas categorias virtuais usadas só na navegação. */
export type FiltroCategoria = Categoria | 'todos' | 'mais-vendidos'

/** Divisão da aba Whey em faixas. Sem subcategoria = "Outras proteínas". */
export const SUBCATEGORIAS_WHEY = ['isolado', 'concentrado', 'blend'] as const

export type SubcategoriaWhey = (typeof SUBCATEGORIAS_WHEY)[number]

export type Variacao = {
  /** Sabor, cor ou tamanho — o que diferencia a variação. */
  nome: string
  imagem: string
  /** Só este sabor está fora de estoque; os outros continuam à venda. */
  indisponivel?: boolean
}

export type Produto = {
  id: string
  nome: string
  categoria: Categoria
  /** Só nos wheys: em qual faixa da aba Whey o produto aparece. */
  subcategoria?: SubcategoriaWhey
  /** Em centavos. `null` = sob consulta ou sem preço definido. */
  precoCentavos: number | null
  /** Preço "De" exibido riscado ao lado do atual — usado nos combos. */
  precoDeCentavos?: number
  imagem: string | null
  variacoes?: Variacao[]
  /** Linha curta abaixo do nome: "300g • 3g creatina por dose" */
  spec: string
  tags: string[]
  /** Selo visual no canto do card. */
  badge?: string
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
