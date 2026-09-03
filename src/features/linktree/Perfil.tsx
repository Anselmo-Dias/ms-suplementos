import { useMemo } from 'react'
import { SITE, loja as lojaPor } from '../../config/site'
import { statusDaLoja, textoDoStatus } from '../../lib/horario'

/** `unidade`: índice da loja selecionada nas abas de "Onde estamos". */
export function Perfil({ unidade }: { unidade: number }) {
  const loja = lojaPor(unidade)

  // O badge acompanha a aba: o horário aqui é sempre o da unidade escolhida.
  const status = useMemo(() => statusDaLoja(loja), [loja])

  return (
    <section className="profile">
      <img
        className="profile__avatar"
        src={SITE.logo}
        alt={SITE.nome}
        width={122}
        height={122}
        fetchPriority="high"
      />
      <h1 className="profile__name">{SITE.nome}</h1>
      <p className="profile__handle">{SITE.handle}</p>
      <p className="profile__bio">{SITE.bio}</p>
      <p className={`status ${status.aberto ? 'is-open' : ''}`} aria-live="polite">
        <span className="status__dot" />
        <span className="status__text">{textoDoStatus(status)}</span>
      </p>
    </section>
  )
}
