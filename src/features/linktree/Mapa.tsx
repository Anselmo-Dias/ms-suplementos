import { useState } from 'react'
import { IconMapa, IconRota } from '../../components/icons'
import { Reveal } from '../../components/Reveal'
import { SITE } from '../../config/site'
import { mapaEmbedLink, rotaLink } from '../../lib/whatsapp'

/**
 * O iframe do Google Maps só é criado depois que o visitante toca na fachada —
 * até lá a página não paga o custo de carregar o mapa.
 */
export function Mapa() {
  const [atual, setAtual] = useState(0)
  const [carregado, setCarregado] = useState(false)

  const loja = SITE.lojas[atual]

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
      </Reveal>
    </section>
  )
}
