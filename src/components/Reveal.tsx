import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

type Props = {
  children: ReactNode
  /** Atraso da animação, em ms — usado para escalonar itens de uma lista. */
  delay?: number
  as?: ElementType
  className?: string
  style?: CSSProperties
}

/** Envolve um pedaço da página e o revela quando ele entra na tela. */
export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
  style,
}: Props) {
  const { ref, visivel } = useReveal<HTMLDivElement>()

  return (
    <Tag
      ref={ref}
      className={`reveal ${visivel ? 'is-in' : ''} ${className}`.trim()}
      style={{ ...style, '--delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
