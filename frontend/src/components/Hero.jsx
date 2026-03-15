import { useRef } from 'react'
import { useScrollY } from '../hooks/useScroll'
import { useBrand, useHero } from '../hooks/useAPI'
import styles from './Hero.module.css'
import PhotoHero from './PhotoHero'

export default function Hero() {
  const scrollY = useScrollY()
  const heroRef = useRef(null)
  const scrollProg = Math.min(scrollY / (window.innerHeight || 800), 1)
  const { data: brand } = useBrand()
  const { data: heroPhoto } = useHero()

  const city    = brand?.location ? brand.location.split(',')[0] : ''
  const founded = brand?.founded || ''
  const eyebrow = [
    'Indian Couture',
    city ? `${city} Atelier` : null,
    founded ? `Est. ${founded}` : null,
  ].filter(Boolean).join(' · ')

  return (
    <section ref={heroRef} className={styles.hero} id="hero">
      {/* Living photo hero */}
      <PhotoHero scrollProgress={scrollProg} heroPhoto={heroPhoto} />

      {/* Left text content */}
      <div className={styles.content}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>
          Wear<br />
          <span className={styles.accent}>Stories</span>
        </h1>
        <p className={styles.sub}>Handcrafted Lehengas · Bespoke Bridal · Timeless</p>
      </div>

      {/* Right label */}
      <div className={styles.rightLabel}>
        <span className={styles.labelTag}>
          {brand?.name || 'Kriya Boutique'}{city ? ` · ${city}` : ''}
        </span>
        <span className={styles.labelName}>Scroll to Explore</span>
      </div>

      {/* Scroll cue */}
      <div className={styles.scrollCue}
        style={{ opacity: 1 - scrollProg * 3 }}>
        <span>Scroll</span>
        <div className={styles.scrollLine} />
      </div>

      {/* Atmospheric bottom fade */}
      <div className={styles.bottomFade} />
    </section>
  )
}
