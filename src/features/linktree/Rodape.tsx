import { Reveal } from '../../components/Reveal'
import { SITE } from '../../config/site'

export function Rodape() {
  return (
    <>
      <Reveal className="info">
        {/* O horário saiu daqui: cada unidade tem o seu, e uma linha única
            seria imprecisa. Ele agora aparece por loja em "Onde estamos". */}
        <p>Entregamos em toda Aracaju e região</p>
        <p>Pix • Cartão • Dinheiro</p>
      </Reveal>

      <p className="credit">
        © {new Date().getFullYear()} {SITE.nome} • {SITE.cidade}
      </p>
    </>
  )
}
