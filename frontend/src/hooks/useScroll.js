import { useState, useEffect, useRef } from 'react'

// Returns scroll progress (0–1) for any element
export function useScrollProgress() {
  const ref = useRef(null)
  const [progress, setProgress] = useState(0)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 when element enters from bottom, 1 when it exits top
      const prog = 1 - (rect.bottom / (vh + rect.height))
      setProgress(Math.max(0, Math.min(1, prog)))
      setInView(rect.top < vh && rect.bottom > 0)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return { ref, progress, inView }
}

// Returns true once element enters viewport
export function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, visible }
}

// Global scroll Y
export function useScrollY() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return scrollY
}
