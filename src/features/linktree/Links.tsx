import {
  IconCatalogo,
  IconInstagram,
  IconWhatsApp,
} from '../../components/icons'
import { SITE } from '../../config/site'
import { waLink } from '../../lib/whatsapp'
import { LinkCard } from './LinkCard'

export function Links() {
  return (
    <nav className="links" id="links" aria-label="Links principais">
      {SITE.lojas.map((l, i) => (
        <LinkCard
          key={l.whatsapp}
          variante="primary"
          delay={i * 60}
          icone={<IconWhatsApp />}
          titulo={l.nome}
          sub={`Peça pelo WhatsApp • ${l.telefone}`}
          href={waLink(
            `Olá! Vim pelo link da bio e quero fazer um pedido na ${l.nome}.`,
            i,
          )}
        />
      ))}

      <LinkCard
        variante="dark"
        delay={SITE.lojas.length * 60}
        badge="Completo"
        icone={<IconCatalogo />}
        titulo="Catálogo Completo"
        sub="Todas as marcas, preços e combos"
        to="/catalogo"
      />

      <LinkCard
        delay={(SITE.lojas.length + 1) * 60}
        icone={<IconInstagram />}
        titulo="Instagram"
        sub={`${SITE.handle} • novidades e ofertas`}
        href={SITE.instagram}
      />
    </nav>
  )
}
