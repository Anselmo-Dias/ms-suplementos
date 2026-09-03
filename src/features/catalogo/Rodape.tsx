import { CreditCard, MessageCircle, Zap } from 'lucide-react'
import { SITE, loja } from '../../config/site'
import { waLink } from '../../lib/whatsapp'

export function RodapeCatalogo() {
  const principal = loja(SITE.lojaPrincipal)

  return (
    <footer className="footer">
      <div className="container footer-grid-box">
        <div className="footer-col">
          <div className="footer-brand">
            <img
              src="/logo-ms.jpg"
              alt="MS Suplementos"
              className="logo-img footer-logo-img"
            />
            <span>{SITE.nome}</span>
          </div>
          <p className="footer-desc">
            Sua loja especializada em suplementação esportiva, vitaminas e produtos
            naturais de alta performance.
          </p>
        </div>

        <div className="footer-col">
          <p className="footer-heading">Atendimento WhatsApp</p>
          <p>
            <a
              href={waLink(
                'Olá! Vim pelo catálogo e gostaria de tirar uma dúvida.',
                SITE.lojaPrincipal,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-wa-link"
            >
              <MessageCircle className="ico" /> {principal.telefone}
            </a>
          </p>
          <p className="footer-time">Segunda a Sábado: 08:00 às 18:00</p>
        </div>

        <div className="footer-col">
          <p className="footer-heading">Formas de Pagamento</p>
          <div className="payment-badges">
            <span className="pay-badge">
              <Zap className="ico" /> PIX
            </span>
            <span className="pay-badge">
              <CreditCard className="ico" /> Cartão
            </span>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p className="footer-year">
          © {new Date().getFullYear()} {SITE.nome}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
