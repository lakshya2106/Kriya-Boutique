import { useState } from 'react'
import { useInsta, useBrand } from '../hooks/useAPI'
import { useInView } from '../hooks/useScroll'
import styles from './InstagramGallery.module.css'

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')
const photoSrc = (p) => p?.startsWith('/uploads/') ? `${BASE_URL}${p}` : (p || '/lehenga1.png')

export default function InstagramGallery() {
  const [hovered, setHovered] = useState(null)
  const { data: raw_POSTS } = useInsta()
  const { data: BRAND }   = useBrand()
  const INSTAGRAM_POSTS   = Array.isArray(raw_POSTS) ? raw_POSTS : []
  const { ref, visible } = useInView(0.1)

  return (
    <section className={styles.section} ref={ref}>
      {/* Header */}
      <div className={`${styles.header} ${visible ? styles.visible : ''}`}>
        <span className={styles.eyebrow}>Follow Our Journey</span>
        <h2 className={styles.title}>
          <a href={BRAND?.instagramUrl || '#'} target="_blank" rel="noreferrer"
            className={styles.handle}>
            @{BRAND?.instagram || ''}
          </a>
        </h2>
        <p className={styles.sub}>On Instagram</p>
      </div>

      {/* Photo grid */}
      <div className={styles.grid}>
        {INSTAGRAM_POSTS.map((post, i) => (
          <a
            key={post._id || post.id || i}
            href={BRAND?.instagramUrl || '#'}
            target="_blank"
            rel="noreferrer"
            className={`${styles.cell} ${visible ? styles.cellVisible : ''}`}
            style={{ transitionDelay: `${i * 60}ms` }}
            onMouseEnter={() => setHovered(post._id || post.id || i)}
            onMouseLeave={() => setHovered(null)}
          >
            <img
              src={photoSrc(post.photo)}
              alt={post.caption}
              className={`${styles.img} ${hovered === (post._id || post.id || i) ? styles.imgZoom : ''}`}
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className={`${styles.overlay} ${hovered === (post._id || post.id || i) ? styles.overlayOn : ''}`}>
              <span className={styles.instaIcon}>📸</span>
              <span className={styles.likes}>♥ {post.likes}</span>
              <p className={styles.caption}>{post.caption}</p>
            </div>
          </a>
        ))}
      </div>

      {/* CTA */}
      <div className={`${styles.cta} ${visible ? styles.visible : ''}`}
        style={{ transitionDelay: '0.4s' }}>
        <a href={BRAND?.instagramUrl || '#'} target="_blank" rel="noreferrer"
          className={styles.ctaBtn}>
          View all on Instagram →
        </a>
      </div>
    </section>
  )
}
