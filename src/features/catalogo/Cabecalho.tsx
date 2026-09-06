import { Link } from '@tanstack/react-router'
import { Package, Search, ShoppingCart } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { FreeMode, Mousewheel } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper/types'
import { CATEGORIAS_NAV } from './categorias'
import { useCarrinho } from './carrinho-contexto'
import type { FiltroCategoria } from '../../data/types'
import { contarCategoria } from '../../data/catalogo'
import 'swiper/css'
import 'swiper/css/free-mode'

type Props = {
  categoriaAtiva: FiltroCategoria
  busca: string
  onBusca: (termo: string) => void
}

export function Cabecalho({
  categoriaAtiva,
  busca,
  onBusca,
}: Props) {
  const { quantidade, abrir, atacado, alternarAtacado } = useCarrinho()
  const trilho = useRef<SwiperClass | null>(null)

  const iAtiva = CATEGORIAS_NAV.findIndex((c) => c.id === categoriaAtiva)

  // Traz a categoria ativa para a vista quando a rota muda.
  useEffect(() => {
    if (iAtiva >= 0) trilho.current?.slideTo(iAtiva)
  }, [iAtiva])

  return (
    <div className="site-header">
      <header className="header">
        <div className="container header-inner">
          <Link className="logo" to="/">
            <img src="/logo-ms.jpg" alt="MS Suplementos" className="logo-img" />
            <span>
              MS<span className="logo-dot">.</span>Suplementos
            </span>
          </Link>

          <div className="header-search">
            <input
              type="search"
              className="header-search-input"
              placeholder="Buscar produtos e marcas"
              aria-label="Buscar produtos no catálogo"
              value={busca}
              onChange={(e) => onBusca(e.target.value)}
            />
            <span className="header-search-btn" aria-hidden="true">
              <Search className="ico" />
            </span>
          </div>

          <div className="header-actions">
            {/* Pílula com rótulo — não usa `.header-action`, que é a caixa
                quadrada dos botões só de ícone. */}
            <button
              type="button"
              className={`btn-atacado ${atacado ? 'is-active' : ''}`}
              aria-pressed={atacado}
              title={
                atacado
                  ? 'Modo atacado ativo — clique para voltar ao varejo'
                  : 'Ver preços de atacado'
              }
              onClick={alternarAtacado}
            >
              <Package className="ico" />
              {/* Rótulo fixo: o estado vem da cor e do aria-pressed. Trocar o
                  texto mudava a largura do botão e empurrava a busca. */}
              <span className="atacado-label">Atacado</span>
            </button>

            <button
              type="button"
              className="header-action cart-trigger"
              aria-label="Abrir carrinho"
              aria-expanded={false}
              onClick={abrir}
            >
              <span className="header-action-badge-wrap">
                <ShoppingCart className="ico header-action-ico" />
                <span className="cart-count">{quantidade}</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <nav className="mainnav" aria-label="Categorias de produtos">
        <div className="container mainnav-eyebrow" aria-hidden="true">
          Categorias
        </div>
        <div className="container mainnav-inner">
          <Swiper
            className="mainnav-swiper"
            // O wrapper recebe a classe visual da faixa de categorias.
            wrapperClass="swiper-wrapper mainnav-list"
            modules={[FreeMode, Mousewheel]}
            slidesPerView="auto"
            spaceBetween={4}
            freeMode={{ enabled: true, momentumBounce: false }}
            grabCursor
            watchOverflow
            // forceToAxis: a roda do mouse na vertical continua rolando a
            // página; só o gesto horizontal move a barra.
            mousewheel={{ forceToAxis: true }}
            onSwiper={(s) => {
              trilho.current = s
            }}
          >
            {CATEGORIAS_NAV.map((c, i) => {
              const ativo = c.id === categoriaAtiva
              return (
                <SwiperSlide className="mainnav-slide" key={c.id}>
                  <Link
                    to="/catalogo/$categoria"
                    params={{ categoria: c.id }}
                    className={`mainnav-item ${ativo ? 'is-active' : ''}`}
                    aria-current={ativo ? 'true' : 'false'}
                    // Com o Swiper a barra anda por transform, e o navegador
                    // não consegue rolar sozinho até um link focado pelo Tab.
                    onFocus={() => trilho.current?.slideTo(i)}
                  >
                    {c.nome}
                    {/* "Mais Vendidos" é uma vitrine (top 5 de cada categoria),
                        não uma lista filtrada — um número ali enganaria. */}
                    {c.id !== 'mais-vendidos' && (
                      <span className="mainnav-count">{contarCategoria(c.id)}</span>
                    )}
                  </Link>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      </nav>
    </div>
  )
}
