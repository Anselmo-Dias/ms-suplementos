import { ChevronLeft, ChevronRight } from 'lucide-react'
import { A11y, Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const BANNERS = [
  '/img/banners/banner-1.webp',
  '/img/banners/banner-2.webp',
  '/img/banners/banner-3.webp',
]

export function Banners() {
  return (
    <section className="promo" aria-label="Destaques">
      <Swiper
        className="promo-swiper"
        modules={[Navigation, Pagination, Autoplay, Keyboard, A11y]}
        slidesPerView={1}
        loop
        speed={450}
        autoplay={{
          delay: 6000,
          // não recomeça sozinho depois que a pessoa interagiu
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        keyboard={{ enabled: true }}
        navigation={{ prevEl: '.promo-prev', nextEl: '.promo-next' }}
        pagination={{ el: '.promo-dots', clickable: true, bulletClass: 'promo-dot', bulletActiveClass: 'is-active' }}
        a11y={{
          prevSlideMessage: 'Banner anterior',
          nextSlideMessage: 'Próximo banner',
          paginationBulletMessage: 'Ir para o banner {{index}}',
        }}
      >
        {BANNERS.map((src, i) => (
          <SwiperSlide className="promo-slide" key={src}>
            <img
              src={src}
              alt="Destaque MS Suplementos"
              width={2752}
              height={1536}
              fetchPriority={i === 0 ? 'high' : 'low'}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Fora do <Swiper> de propósito: são posicionados sobre a moldura,
          não sobre o trilho que desliza. */}
      <button type="button" className="promo-nav promo-prev" aria-label="Banner anterior">
        <ChevronLeft className="ico" />
      </button>
      <button type="button" className="promo-nav promo-next" aria-label="Próximo banner">
        <ChevronRight className="ico" />
      </button>
      <div className="promo-dots" />
    </section>
  )
}
