import { useEffect, useRef, useState } from 'react'
import styles from './DressShowcase.module.css'

// ── ADD YOUR DRESSES HERE ─────────────────────────────
// Each dress needs: photo in /public folder + details below
// You can have 8–20 dresses, just keep adding to this array
const SHOWCASE_DRESSES = [
  {
    id: 1,
    photo: '/lehenga2.png',
    name: 'Rang Mahal',
    sub: 'Palace of Colours',
    tag: 'Heritage Couture',
    desc: 'Multi-panel Banarasi silk lehenga in royal purple, teal & sky blue. The swirling skirt creates a kaleidoscope of colour in motion.',
    price: '₹65,000',
    accent: '#5a1e9e',
    light: '#a888e0',
    textDark: false,
  },
  {
    id: 2,
    photo: '/lehenga3.png',
    name: 'Lavender Safar',
    sub: 'The Lavender Journey',
    tag: 'Contemporary',
    desc: 'Crushed velvet lehenga in soft lavender with silver sequin borders and tiered hem detailing. Effortlessly modern.',
    price: '₹35,000',
    accent: '#6b48b0',
    light: '#c4aee8',
    textDark: false,
  },
  {
    id: 3,
    photo: '/lehenga1.png',
    name: 'Hara Gulzar',
    sub: 'The Green Garden',
    tag: 'Bridal Collection',
    desc: 'Emerald & fuchsia lehenga with intricate gold zardozi embroidery. A dramatic flare with gold gota patti border.',
    price: '₹45,000',
    accent: '#2d8a4e',
    light: '#7acf96',
    textDark: false,
  },
  {
    id: 4,
    photo: '/hero-model.png',
    name: 'Rang Bahar',
    sub: 'Festival of Colours',
    tag: 'Signature Piece',
    desc: 'A masterpiece patchwork lehenga combining the finest fabrics — silks, brocades, velvets — in a celebration of colour and craft.',
    price: '₹80,000',
    accent: '#8a3a20',
    light: '#e8a070',
    textDark: false,
  },
  // ── ADD MORE DRESSES BELOW ────────────────────────
  // { id: 5, photo: '/your-photo.png', name: '...', ... }
]

export default function DressShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [prevIndex, setPrevIndex]     = useState(null)
  const [animDir, setAnimDir]         = useState('down') // 'down' | 'up'
  const [isAnimating, setIsAnimating] = useState(false)
  const [progress, setProgress]       = useState(0) // 0–1 within current dress
  const containerRef = useRef(null)
  const touchStartY  = useRef(0)
  const lastScrollY  = useRef(0)

  const total = SHOWCASE_DRESSES.length

  // ── SCROLL HANDLER ───────────────────────────────
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e) => {
      // Only intercept when showcase is in view
      const rect = container.getBoundingClientRect()
      const inView = rect.top <= 0 && rect.bottom >= window.innerHeight
      if (!inView) return

      e.preventDefault()
      if (isAnimating) return

      if (e.deltaY > 0) {
        // Scroll down
        if (activeIndex < total - 1) {
          goTo(activeIndex + 1, 'down')
        } else {
          // Last dress — allow page to continue scrolling
          container.style.overflowY = 'auto'
        }
      } else {
        // Scroll up
        if (activeIndex > 0) {
          goTo(activeIndex - 1, 'up')
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [activeIndex, isAnimating, total])

  // Touch support
  useEffect(() => {
    const onTouchStart = (e) => { touchStartY.current = e.touches[0].clientY }
    const onTouchEnd   = (e) => {
      const delta = touchStartY.current - e.changedTouches[0].clientY
      if (Math.abs(delta) < 40) return
      if (isAnimating) return
      if (delta > 0 && activeIndex < total - 1) goTo(activeIndex + 1, 'down')
      if (delta < 0 && activeIndex > 0)         goTo(activeIndex - 1, 'up')
    }
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend',   onTouchEnd,   { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend',   onTouchEnd)
    }
  }, [activeIndex, isAnimating, total])

  const goTo = (index, dir) => {
    if (isAnimating) return
    setAnimDir(dir)
    setPrevIndex(activeIndex)
    setIsAnimating(true)
    setActiveIndex(index)
    setTimeout(() => {
      setPrevIndex(null)
      setIsAnimating(false)
    }, 900)
  }

  const current = SHOWCASE_DRESSES[activeIndex]
  const prev    = prevIndex !== null ? SHOWCASE_DRESSES[prevIndex] : null

  return (
    <section ref={containerRef} className={styles.showcase} id="collections">

      {/* ── SLIDES ───────────────────────────────── */}
      {SHOWCASE_DRESSES.map((dress, i) => {
        const isActive = i === activeIndex
        const isPrev   = i === prevIndex

        return (
          <div
            key={dress.id}
            className={`
              ${styles.slide}
              ${isActive ? styles.slideActive : ''}
              ${isPrev   ? styles.slidePrev  : ''}
              ${isPrev && animDir === 'down' ? styles.slideExitUp   : ''}
              ${isPrev && animDir === 'up'   ? styles.slideExitDown : ''}
              ${isActive && animDir === 'down' ? styles.slideEnterDown : ''}
              ${isActive && animDir === 'up'   ? styles.slideEnterUp   : ''}
            `}
          >
            {/* Background photo with Ken Burns */}
            <div className={styles.photoBg}>
              <img
                src={dress.photo}
                alt={dress.name}
                className={`${styles.photo} ${isActive ? styles.photoActive : ''}`}
              />
              {/* Dark overlay — stronger on left for text readability */}
              <div className={styles.overlay} />
              {/* Coloured glow matching dress accent */}
              <div className={styles.colorGlow}
                style={{ background: `radial-gradient(ellipse at 70% 60%, ${dress.accent}35 0%, transparent 60%)` }}
              />
            </div>

            {/* ── TEXT CONTENT ─────────────────── */}
            <div className={styles.content}>
              <div className={`${styles.tag} ${isActive ? styles.contentIn : ''}`}
                style={{ transitionDelay: '0.15s' }}>
                {dress.tag}
              </div>

              <h2 className={`${styles.name} ${isActive ? styles.contentIn : ''}`}
                style={{ transitionDelay: '0.25s' }}>
                {dress.name}
              </h2>

              <p className={`${styles.nameSub} ${isActive ? styles.contentIn : ''}`}
                style={{ transitionDelay: '0.32s', color: dress.light }}>
                {dress.sub}
              </p>

              <p className={`${styles.desc} ${isActive ? styles.contentIn : ''}`}
                style={{ transitionDelay: '0.4s' }}>
                {dress.desc}
              </p>

              <div className={`${styles.ctaRow} ${isActive ? styles.contentIn : ''}`}
                style={{ transitionDelay: '0.5s' }}>
                <span className={styles.price} style={{ color: dress.light }}>
                  {dress.price}
                </span>
                <a href="#contact" className={styles.cta}
                  style={{ borderColor: dress.light, color: dress.light }}>
                  Book a Fitting →
                </a>
              </div>
            </div>

            {/* ── DRESS NUMBER ─────────────────── */}
            <div className={styles.bigNumber}>
              {String(i + 1).padStart(2, '0')}
            </div>
          </div>
        )
      })}

      {/* ── RIGHT SIDE: DOT NAV ──────────────────── */}
      <div className={styles.dotNav}>
        {SHOWCASE_DRESSES.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
            onClick={() => goTo(i, i > activeIndex ? 'down' : 'up')}
            title={SHOWCASE_DRESSES[i].name}
          />
        ))}
      </div>

      {/* ── BOTTOM: PROGRESS BAR ─────────────────── */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${((activeIndex + 1) / total) * 100}%` }}
        />
      </div>

      {/* ── BOTTOM LEFT: COUNTER ─────────────────── */}
      <div className={styles.counter}>
        <span className={styles.counterCurrent}>
          {String(activeIndex + 1).padStart(2, '0')}
        </span>
        <span className={styles.counterSep}>/</span>
        <span className={styles.counterTotal}>
          {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* ── SCROLL HINT (only on first) ──────────── */}
      {activeIndex === 0 && (
        <div className={styles.scrollHint}>
          <span>Scroll to explore</span>
          <div className={styles.scrollArrow}>↓</div>
        </div>
      )}

      {/* ── PREV / NEXT ARROWS ───────────────────── */}
      {activeIndex > 0 && (
        <button className={`${styles.arrow} ${styles.arrowUp}`}
          onClick={() => goTo(activeIndex - 1, 'up')}>
          ↑
        </button>
      )}
      {activeIndex < total - 1 && (
        <button className={`${styles.arrow} ${styles.arrowDown}`}
          onClick={() => goTo(activeIndex + 1, 'down')}>
          ↓
        </button>
      )}

      {/* ── DRESS NAME TICKER (bottom center) ───── */}
      <div className={styles.ticker}>
        <span key={activeIndex} className={styles.tickerText}>
          {current.name} — {current.sub}
        </span>
      </div>

    </section>
  )
}
