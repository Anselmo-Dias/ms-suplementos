import { useState } from 'react'
import { Dock } from './Dock'
import { Links } from './Links'
import { Mapa } from './Mapa'
import { Perfil } from './Perfil'
import { Rodape } from './Rodape'

export function Linktree() {
  // A unidade escolhida nas abas de "Onde estamos" também manda no badge de
  // horário lá no topo — as duas partes falam da mesma loja.
  const [unidade, setUnidade] = useState(0)

  return (
    <>
      <a className="skip-link" href="#links">
        Pular para os links
      </a>

      <main className="page">
        <Perfil unidade={unidade} />
        <Links />
        <Mapa unidade={unidade} onUnidade={setUnidade} />
        <Rodape />
      </main>

      <Dock />
    </>
  )
}
