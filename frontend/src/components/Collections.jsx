// import { useState, useMemo } from 'react'
// import { useInView } from '../hooks/useScroll'
// import { useDresses, useCategories, useBrand } from '../hooks/useAPI'
// import styles from './Collections.module.css'

// const BASE_URL = (import.meta.env.FRONTEND_API_URL || 'http://localhost:5000/api').replace('/api', '')
// const photoSrc = (p) => p?.startsWith('/uploads/') ? `${BASE_URL}${p}` : (p || '/lehenga1.png')

// const BADGE_LABELS = {
//   'new':        { label: 'New',        bg: '#2d8a4e' },
//   'bestseller': { label: 'Bestseller', bg: '#c8a45a' },
//   'sold-out':   { label: 'Sold Out',   bg: '#6e6e6e' },
// }

// function DressThumb({ dress, delay }) {
//   const [hovered, setHovered] = useState(false)
//   const { ref, visible } = useInView(0.1)
//   const badge    = dress.badge ? BADGE_LABELS[dress.badge] : null
//   const swatches = Array.isArray(dress.swatches) ? dress.swatches : []

//   return (
//     <div
//       ref={ref}
//       className={`${styles.thumb} ${visible ? styles.thumbVisible : ''}`}
//       style={{ transitionDelay: `${delay}ms` }}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       <div className={styles.thumbPhoto}>
//         <img
//           src={photoSrc(dress.photos?.[0] || '')}
//           alt={dress.name}
//           className={`${styles.thumbImg} ${hovered ? styles.thumbImgZoom : ''}`}
//           loading="lazy"
//         />
//         <div className={`${styles.thumbOverlay} ${hovered ? styles.thumbOverlayOn : ''}`}>
//           <a href="#contact" className={styles.thumbCta}>Book a Fitting →</a>
//         </div>
//         {badge && (
//           <span className={styles.badge} style={{ background: badge.bg }}>
//             {badge.label}
//           </span>
//         )}
//         <div className={styles.thumbGlow} style={{ background: dress.bgGlow }} />
//       </div>

//       <div className={styles.thumbInfo}>
//         <span className={styles.thumbTag}>{dress.tag}</span>
//         <h3 className={styles.thumbName}>{dress.name}</h3>
//         <p className={styles.thumbSub}>{dress.nameEn}</p>
//         <div className={styles.thumbBottom}>
//           <span className={styles.thumbPrice}>{dress.price}</span>
//           <div className={styles.thumbSwatches}>
//             {swatches.slice(0, 3).map((c, i) => (
//               <span key={i} className={styles.thumbSwatch} style={{ background: c }} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function Collections() {
//   const [active, setActive] = useState('all')

//   const { data: raw_DRESSES }    = useDresses()
//   const { data: raw_CATEGORIES } = useCategories()
//   const { data: brand }          = useBrand()
//   const DRESSES    = Array.isArray(raw_DRESSES)    ? raw_DRESSES    : []
//   const CATEGORIES = Array.isArray(raw_CATEGORIES) ? raw_CATEGORIES : []

//   const city = brand?.location ? brand.location.split(',')[0] : ''

//   const filtered = useMemo(() => {
//     if (active === 'all') return DRESSES
//     if (active === 'new') return DRESSES.filter(d => d.badge === 'new')
//     return DRESSES.filter(d => d.category === active)
//   }, [active, DRESSES])

//   // Build filter tabs: always show "All" first, then DB categories
//   const tabs = [
//     { id: 'all', label: 'All', color: '#c8a45a' },
//     ...CATEGORIES.filter(c => c.id !== 'all'),
//   ]

//   return (
//     <section className={styles.collections} id="collections">
//       <div className={styles.header}>
//         <span className={styles.eyebrow}>Explore Our Work</span>
//         <h2 className={styles.title}>Collections</h2>
//         <p className={styles.sub}>
//           {city ? `Each piece handcrafted in our ${city} atelier` : 'Each piece handcrafted with love'}
//         </p>
//       </div>

//       {/* Filter bar */}
//       <div className={styles.filters}>
//         {tabs.map(cat => (
//           <button
//             key={cat.id || cat._id}
//             className={`${styles.filter} ${active === cat.id ? styles.filterActive : ''}`}
//             style={active === cat.id ? { borderColor: cat.color, color: cat.color } : {}}
//             onClick={() => setActive(cat.id)}
//           >
//             {cat.label}
//           </button>
//         ))}
//       </div>

//       <p className={styles.count}>
//         {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
//       </p>

//       <div className={styles.grid}>
//         {filtered.map((dress, i) => (
//           <DressThumb
//             key={dress._id || dress.id || i}  // ← MongoDB uses _id
//             dress={dress}
//             delay={(i % 3) * 80}
//           />
//         ))}
//       </div>

//       {filtered.length === 0 && (
//         <div className={styles.empty}>
//           <p>No pieces in this category yet.</p>
//           <p>Check back soon or <a href="#contact">enquire for custom orders →</a></p>
//         </div>
//       )}
//     </section>
//   )
// }





import { useState } from 'react'
import { useInView } from '../hooks/useScroll'
import { useDresses, useCategories, useBrand } from '../hooks/useAPI'
import styles from './Collections.module.css'

const BASE_URL = (import.meta.env.FRONTEND_API_URL || 'http://localhost:5000/api').replace('/api', '')
const photoSrc = (p) => p?.startsWith('/uploads/') ? `${BASE_URL}${p}` : (p || '/lehenga1.png')

const BADGE_LABELS = {
  'new':        { label: 'New',        bg: '#2d8a4e' },
  'bestseller': { label: 'Bestseller', bg: '#c8a45a' },
  'sold-out':   { label: 'Sold Out',   bg: '#6e6e6e' },
}

function DressThumb({ dress, delay }) {
  const [hovered, setHovered] = useState(false)
  const { ref, visible } = useInView(0.1)
  const badge    = dress.badge ? BADGE_LABELS[dress.badge] : null
  const swatches = Array.isArray(dress.swatches) ? dress.swatches : []

  return (
    <div
      ref={ref}
      className={`${styles.thumb} ${visible ? styles.thumbVisible : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.thumbPhoto}>
        <img
          src={photoSrc(dress.photos?.[0] || '')}
          alt={dress.name}
          className={`${styles.thumbImg} ${hovered ? styles.thumbImgZoom : ''}`}
          loading="lazy"
        />
        <div className={`${styles.thumbOverlay} ${hovered ? styles.thumbOverlayOn : ''}`}>
          <a href="#contact" className={styles.thumbCta}>Book a Fitting →</a>
        </div>
        {badge && (
          <span className={styles.badge} style={{ background: badge.bg }}>
            {badge.label}
          </span>
        )}
        <div className={styles.thumbGlow} style={{ background: dress.bgGlow }} />
      </div>

      <div className={styles.thumbInfo}>
        <span className={styles.thumbTag}>{dress.tag}</span>
        <h3 className={styles.thumbName}>{dress.name}</h3>
        <p className={styles.thumbSub}>{dress.nameEn}</p>
        <div className={styles.thumbBottom}>
          <span className={styles.thumbPrice}>{dress.price}</span>
          <div className={styles.thumbSwatches}>
            {swatches.slice(0, 3).map((c, i) => (
              <span key={i} className={styles.thumbSwatch} style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Collections() {
  const [active, setActive] = useState('all')

  const { data: raw_DRESSES }    = useDresses()
  const { data: raw_CATEGORIES } = useCategories()
  const { data: brand }          = useBrand()

  const city = brand?.location ? brand.location.split(',')[0] : ''

  // Derive filtered directly — avoids useMemo with unstable array dep
  const dresses    = Array.isArray(raw_DRESSES)    ? raw_DRESSES    : []
  const CATEGORIES = Array.isArray(raw_CATEGORIES) ? raw_CATEGORIES : []

  const filtered = active === 'all'
    ? dresses
    : active === 'new'
      ? dresses.filter(d => d.badge === 'new')
      : dresses.filter(d => d.category === active)

  const tabs = [
    { id: 'all', label: 'All', color: '#c8a45a' },
    ...CATEGORIES.filter(c => c.id !== 'all'),
  ]

  return (
    <section className={styles.collections} id="collections">
      <div className={styles.header}>
        <span className={styles.eyebrow}>Explore Our Work</span>
        <h2 className={styles.title}>Collections</h2>
        <p className={styles.sub}>
          {city ? `Each piece handcrafted in our ${city} atelier` : 'Each piece handcrafted with love'}
        </p>
      </div>

      <div className={styles.filters}>
        {tabs.map(cat => (
          <button
            key={cat.id || cat._id}
            className={`${styles.filter} ${active === cat.id ? styles.filterActive : ''}`}
            style={active === cat.id ? { borderColor: cat.color, color: cat.color } : {}}
            onClick={() => setActive(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <p className={styles.count}>
        {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
      </p>

      <div className={styles.grid}>
        {filtered.map((dress, i) => (
          <DressThumb
            key={dress._id || dress.id || i}
            dress={dress}
            delay={(i % 3) * 80}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className={styles.empty}>
          <p>No pieces in this category yet.</p>
          <p>Check back soon or <a href="#contact">enquire for custom orders →</a></p>
        </div>
      )}
    </section>
  )
}