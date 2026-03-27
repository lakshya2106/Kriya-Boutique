import { useState, useEffect, useRef } from 'react'
import { useInView } from '../hooks/useScroll'
import styles from './DressCard.module.css'

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'
const photoSrc = (p) => p?.startsWith('/uploads/') ? `${BASE_URL}${p}` : p

export default function DressCard({ dress, index }) {
  // Safety: ensure arrays always exist even if DB doc is incomplete
  if (!dress) return null
  dress = {
    photos: [], swatches: [], colors: [],
    accentColor: '#c8a45a',
    bgGlow: 'radial-gradient(ellipse at 50% 55%, rgba(200,164,90,0.15) 0%, transparent 65%)',
    ...dress
  }
  const [activePhoto, setActivePhoto]   = useState(0)
  const [activeSwatch, setActiveSwatch] = useState(0)
  const [hovered, setHovered]           = useState(false)
  const [shimmer, setShimmer]           = useState(false)
  const isAlt = index % 2 !== 0
  const { ref, visible } = useInView(0.15)
  const autoTimer    = useRef(null)
  const shimmerTimer = useRef(null)

  useEffect(() => {
    if (!visible) return
    // If there's 0–1 photo, auto-rotation doesn't make sense (avoid `% 0` / NaN)
    if (!Array.isArray(dress.photos) || dress.photos.length < 2) return
    autoTimer.current = setInterval(() => {
      setActivePhoto(p => (p + 1) % dress.photos.length)
    }, 3500)
    return () => clearInterval(autoTimer.current)
  }, [visible, dress.photos.length])

  useEffect(() => {
    if (!visible) return
    shimmerTimer.current = setInterval(() => {
      setShimmer(true)
      setTimeout(() => setShimmer(false), 1200)
    }, 6000)
    return () => clearInterval(shimmerTimer.current)
  }, [visible])

  const handleDotClick = (i) => {
    setActivePhoto(i)
    clearInterval(autoTimer.current)
    if (!dress.photos || dress.photos.length < 2) return
    autoTimer.current = setInterval(() => {
      setActivePhoto(p => (p + 1) % dress.photos.length)
    }, 3500)
  }

  return (
    <article
      ref={ref}
      className={`${styles.card} ${isAlt ? styles.alt : ''} ${visible ? styles.cardVisible : ''}`}
    >
      {/* PHOTO SIDE */}
      <div
        className={styles.photoSide}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className={styles.glow} style={{ background: dress.bgGlow }} />

        {dress.photos.map((src, i) => (
          <div key={i} className={`${styles.photoWrap} ${activePhoto === i ? styles.photoOn : styles.photoOff}`}>
            <img
              src={photoSrc(src)}
              alt={dress.name}
              className={`${styles.photo} ${hovered ? styles.photoZoom : ''}`}
              loading={index < 2 ? 'eager' : 'lazy'}
            />
          </div>
        ))}

        <div className={`${styles.shimmerSweep} ${shimmer ? styles.shimmerOn : ''}`} />
        <div className={styles.vignette} />
        <div className={`${styles.borderAnim} ${visible ? styles.borderOn : ''}`} />

        {dress.photos.length > 1 && (
          <div className={styles.dots}>
            {dress.photos.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${activePhoto === i ? styles.dotActive : ''}`}
                onClick={() => handleDotClick(i)}
              />
            ))}
          </div>
        )}

        <div className={styles.watermark}>{dress.name}</div>
      </div>

      {/* INFO SIDE */}
      <div className={styles.infoSide}>
        <div className={`${styles.bigNum} ${visible ? styles.fadeIn : ''}`} style={{ transitionDelay: '0s' }}>
          {dress.num}
        </div>

        <p className={`${styles.tag} ${visible ? styles.fadeIn : ''}`} style={{ transitionDelay: '0.12s' }}>
          {dress.tag}
        </p>

        <h3 className={`${styles.name} ${visible ? styles.fadeIn : ''}`} style={{ transitionDelay: '0.22s' }}>
          {dress.name}
        </h3>
        <p className={`${styles.nameSub} ${visible ? styles.fadeIn : ''}`} style={{ transitionDelay: '0.3s' }}>
          {dress.nameEn}
        </p>

        <div className={`${styles.divider} ${visible ? styles.dividerOn : ''}`}
          style={{ transitionDelay: '0.35s', '--accent': dress.accentColor }} />

        <p className={`${styles.desc} ${visible ? styles.fadeIn : ''}`} style={{ transitionDelay: '0.42s' }}>
          {dress.desc}
        </p>

        <div className={`${styles.swatches} ${visible ? styles.fadeIn : ''}`} style={{ transitionDelay: '0.5s' }}>
          {dress.swatches.map((color, i) => (
            <button
              key={i}
              className={`${styles.swatch} ${activeSwatch === i ? styles.swatchOn : ''}`}
              style={{ background: color }}
              onClick={() => setActiveSwatch(i)}
              title={dress.colors[i]}
            />
          ))}
          <span className={styles.swatchLabel}>{dress.colors[activeSwatch]}</span>
        </div>

        <div className={`${styles.meta} ${visible ? styles.fadeIn : ''}`} style={{ transitionDelay: '0.58s' }}>
          {[
            { l: 'Fabric', v: dress.fabric },
            { l: 'Work',   v: dress.work   },
            { l: 'Sizes',  v: dress.sizes  },
            { l: 'Lead Time', v: dress.lead },
          ].map(({ l, v }) => (
            <div key={l} className={styles.metaItem}>
              <span className={styles.metaL}>{l}</span>
              <span className={styles.metaV}>{v}</span>
            </div>
          ))}
        </div>

        <div className={`${styles.ctas} ${visible ? styles.fadeIn : ''}`} style={{ transitionDelay: '0.66s' }}>
          <span className={styles.price}>{dress.price}</span>
          <a href="#contact" className={styles.cta} style={{ '--accent': dress.accentColor }}>
            Book a Fitting →
          </a>
        </div>
      </div>
    </article>
  )
}
