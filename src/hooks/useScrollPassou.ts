import { useEffect, useState } from 'react'

/** true depois que a página rolou mais que `limite` pixels. */
export function useScrollPassou(limite = 320): boolean {
  const [passou, setPassou] = useState(false)

  useEffect(() => {
    let agendado = false
    const update = () => {
      setPassou(window.scrollY > limite)
      agendado = false
    }
    const onScroll = () => {
      if (agendado) return
      agendado = true
      requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => window.removeEventListener('scroll', onScroll)
  }, [limite])

  return passou
}
