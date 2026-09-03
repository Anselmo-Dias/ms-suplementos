import { useNavigate, useSearch } from '@tanstack/react-router'
import { useCallback } from 'react'
import type { FiltroCategoria } from '../../data/types'
import { Catalogo } from './Catalogo'

/**
 * Liga o catálogo ao roteador: o produto aberto vive no search param
 * `?produto=<id>`, então voltar no navegador fecha o modal e o link
 * de um produto pode ser compartilhado.
 */
export function TelaCatalogo({ categoria }: { categoria: FiltroCategoria }) {
  const { produto } = useSearch({ from: '/catalogo' })
  const navigate = useNavigate()

  const abrirProduto = useCallback(
    (id: string | undefined) => {
      navigate({
        to: '.',
        search: (anterior) => ({ ...anterior, cat: undefined, produto: id }),
        replace: !id,
      })
    },
    [navigate],
  )

  return (
    <Catalogo
      categoria={categoria}
      produtoAberto={produto}
      onAbrirProduto={abrirProduto}
    />
  )
}
