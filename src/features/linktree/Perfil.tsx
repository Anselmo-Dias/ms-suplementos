import { useMemo } from 'react'
import { SITE } from '../../config/site'
import { statusGeral, textoDoStatus } from '../../lib/horario'

export function Perfil() {
  // As duas unidades têm horários diferentes; aqui no topo o que importa é
  // se dá para comprar agora em alguma delas. O detalhe por loja fica na
  // seção "Onde estamos".
  const status = useMemo(() => statusGeral(), [])

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
      <p className={`status ${status.aberto ? 'is-open' : ''}`}>
        <span className="status__dot" />
        <span className="status__text">{textoDoStatus(status)}</span>
      </p>
    </section>
  )
}
