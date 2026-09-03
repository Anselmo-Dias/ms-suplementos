import { RouterProvider, createRouter } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { routeTree } from './routeTree.gen'
import './styles/global.css'

const router = createRouter({
  routeTree,
  // Pré-carrega a rota assim que o link entra na tela / recebe o mouse.
  defaultPreload: 'intent',
  scrollRestoration: true,
})

// Deixa o TypeScript conhecer as rotas em toda a aplicação.
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
