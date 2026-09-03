import { Link } from '@tanstack/react-router'
import type { LinkProps } from '@tanstack/react-router'
import type { CSSProperties, ReactNode } from 'react'
import { IconChevron } from '../../components/icons'
import { useReveal } from '../../hooks/useReveal'

type Props = {
  titulo: string
  sub: string
  icone: ReactNode
  /** Rota interna (TanStack Router). Tem prioridade sobre `href`. */
  to?: LinkProps['to']
  /** Link externo — abre em nova aba. */
  href?: string
  variante?: 'primary' | 'dark'
  badge?: string
  delay?: number
}

export function LinkCard({
  titulo,
  sub,
  icone,
  to,
  href,
  variante,
  badge,
  delay = 0,
}: Props) {
  const { ref, visivel } = useReveal<HTMLAnchorElement>()

  const className = [
    'link',
    variante ? `link--${variante}` : '',
    'reveal',
    visivel ? 'is-in' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const style = { '--delay': `${delay}ms` } as CSSProperties

  const conteudo = (
    <>
      {badge && <span className="link__badge">{badge}</span>}
      <span className="link__icon">{icone}</span>
      <span className="link__txt">
        <span className="link__title">{titulo}</span>
        <span className="link__sub">{sub}</span>
      </span>
      <IconChevron className="link__go" />
    </>
  )

  if (to) {
    return (
      <Link ref={ref} to={to} className={className} style={style}>
        {conteudo}
      </Link>
    )
  }

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
    >
      {conteudo}
    </a>
  )
}
