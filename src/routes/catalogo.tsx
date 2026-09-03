import { createFileRoute, Outlet } from '@tanstack/react-router'
import '../styles/catalogo.css'

type BuscaCatalogo = {
  /** id do produto aberto no modal — mantém o deep-link do catálogo antigo. */
  produto?: string
  /** categoria no formato legado (`?cat=whey`); a rota index redireciona. */
  cat?: string
}

export const Route = createFileRoute('/catalogo')({
  validateSearch: (busca: Record<string, unknown>): BuscaCatalogo => ({
    produto: typeof busca.produto === 'string' ? busca.produto : undefined,
    cat: typeof busca.cat === 'string' ? busca.cat : undefined,
  }),
  component: Outlet,
})
