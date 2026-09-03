import { IconWhatsApp } from '../../components/icons'
import { useScrollPassou } from '../../hooks/useScrollPassou'
import { waLink } from '../../lib/whatsapp'

/** Botão fixo de pedido — só aparece depois do primeiro rolar. */
export function Dock() {
  const visivel = useScrollPassou(320)

  return (
    <a
      className={`dock ${visivel ? 'is-visible' : ''}`}
      href={waLink('Olá! Vim pelo link da bio e quero fazer um pedido.')}
      target="_blank"
      rel="noopener noreferrer"
    >
      <IconWhatsApp />
      Fazer pedido
    </a>
  )
}
