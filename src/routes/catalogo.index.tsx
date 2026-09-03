import { createFileRoute, redirect } from '@tanstack/react-router'
import { ehCategoriaValida } from '../features/catalogo/categorias'
import { TelaCatalogo } from '../features/catalogo/TelaCatalogo'

export const Route = createFileRoute('/catalogo/')({
  // O catálogo antigo selecionava a categoria por `?cat=whey`. Links já
  // compartilhados continuam funcionando: viram /catalogo/whey.
  beforeLoad: ({ search }) => {
    if (search.cat && ehCategoriaValida(search.cat)) {
      throw redirect({
        to: '/catalogo/$categoria',
        params: { categoria: search.cat },
        search: { produto: search.produto },
      })
    }
  },
  component: () => <TelaCatalogo categoria="todos" />,
  head: () => ({
    meta: [
      { title: 'MS Suplementos • Catálogo' },
      {
        name: 'description',
        content:
          'Whey, creatina, pré-treino e aminoácidos com dose, sabores e modo de uso. Peça pelo WhatsApp.',
      },
    ],
  }),
})
