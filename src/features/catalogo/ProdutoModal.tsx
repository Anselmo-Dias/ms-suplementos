import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ShoppingCart,
  Slash,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { A11y, Keyboard, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper/types'
import type { Produto } from '../../data/types'
import { BlocoPreco } from './ProdutoCard'
import { useCarrinho } from './carrinho-contexto'
import { partesDoSpec, precoVigente, semCompra, semDado } from './lib/preco'
import 'swiper/css'
import 'swiper/css/navigation'

type Props = {
  produto: Produto
  onFechar: () => void
}

export function ProdutoModal({ produto: p, onFechar }: Props) {
  const { adicionar, atacado } = useCarrinho()
  const [iVariacao, setIVariacao] = useState(0)
  const swiper = useRef<SwiperClass | null>(null)
  const fechar = useRef<HTMLButtonElement>(null)

  const variacoes = p.variacoes ?? []
  const variacaoAtual = variacoes[iVariacao]
  const { tamanho, dose } = partesDoSpec(p.spec)
  const bloqueado = semCompra(p)

  const textoAcao = p.indisponivel
    ? 'Indisponível'
    : precoVigente(p, atacado) === null
      ? 'Consultar preço'
      : 'Adicionar ao Carrinho'

  useEffect(() => {
    const anterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    fechar.current?.focus()

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar()
    }
    document.addEventListener('keydown', aoTeclar)
    return () => {
      document.body.style.overflow = anterior
      document.removeEventListener('keydown', aoTeclar)
    }
  }, [onFechar])

  // Galeria e botões de sabor são duas vistas do mesmo índice.
  function escolherVariacao(i: number) {
    setIVariacao(i)
    swiper.current?.slideTo(i)
  }

  // A ficha técnica repete os campos do produto; "A definir" não vira linha.
  const ficha: Array<[string, string | undefined]> = [
    ['Embalagem', p.embalagem ?? tamanho],
    ['Marca', p.marca],
    ['Porção', p.porcao],
    ['Doses', p.doses],
    ['Para que serve', p.paraQueServe],
    ...Object.entries(p.extras ?? {}),
    ['Modo de uso', p.modoDeUso],
  ]

  return (
    <div
      className="modal is-open"
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes de ${p.nome}`}
    >
      <div className="modal-overlay" onClick={onFechar} />

      <div className="modal-box">
        <button
          ref={fechar}
          type="button"
          className="modal-close"
          aria-label="Fechar"
          onClick={onFechar}
        >
          <X className="ico" />
        </button>

        {/* Só esta faixa rola: o rodapé de ação fica sempre à vista. */}
        <div className="modal-corpo">
          <div className="modal-grid">
            <div className={`modal-media ${p.indisponivel ? 'is-esgotado' : ''}`}>
              {variacoes.length > 1 ? (
                <>
                  <Swiper
                    className="modal-galeria"
                    modules={[Navigation, Keyboard, A11y]}
                    slidesPerView={1}
                    speed={300}
                    keyboard={{ enabled: true }}
                    navigation={{
                      prevEl: '.modal-galeria-prev',
                      nextEl: '.modal-galeria-next',
                    }}
                    a11y={{
                      prevSlideMessage: 'Sabor anterior',
                      nextSlideMessage: 'Próximo sabor',
                    }}
                    onSwiper={(s) => {
                      swiper.current = s
                    }}
                    onSlideChange={(s) => setIVariacao(s.activeIndex)}
                  >
                    {variacoes.map((v) => (
                      <SwiperSlide key={v.nome}>
                        <img src={v.imagem} alt={`${p.nome} — ${v.nome}`} decoding="async" />
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  <button
                    type="button"
                    className="promo-nav promo-prev modal-media-nav modal-galeria-prev"
                    aria-label="Sabor anterior"
                  >
                    <ChevronLeft className="ico" />
                  </button>
                  <button
                    type="button"
                    className="promo-nav promo-next modal-media-nav modal-galeria-next"
                    aria-label="Próximo sabor"
                  >
                    <ChevronRight className="ico" />
                  </button>
                </>
              ) : (
                (variacaoAtual?.imagem ?? p.imagem) && (
                  <img
                    src={variacaoAtual?.imagem ?? p.imagem!}
                    alt={p.nome}
                    decoding="async"
                  />
                )
              )}

              {p.badge && <span className="badge">{p.badge}</span>}
            </div>

            <div className="modal-info">
              <p className="label">{p.tags[0] || 'Produto'}</p>
              <h3 className="modal-nome">{p.nome}</h3>
              <p className="modal-dose">{dose || tamanho}</p>
              <p className="modal-desc">{p.descricao}</p>

              {variacoes.length > 0 && (
                <div className="variacao-box">
                  <p className="variacao-title">
                    Escolha o sabor
                    {variacaoAtual && (
                      <span className="variacao-atual">{variacaoAtual.nome}</span>
                    )}
                  </p>
                  <div className="variacao-grid">
                    {variacoes.map((v, i) => (
                      <button
                        key={v.nome}
                        type="button"
                        className={`variacao-btn ${i === iVariacao ? 'is-active' : ''}`}
                        aria-pressed={i === iVariacao}
                        onClick={() => escolherVariacao(i)}
                      >
                        {v.nome}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="spec-list">
                {ficha
                  .filter(([, valor]) => !semDado(valor))
                  .map(([chave, valor]) => (
                    <div className="spec-row" key={chave}>
                      <span className="spec-key">{chave}</span>
                      <span className="spec-val">{valor}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <div className="modal-preco-box">
            <BlocoPreco produto={p} atacado={atacado} />
          </div>
          <button
            type="button"
            className="btn"
            disabled={bloqueado}
            onClick={() => {
              adicionar(p, variacaoAtual?.nome ?? null)
              onFechar()
            }}
          >
            {p.indisponivel ? (
              <Slash className="ico" />
            ) : bloqueado ? (
              <MessageCircle className="ico" />
            ) : (
              <ShoppingCart className="ico" />
            )}{' '}
            {textoAcao}
          </button>
        </div>
      </div>
    </div>
  )
}
