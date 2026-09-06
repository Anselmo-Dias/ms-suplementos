import { Check, Package, ShoppingCart, Tag, Trash2, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
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
    subtotalCentavos,
    descontoCentavos,
    totalCentavos,
    cupom,
    alterarQtd,
    remover,
    esvaziar,
    atacado,
    aplicarCupom,
    removerCupom,
    mensagemWhatsApp,
  } = useCarrinho()

  const [codigoCupom, setCodigoCupom] = useState('')
  const [erroCupom, setErroCupom] = useState('')

  function enviarCupom(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const resultado = aplicarCupom(codigoCupom)
    if (resultado.sucesso) {
      setCodigoCupom('')
      setErroCupom('')
    } else {
      setErroCupom(resultado.mensagem)
    }
  }

  function tirarCupom() {
    removerCupom()
    setErroCupom('')
  }

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
          {detalhados.length > 0 && (
            <section className="cart-coupon" aria-label="Cupom de desconto">
              {cupom ? (
                <div className="cart-coupon-applied" role="status">
                  <span className="cart-coupon-icon"><Check className="ico" /></span>
                  <span className="cart-coupon-copy">
                    <strong>{cupom.codigo}</strong>
                    <small>{cupom.descricao}</small>
                  </span>
                  <button type="button" onClick={tirarCupom}>Remover</button>
                </div>
              ) : (
                <form className="cart-coupon-form" onSubmit={enviarCupom} noValidate>
                  <label htmlFor="cart-coupon-input">
                    <Tag className="ico" /> Tem um cupom?
                  </label>
                  <div className={`cart-coupon-field ${erroCupom ? 'has-error' : ''}`}>
                    <input
                      id="cart-coupon-input"
                      type="text"
                      inputMode="text"
                      autoComplete="off"
                      placeholder="Digite o código"
                      value={codigoCupom}
                      aria-describedby={erroCupom ? 'cart-coupon-error' : undefined}
                      aria-invalid={Boolean(erroCupom)}
                      onChange={(e) => {
                        setCodigoCupom(e.target.value.toLocaleUpperCase('pt-BR'))
                        if (erroCupom) setErroCupom('')
                      }}
                    />
                    <button type="submit" disabled={!codigoCupom.trim()}>Aplicar</button>
                  </div>
                  {erroCupom && <p id="cart-coupon-error" className="cart-coupon-error" role="alert">{erroCupom}</p>}
                </form>
              )}
            </section>
          )}

          <div className="cart-summary">
            <div className="cart-summary-line">
              <span>Subtotal</span>
              <span>{formatarCentavos(subtotalCentavos)}</span>
            </div>
            {cupom && (
              <div className="cart-summary-line is-discount">
                <span>Desconto</span>
                <span>− {formatarCentavos(descontoCentavos)}</span>
              </div>
            )}
            <div className="cart-summary-row">
              <span>Total</span>
              <span className="cart-summary-val">{formatarCentavos(totalCentavos)}</span>
            </div>
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
