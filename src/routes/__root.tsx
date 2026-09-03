import { createRootRoute, HeadContent, Link, Outlet } from '@tanstack/react-router'
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

function NaoEncontrado() {
  return (
    <main className="page" style={{ textAlign: 'center' }}>
      <h1 className="profile__name">Página não encontrada</h1>
      <p className="profile__bio" style={{ marginInline: 'auto' }}>
        O endereço que você abriu não existe (ou saiu do ar).
      </p>
      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/" className="map__route">
          Voltar ao início
        </Link>
      </p>
    </main>
  )
}
