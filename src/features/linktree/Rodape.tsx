import { Reveal } from '../../components/Reveal'
import { SITE } from '../../config/site'
import { partesHorario } from '../../lib/horario'

export function Rodape() {
  const [dias, horas] = partesHorario()

  return (
    <>
      <Reveal className="info">
        <p>
          <b>{dias} </b>
          {horas && `• ${horas}`}
        </p>
        <p>Entregamos em toda Aracaju e região</p>
        <p>Pix • Cartão • Dinheiro</p>
      </Reveal>

      <p className="credit">
        © {new Date().getFullYear()} {SITE.nome} • {SITE.cidade}
      </p>
    </>
  )
}
