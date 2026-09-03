import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { produtoPorId } from '../../data/catalogo'
import type { Produto } from '../../data/types'
import {
  CarrinhoContext,
  type CarrinhoContexto,
  type ItemCarrinho,
  type ItemDetalhado,
} from './carrinho-contexto'
import { formatarCentavos, precoVigente, semCompra } from './lib/preco'

const CHAVE_CARRINHO = 'ms_carrinho'
const CHAVE_ATACADO = 'ms_atacado'

function lerStorage<T>(chave: string, padrao: T): T {
  try {
    const bruto = localStorage.getItem(chave)
    return bruto ? (JSON.parse(bruto) as T) : padrao
  } catch {
    return padrao
  }
}

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>(() =>
    lerStorage<ItemCarrinho[]>(CHAVE_CARRINHO, []),
  )
  const [atacado, setAtacado] = useState<boolean>(
    () => lerStorage<string>(CHAVE_ATACADO, '0') === '1',
  )
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens))
    } catch {
      // navegação privada / storage bloqueado: o carrinho só não sobrevive ao reload
    }
  }, [itens])

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_ATACADO, atacado ? '1' : '0')
    } catch {
      /* idem */
    }
  }, [atacado])

  // Trava a rolagem do fundo enquanto o painel está aberto.
  useEffect(() => {
    if (!aberto) return
    const anterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = anterior
    }
  }, [aberto])

  const adicionar = useCallback(
    (p: Produto, sabor: string | null = null) => {
      if (semCompra(p)) return
      const saborFinal = sabor ?? p.variacoes?.[0]?.nome ?? null

      setItens((atual) => {
        const i = atual.findIndex(
          (item) => item.id === p.id && item.sabor === saborFinal,
        )
        if (i >= 0) {
          const copia = [...atual]
          copia[i] = { ...copia[i], qtd: copia[i].qtd + 1 }
          return copia
        }
        return [...atual, { id: p.id, sabor: saborFinal, qtd: 1 }]
      })

      // Só o primeiro item abre o painel; depois a adição é silenciosa.
      if (itens.length === 0) setAberto(true)
    },
    [itens],
  )

  const alterarQtd = useCallback((index: number, delta: number) => {
    setItens((atual) =>
      atual
        .map((item, i) => (i === index ? { ...item, qtd: item.qtd + delta } : item))
        .filter((item) => item.qtd > 0),
    )
  }, [])

  const remover = useCallback((index: number) => {
    setItens((atual) => atual.filter((_, i) => i !== index))
  }, [])

  const esvaziar = useCallback(() => setItens([]), [])

  // O preço nunca é guardado no storage: sai sempre do catálogo, já no modo
  // vigente. Assim uma mudança de preço ou de modo não deixa item defasado.
  const detalhados = useMemo<ItemDetalhado[]>(
    () =>
      itens.flatMap((item) => {
        const p = produtoPorId(item.id)
        if (!p) return []
        const preco = precoVigente(p, atacado) ?? 0
        const imagem =
          p.variacoes?.find((v) => v.nome === item.sabor)?.imagem ?? p.imagem
        return [
          {
            ...item,
            nome: p.nome,
            imagem,
            precoCentavos: preco,
            subtotalCentavos: preco * item.qtd,
          },
        ]
      }),
    [itens, atacado],
  )

  const quantidade = useMemo(
    () => detalhados.reduce((acc, i) => acc + i.qtd, 0),
    [detalhados],
  )
  const totalCentavos = useMemo(
    () => detalhados.reduce((acc, i) => acc + i.subtotalCentavos, 0),
    [detalhados],
  )

  const mensagemWhatsApp = useCallback(() => {
    const linhas = detalhados
      .map((i) => {
        const sabor = i.sabor ? ` (Sabor: ${i.sabor})` : ''
        return `• ${i.qtd}x ${i.nome}${sabor}\n  Subtotal: ${formatarCentavos(i.subtotalCentavos)}`
      })
      .join('\n\n')

    const titulo = atacado
      ? '📦 *PEDIDO ATACADO — MS SUPLEMENTOS*'
      : '🛍️ *PEDIDO MS SUPLEMENTOS*'

    return [
      titulo,
      '--------------------------------',
      '',
      linhas,
      '',
      '--------------------------------',
      `💰 *VALOR TOTAL:* ${formatarCentavos(totalCentavos)}${atacado ? '\n_(valores de atacado)_' : ''}`,
      '',
      'Olá! Gostaria de confirmar o pedido e combinar a entrega!',
    ].join('\n')
  }, [detalhados, totalCentavos, atacado])

  const valor = useMemo<CarrinhoContexto>(
    () => ({
      itens,
      atacado,
      aberto,
      detalhados,
      quantidade,
      totalCentavos,
      adicionar,
      alterarQtd,
      remover,
      esvaziar,
      abrir: () => setAberto(true),
      fechar: () => setAberto(false),
      alternarAtacado: () => setAtacado((a) => !a),
      mensagemWhatsApp,
    }),
    [
      itens,
      atacado,
      aberto,
      detalhados,
      quantidade,
      totalCentavos,
      adicionar,
      alterarQtd,
      remover,
      esvaziar,
      mensagemWhatsApp,
    ],
  )

  return <CarrinhoContext value={valor}>{children}</CarrinhoContext>
}
