import { createContext, useContext } from 'react'
import type { Produto } from '../../data/types'
import type { Cupom, ResultadoCupom } from './cupons'

export type ItemCarrinho = {
  id: string
  /** Sabor/variação escolhido — parte da identidade do item. */
  sabor: string | null
  qtd: number
}

export type ItemDetalhado = ItemCarrinho & {
  nome: string
  imagem: string | null
  precoCentavos: number
  subtotalCentavos: number
}

export type CarrinhoContexto = {
  itens: ItemCarrinho[]
  atacado: boolean
  aberto: boolean
  /** Itens com nome, imagem e preço já resolvidos do catálogo. */
  detalhados: ItemDetalhado[]
  quantidade: number
  subtotalCentavos: number
  descontoCentavos: number
  totalCentavos: number
  /** Desconto do cupom informativo (só vale cumprindo a condição do cupom). */
  descontoCondicionalCentavos: number
  /** Total já com o desconto condicional aplicado. */
  totalCondicionalCentavos: number
  cupom: Cupom | null
  adicionar: (p: Produto, sabor?: string | null) => void
  alterarQtd: (index: number, delta: number) => void
  remover: (index: number) => void
  esvaziar: () => void
  abrir: () => void
  fechar: () => void
  alternarAtacado: () => void
  aplicarCupom: (codigo: string) => ResultadoCupom
  removerCupom: () => void
  mensagemWhatsApp: () => string
}

export const CarrinhoContext = createContext<CarrinhoContexto | null>(null)

export function useCarrinho(): CarrinhoContexto {
  const ctx = useContext(CarrinhoContext)
  if (!ctx) throw new Error('useCarrinho precisa estar dentro de <CarrinhoProvider>')
  return ctx
}
