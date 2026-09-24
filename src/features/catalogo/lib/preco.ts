import type { Produto } from '../../../data/types'

const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

/** 1800 -> "R$ 18,00" */
export function formatarCentavos(centavos: number): string {
  return BRL.format(centavos / 100)
}

/**
 * Desconto aplicado no modo atacado.
 * No catálogo antigo o campo `precoAtacado` era lido mas nunca preenchido —
 * na prática sempre valeu este percentual fixo.
 */
export const DESCONTO_ATACADO = 0.15

export function precoAtacado(centavos: number): number {
  return Math.round(centavos * (1 - DESCONTO_ATACADO))
}

/** Preço que o catálogo deve exibir e cobrar no modo atual. */
export function precoVigente(p: Produto, atacado: boolean): number | null {
  if (p.precoCentavos === null) return null
  // Combo já é preço promocional: não acumula com o desconto de atacado.
  if (p.categoria === 'combos') return p.precoCentavos
  return atacado ? precoAtacado(p.precoCentavos) : p.precoCentavos
}

/** Produto que não pode ir para o carrinho: sem preço ou fora de estoque. */
export function semCompra(p: Produto): boolean {
  return Boolean(p.indisponivel) || p.precoCentavos === null
}

/** Índice do primeiro sabor à venda — é o que o card e o modal mostram primeiro. */
export function primeiraVariacaoDisponivel(p: Produto): number {
  const i = (p.variacoes ?? []).findIndex((v) => !v.indisponivel)
  return i >= 0 ? i : 0
}

/** "300g • 3g por dose" -> { tamanho: "300g", dose: "3g por dose" } */
export function partesDoSpec(spec: string): { tamanho: string; dose: string } {
  const [tamanho, ...resto] = spec.split('•').map((s) => s.trim())
  return { tamanho, dose: resto.join(' • ') }
}

/** Campo sem dado real não vira linha na ficha do produto. */
export function semDado(valor?: string): boolean {
  return !valor || /^a\s*definir\.?$/i.test(valor.trim())
}
