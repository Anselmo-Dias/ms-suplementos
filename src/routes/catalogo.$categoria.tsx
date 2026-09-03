import { createFileRoute, notFound } from '@tanstack/react-router'
import {
  ehCategoriaValida,
  nomeDaCategoria,
} from '../features/catalogo/categorias'
import { TelaCatalogo } from '../features/catalogo/TelaCatalogo'

export const Route = createFileRoute('/catalogo/$categoria')({
  // O produto aberto entra no title, então o loader precisa reagir a ele.
  loaderDeps: ({ search }) => ({ produto: search.produto }),

  loader: async ({ params, deps }) => {
    if (!ehCategoriaValida(params.categoria)) throw notFound()

    // Import dinâmico de propósito: os ~200 KB de JSON do catálogo ficam
    // num chunk próprio em vez de entrar no bundle que o linktree carrega.
    const { produtoPorId } = await import('../data/catalogo')
    const produto = deps.produto ? produtoPorId(deps.produto) : undefined

    return {
      categoria: params.categoria,
      titulo: produto
        ? `${produto.nome} — MS Suplementos`
        : `${nomeDaCategoria(params.categoria)} • MS Suplementos`,
      descricao:
        produto?.descricao ??
        'Whey, creatina, pré-treino e aminoácidos. Peça pelo WhatsApp.',
    }
  },

  component: Pagina,

  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.titulo ?? 'MS Suplementos • Catálogo' },
      { name: 'description', content: loaderData?.descricao ?? '' },
    ],
  }),
})

function Pagina() {
  const { categoria } = Route.useLoaderData()
  return <TelaCatalogo categoria={categoria} />
}
