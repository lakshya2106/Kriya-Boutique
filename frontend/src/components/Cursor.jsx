import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './Cursor.module.css'

export default function Cursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const pos     = useRef({ x: -100, y: -100 })
  const follow  = useRef({ x: -100, y: -100 })
  const raf     = useRef(null)
  const visible = useRef(false)
  const location = useLocation()

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // Move dot instantly
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (!visible.current) {
        // Snap ring to position on first move to avoid swooping in from corner
        follow.current = { x: e.clientX, y: e.clientY }
        visible.current = true
        dot.style.opacity  = '1'
        ring.style.opacity = '1'
      }
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }

    // RAF loop: ring lazily follows
    const loop = () => {
      follow.current.x += (pos.current.x - follow.current.x) * 0.12
      follow.current.y += (pos.current.y - follow.current.y) * 0.12
      ring.style.transform = `translate(${follow.current.x}px, ${follow.current.y}px)`
      raf.current = requestAnimationFrame(loop)
    }

    // Enlarge ring on interactive elements — use event delegation (no per-element listeners)
    const onOver = (e) => {
      if (e.target.closest('a, button, [role="button"], input, select, textarea')) {
        ring.classList.add(styles.enlarged)
        dot.classList.add(styles.dotHide)
      }
    }
    const onOut = (e) => {
      if (e.target.closest('a, button, [role="button"], input, select, textarea')) {
        ring.classList.remove(styles.enlarged)
        dot.classList.remove(styles.dotHide)
      }
    }

    // Hide when cursor leaves window
    const onLeave = () => {
      dot.style.opacity  = '0'
      ring.style.opacity = '0'
      visible.current = false
    }
    const onEnter = () => {
      if (visible.current) {
        dot.style.opacity  = '1'
        ring.style.opacity = '1'
      }
    }

    document.addEventListener('mousemove',  onMove)
    document.addEventListener('mouseover',  onOver)
    document.addEventListener('mouseout',   onOut)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    raf.current = requestAnimationFrame(loop)

    return () => {
      document.removeEventListener('mousemove',  onMove)
      document.removeEventListener('mouseover',  onOver)
      document.removeEventListener('mouseout',   onOut)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(raf.current)
    }
  }, [location.pathname]) // re-run when route changes (admin vs main)

  return (
    <>
      <div ref={dotRef}  className={styles.dot}  />
      <div ref={ringRef} className={styles.ring} />
    </>
  )
}
