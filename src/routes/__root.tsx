import {
  createRootRoute,
  HeadContent,
  Navigate,
  Outlet,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NaoEncontrado,
})

function RootLayout() {
  return (
    <>
      {/* title/meta declarados em cada rota via `head` */}
      <HeadContent />
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </>
  )
}

// Rede de segurança: o curinga `$` já captura endereço desconhecido, mas um
// `notFound()` lançado de dentro de uma rota também precisa voltar ao catálogo.
function NaoEncontrado() {
  return <Navigate to="/catalogo" replace />
}
