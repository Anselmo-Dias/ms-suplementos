import { createFileRoute } from '@tanstack/react-router'
import { Linktree } from '../features/linktree/Linktree'
import '../styles/linktree.css'

export const Route = createFileRoute('/')({
  component: Linktree,
  head: () => ({
    meta: [
      { title: 'MS Suplementos • Links' },
      {
        name: 'description',
        content:
          'Todos os canais da MS Suplementos: WhatsApp, catálogo completo, ofertas da semana e as duas lojas em Aracaju/SE.',
      },
    ],
  }),
})
