import { Dock } from './Dock'
import { Links } from './Links'
import { Mapa } from './Mapa'
import { Perfil } from './Perfil'
import { Rodape } from './Rodape'

export function Linktree() {
  return (
    <>
      <a className="skip-link" href="#links">
        Pular para os links
      </a>

      <main className="page">
        <Perfil />
        <Links />
        <Mapa />
        <Rodape />
      </main>

      <Dock />
    </>
  )
}
