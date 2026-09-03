import { useEffect, useRef, useState } from 'react'

const prefereMenosMovimento = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Revela o elemento quando ele entra na tela.
 * Com "movimento reduzido" ligado o conteúdo já nasce visível.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [visivel, setVisivel] = useState(() => prefereMenosMovimento())

  useEffect(() => {
    const el = ref.current
    if (!el || visivel || !('IntersectionObserver' in window)) {
      setVisivel(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          setVisivel(true)
          io.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
    )
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { ref, visivel }
}
