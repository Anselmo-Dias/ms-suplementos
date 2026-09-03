import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useId } from 'react'
import { A11y, FreeMode, Keyboard, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Produto } from '../../data/types'
import { ProdutoCard } from './ProdutoCard'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/free-mode'

type Props = {
  titulo: string
  produtos: Produto[]
  onAbrir: (id: string) => void
}

/** Uma faixa de produtos arrastável — usada na vitrine "Mais Vendidos". */
export function CarrosselProdutos({ titulo, produtos, onAbrir }: Props) {
  // Cada faixa tem seus próprios botões; sem isso as setas de uma
  // controlariam todas as outras.
  const id = useId().replace(/:/g, '')
  const prev = `prev-${id}`
  const next = `next-${id}`

  return (
    <div className="category-section">
      <h2 className="category-section-title">{titulo}</h2>

      <div className="product-carousel-wrapper">
        <button
          type="button"
          className={`carousel-nav carousel-prev ${prev}`}
          aria-label={`${titulo}: produtos anteriores`}
        >
          <ChevronLeft className="ico" />
        </button>

        <Swiper
          className="product-carousel"
          modules={[Navigation, FreeMode, Keyboard, A11y]}
          navigation={{ prevEl: `.${prev}`, nextEl: `.${next}` }}
          keyboard={{ enabled: true }}
          freeMode={{ enabled: true, momentumBounce: false }}
          slidesPerView="auto"
          spaceBetween={16}
          watchOverflow
          a11y={{ containerMessage: `Carrossel: ${titulo}` }}
        >
          {produtos.map((p) => (
            <SwiperSlide className="product-slide" key={p.id}>
              <ProdutoCard produto={p} onAbrir={onAbrir} />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type="button"
          className={`carousel-nav carousel-next ${next}`}
          aria-label={`${titulo}: próximos produtos`}
        >
          <ChevronRight className="ico" />
        </button>
      </div>
    </div>
  )
}
