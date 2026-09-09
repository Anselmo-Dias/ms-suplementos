import { createFileRoute, redirect } from '@tanstack/react-router'

// Curinga: qualquer endereço fora das rotas conhecidas cai aqui e volta para
// o catálogo, que é a tela principal do site. `replace` evita que o endereço
// inválido fique no histórico e prenda o botão "voltar" do navegador.
export const Route = createFileRoute('/$')({
  beforeLoad: () => {
    throw redirect({ to: '/catalogo', replace: true })
  },
})
