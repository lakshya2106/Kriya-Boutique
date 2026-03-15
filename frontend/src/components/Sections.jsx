import { useBrand } from '../hooks/useAPI'
import { useInView } from '../hooks/useScroll'
import styles from './Sections.module.css'

/* ── MARQUEE ─────────────────────────────────────────── */
export function Marquee() {
  const { data: brand } = useBrand()

  // marqueeText stored as pipe-separated string: "Item One|Item Two|Item Three"
  const raw   = brand?.marqueeText || ''
  const items = raw
    ? raw.split('|').map(s => s.trim()).filter(Boolean)
    : ['Bridal Lehengas', 'Bespoke Couture', 'Handcrafted Zardozi', 'Limited Pieces', 'For Every Woman']

  return (
    <div className={styles.marqueeWrap}>
      <div className={styles.marqueeInner}>
        {[...items, ...items].map((item, i) => (
          <span key={i} className={styles.marqueeItem}>
            {item} <span className={styles.dot}>◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── INTRO ───────────────────────────────────────────── */
export function Intro() {
  const { ref: lRef, visible: lVis } = useInView(0.15)
  const { ref: rRef, visible: rVis } = useInView(0.15)
  const { data: brand } = useBrand()

  return (
    <section className={styles.intro} id="atelier">
      <div ref={lRef} className={`${styles.introLeft} ${lVis ? styles.visible : ''}`}>
        <span className={styles.tag}>Our Philosophy</span>
        <h2>Every lehenga is a<br /><em>living poem</em><br />worn by a queen</h2>
      </div>
      <div ref={rRef} className={`${styles.introRight} ${rVis ? styles.visible : ''}`}>
        {brand?.introText1 && <p>{brand.introText1}</p>}
        {brand?.introText2 && <p>{brand.introText2}</p>}
      </div>
    </section>
  )
}

/* ── QUOTE ───────────────────────────────────────────── */
export function Quote() {
  const { ref, visible } = useInView(0.2)
  const { data: brand } = useBrand()

  const quote = brand?.siteQuote || 'She wears her culture like armour — beautiful, fearless, and unforgettable'
  const attr  = brand?.name ? `— ${brand.name}${brand.location ? ', ' + brand.location.split(',')[0] : ''}` : '— Kriya Boutique'

  return (
    <div className={styles.quoteSec} ref={ref}>
      <div className={`${styles.quoteInner} ${visible ? styles.visible : ''}`}>
        <p className={styles.quoteText}>"{quote}"</p>
        <span className={styles.quoteAttr}>{attr}</span>
      </div>
    </div>
  )
}

/* ── PROCESS ─────────────────────────────────────────── */
export function Process({ steps }) {
  const { ref, visible } = useInView(0.1)
  const list = steps || []
  return (
    <section className={styles.process} id="process" ref={ref}>
      <h2 className={`${styles.processTitle} ${visible ? styles.visible : ''}`}>How we create</h2>
      <div className={styles.steps}>
        {list.map((s, i) => (
          <div key={i} className={`${styles.step} ${visible ? styles.visible : ''}`}
            style={{ transitionDelay: `${i * 0.12}s` }}>
            <div className={styles.stepIco}>{s.icon}</div>
            <div className={styles.stepN}>Step {s.num}</div>
            <div className={styles.stepT}>{s.title}</div>
            <p className={styles.stepD}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── FOOTER ──────────────────────────────────────────── */
export function Footer({ brand = {} }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footTop}>
        <div>
          <div className={styles.footLogo}>{brand.name}</div>
          <p className={styles.footTag}>
            {brand.about
              ? brand.about.slice(0, 120) + (brand.about.length > 120 ? '…' : '')
              : 'Bespoke Indian couture for women who believe that what they wear is as important as how they feel.'}
          </p>
          {brand.location && <p className={styles.footLocation}>📍 {brand.location}</p>}
        </div>
        {[
          { h: 'Collections', links: ['Bridal Lehengas', 'Heritage Couture', 'Contemporary', 'Festive Wear'] },
          { h: 'Atelier',     links: ['Our Story', 'The Process', 'Fabrics', 'Lookbook'] },
          { h: 'Connect',     links: ['Book a Fitting', 'WhatsApp', 'Instagram', 'Pinterest'] },
        ].map(col => (
          <div key={col.h} className={styles.footCol}>
            <h4>{col.h}</h4>
            <ul>{col.links.map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
          </div>
        ))}
      </div>
      <div className={styles.footBottom}>
        <span>© {new Date().getFullYear()} {brand.name || 'Kriya Boutique'}. All rights reserved.</span>
        {brand.location && <span>Handcrafted with love · {brand.location}</span>}
      </div>
    </footer>
  )
}
