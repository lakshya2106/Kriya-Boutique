import { useState } from 'react'
import { useTestimonials } from '../hooks/useAPI'
import { useInView } from '../hooks/useScroll'
import styles from './Testimonials.module.css'

function Stars({ n = 5 }) {
  return (
    <div className={styles.stars}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < n ? styles.starOn : styles.starOff}>★</span>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const { ref, visible } = useInView(0.05)   // ← lower threshold — triggers easier
  const { data, loading, error } = useTestimonials()

  const list = Array.isArray(data) ? data : []

  if (loading) return (
    <section className={styles.section}>
      <div className={styles.loadingState}><p>Loading reviews…</p></div>
    </section>
  )

  if (error || list.length === 0) return null

  const safeActive = Math.min(active, list.length - 1)
  const t = list[safeActive]

  const prev = () => setActive(a => (a - 1 + list.length) % list.length)
  const next = () => setActive(a => (a + 1) % list.length)

  return (
    <section className={styles.section} ref={ref}>  {/* ref on section */}
      <div className={styles.inner}>
        {/* visible is derived from section ref — both sides use same flag */}
        <div className={`${styles.left} ${visible ? styles.visible : ''}`}>
          <span className={styles.eyebrow}>What They Say</span>
          <h2 className={styles.title}>Loved by<br /><em>real brides</em></h2>
          <p className={styles.note}>Every review is from a real customer — no filters, no fabrications.</p>
          <div className={styles.nav}>
            <button className={styles.navBtn} onClick={prev}>←</button>
            <span className={styles.navCount}>
              {String(safeActive + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}
            </span>
            <button className={styles.navBtn} onClick={next}>→</button>
          </div>
        </div>

        <div className={`${styles.right} ${visible ? styles.visible : ''}`}
          style={{ transitionDelay: '0.2s' }}>
          <div className={styles.card} key={safeActive}>
            <Stars n={t.rating || 5} />
            <p className={styles.quote}>"{t.text}"</p>
            <div className={styles.reviewer}>
              <div className={styles.reviewerInitial}
                style={{ background: `hsl(${(safeActive + 1) * 47}, 35%, 35%)` }}>
                {(t.name || 'A')[0]}
              </div>
              <div>
                <p className={styles.reviewerName}>{t.name}</p>
                <p className={styles.reviewerOcc}>{t.occasion}</p>
                <p className={styles.reviewerLoc}>📍 {t.location}</p>
              </div>
            </div>
          </div>

          <div className={styles.dots}>
            {list.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === safeActive ? styles.dotActive : ''}`}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}