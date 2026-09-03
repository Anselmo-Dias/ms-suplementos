import { useMemo, useState } from 'react'
import { IconMapa, IconRota } from '../../components/icons'
import { Reveal } from '../../components/Reveal'
import { SITE } from '../../config/site'
import { linhasDoHorario, statusDaLoja, textoDoStatus } from '../../lib/horario'
import { mapaEmbedLink, rotaLink } from '../../lib/whatsapp'

/**
 * O iframe do Google Maps só é criado depois que o visitante toca na fachada —
 * até lá a página não paga o custo de carregar o mapa.
 *
 * A unidade selecionada vem de fora porque o badge de horário do topo segue
 * a mesma escolha.
 */
export function Mapa({
  unidade: atual,
  onUnidade: setAtual,
}: {
  unidade: number
  onUnidade: (i: number) => void
}) {
  const [carregado, setCarregado] = useState(false)

  const loja = SITE.lojas[atual]

  // Cada unidade tem o seu horário, então status e tabela mudam com a aba.
  const status = useMemo(() => statusDaLoja(loja), [loja])
  const linhas = useMemo(() => linhasDoHorario(loja.horario), [loja])

  return (
    <section className="block">
      <Reveal className="block__head">
        <h2 className="block__title">Onde estamos</h2>
      </Reveal>

      <Reveal>
        <div className="map-tabs" role="tablist" aria-label="Unidades">
          {SITE.lojas.map((l, i) => (
            <button
              key={l.whatsapp}
              className="tab"
              role="tab"
              type="button"
              aria-selected={i === atual}
              onClick={() => setAtual(i)}
            >
              {l.nome.replace(/^Loja (do )?/, '')}
            </button>
          ))}
        </div>

        <div className="map">
          {carregado && (
            <iframe
              key={atual}
              src={mapaEmbedLink(atual)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Mapa da ${loja.nome}`}
              allowFullScreen
            />
          )}
          <div
            className={`map__facade ${carregado ? 'is-hidden' : ''}`}
            role="button"
            tabIndex={0}
            aria-label="Carregar mapa"
            onClick={() => setCarregado(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setCarregado(true)
              }
            }}
          >
            <IconMapa />
            <span>Toque para ver no mapa</span>
          </div>
        </div>

        <div className="map__addr">
          <p>
            {loja.endereco[0]}
            <br />
            {loja.endereco[1]}
          </p>
          <a
            className="map__route"
            href={rotaLink(atual)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconRota />
            Rota
          </a>
        </div>

        {/* Disponibilidade e horário da unidade selecionada.
            `aria-live`: quem usa leitor de tela ouve a troca ao mudar de aba. */}
        <div className="unidade" aria-live="polite">
          <p className={`status status--bloco ${status.aberto ? 'is-open' : ''}`}>
            <span className="status__dot" />
            <span className="status__text">{textoDoStatus(status)}</span>
          </p>

          <dl className="horario">
            {linhas.map((linha) => (
              <div
                className={`horario__linha ${linha.fechado ? 'is-fechado' : ''}`}
                key={linha.dias}
              >
                <dt>{linha.dias}</dt>
                <dd>{linha.turnos}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </section>
  )
}
