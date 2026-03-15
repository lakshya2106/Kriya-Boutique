import { useEffect, useRef, useState } from 'react'
import { useHero } from '../hooks/useAPI'
import styles from './PhotoHero.module.css'

// ── TO CHANGE THE HERO PHOTO ──────────────────────────
// Just replace /hero-model.png in the /public folder
// with your new photo — same filename, done!
// ─────────────────────────────────────────────────────

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: 10 + (i * 37 + i * i * 3) % 80,
  y: 5  + (i * 53 + i * 7)     % 88,
  size: 1.5 + (i % 4) * 0.8,
  dur:  2.8 + (i % 5) * 0.6,
  del:  (i % 7) * 0.35,
  opacity: 0.12 + (i % 5) * 0.06,
  color: i % 3 === 0 ? '#c8a45a' : i % 3 === 1 ? '#9b7fc4' : '#e0357a',
}))

export default function PhotoHero({ scrollProgress = 0 }) {
  const containerRef = useRef(null)
  const photoRef = useRef(null)
  const glowRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [loaded, setLoaded] = useState(false)
  const { data: heroPhoto } = useHero()

  // Mouse parallax
  useEffect(() => {
    const onMove = (e) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Parallax values
  const photoY    = scrollProgress * 80          // photo drifts up slower
  const photoScale = 1 + scrollProgress * 0.06   // subtle zoom on scroll
  const photoOpacity = Math.max(0, 1 - scrollProgress * 1.8)

  // Mouse-driven micro parallax
  const mx = (mousePos.x - 0.5) * 18
  const my = (mousePos.y - 0.5) * 10

  return (
    <div ref={containerRef} className={styles.wrapper}>

      {/* Deep atmospheric background */}
      <div className={styles.atmosphere} />

      {/* Coloured glow blobs that pulse */}
      <div className={styles.glowPurple} />
      <div className={styles.glowGold} />
      <div className={styles.glowPink} />

      {/* Floating gold particles */}
      {PARTICLES.map(p => (
        <div
          key={p.id}
          className={styles.particle}
          style={{
            left: `${p.x}%`,
            top:  `${p.y}%`,
            width:  `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            opacity: p.opacity,
            animationDuration: `${p.dur}s`,
            animationDelay:    `${p.del}s`,
            transform: `translate(${mx * (p.id % 3 + 1) * 0.15}px, ${my * (p.id % 2 + 1) * 0.12}px)`,
          }}
        />
      ))}

      {/* ── MAIN PHOTO ─────────────────────────────── */}
      <div
        className={styles.photoWrap}
        style={{
          transform: `translateY(${-photoY}px) translateX(${mx * 0.4}px) scale(${photoScale})`,
          opacity: photoOpacity,
        }}
      >
        {/* Loading shimmer */}
        {!loaded && <div className={styles.shimmer} />}

        {/* The actual photo */}
        <img
          ref={photoRef}
          src={heroPhoto || '/hero-model.png'}
          alt="Kriya Boutique — Patchwork Lehenga"
          className={`${styles.photo} ${loaded ? styles.photoLoaded : ''}`}
          onLoad={() => setLoaded(true)}
        />

        {/* Fabric shimmer overlay — gold sheen that sweeps across */}
        <div className={styles.shimmerOverlay} />

        {/* Bottom fade so photo blends into page */}
        <div className={styles.photoFade} />

        {/* Left + right edge fades */}
        <div className={styles.edgeFadeLeft} />
        <div className={styles.edgeFadeRight} />
      </div>

      {/* Bokeh circles (mimics camera bokeh from outdoor shot) */}
      {[1,2,3,4,5].map(i => (
        <div key={i} className={styles.bokeh} style={{
          width:  `${30 + i * 18}px`,
          height: `${30 + i * 18}px`,
          left:   `${15 + i * 15}%`,
          top:    `${20 + (i * 23) % 50}%`,
          animationDuration: `${4 + i}s`,
          animationDelay:    `${i * 0.6}s`,
          opacity: 0.03 + i * 0.008,
        }} />
      ))}

      {/* Subtle grain texture over everything */}
      <div className={styles.grain} />
    </div>
  )
}
