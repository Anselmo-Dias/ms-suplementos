import { Package, ShoppingCart, Trash2, X } from 'lucide-react'
import { SITE } from '../../config/site'
import { waLink } from '../../lib/whatsapp'
import { useCarrinho } from './carrinho-contexto'
import { formatarCentavos } from './lib/preco'

export function CarrinhoDrawer() {
  const {
    aberto,
    fechar,
    detalhados,
    quantidade,
    totalCentavos,
    alterarQtd,
    remover,
    esvaziar,
    atacado,
    mensagemWhatsApp,
  } = useCarrinho()

  const total = formatarCentavos(totalCentavos)

  return (
    <aside
      className={`cart-drawer ${aberto ? 'is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Carrinho de compras"
      aria-hidden={!aberto}
    >
      <div className="cart-overlay" onClick={fechar} />
      <div className="cart-box">
        <div className="cart-header">
          <div className="cart-header-title">
            <h3>Seu Carrinho</h3>
            <span className="cart-header-count">
              {quantidade} {quantidade === 1 ? 'item' : 'itens'}
            </span>
          </div>
          <button type="button" className="cart-close" aria-label="Fechar carrinho" onClick={fechar}>
            <X className="ico" />
          </button>
        </div>

        <div className="cart-items">
          {detalhados.length === 0 ? (
            <div className="cart-empty-state">
              <ShoppingCart className="ico cart-empty-icon" />
              <p>Seu carrinho está vazio.</p>
              <p className="cart-empty-hint">
                Adicione suplementos para enviar seu pedido via WhatsApp.
              </p>
            </div>
          ) : (
            <>
              {atacado && (
                <div className="cart-atacado-note">
                  <Package className="ico" /> Preços de atacado aplicados
                </div>
              )}

              {detalhados.map((item, index) => (
                <div className="cart-item" key={`${item.id}-${item.sabor ?? ''}`}>
                  <div className="cart-item-thumb">
                    {item.imagem && <img src={item.imagem} alt={item.nome} />}
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-title">{item.nome}</div>
                    {item.sabor && (
                      <div className="cart-item-flavor">Sabor: {item.sabor}</div>
                    )}
                    <div className="cart-item-price">
                      {formatarCentavos(item.subtotalCentavos)}
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <div className="cart-qty-ctrl">
                      <button
                        type="button"
                        className="cart-qty-btn"
                        aria-label={`Diminuir quantidade de ${item.nome}`}
                        onClick={() => alterarQtd(index, -1)}
                      >
                        −
                      </button>
                      <span className="cart-qty-val">{item.qtd}</span>
                      <button
                        type="button"
                        className="cart-qty-btn"
                        aria-label={`Aumentar quantidade de ${item.nome}`}
                        onClick={() => alterarQtd(index, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="cart-item-remove"
                      title="Remover item"
                      aria-label={`Remover ${item.nome}`}
                      onClick={() => remover(index)}
                    >
                      <Trash2 className="ico" />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span className="cart-summary-val">{total}</span>
          </div>
          <a
            className={`btn btn-whatsapp-checkout ${detalhados.length === 0 ? 'is-disabled' : ''}`}
            href={detalhados.length ? waLink(mensagemWhatsApp(), SITE.lojaPrincipal) : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={detalhados.length === 0}
          >
            <span>Finalizar Pedido no WhatsApp</span>
          </a>
          <button type="button" className="btn-clear-cart" onClick={esvaziar}>
            Esvaziar carrinho
          </button>
        </div>
      </div>
    </aside>
  )
}
