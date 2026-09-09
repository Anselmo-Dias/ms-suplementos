import { createFileRoute, redirect } from '@tanstack/react-router'

// A tela inicial passou a ser o catálogo. O linktree segue implementado em
// `features/linktree`, apenas sem rota apontando para ele por enquanto.
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/catalogo', replace: true })
  },
})
