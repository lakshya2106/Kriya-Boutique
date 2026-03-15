import { useInView } from '../hooks/useScroll'
import { useBrand, useHero } from '../hooks/useAPI'
import styles from './About.module.css'

export default function About() {
  const { ref: lRef, visible: lVis } = useInView(0.15)
  const { ref: rRef, visible: rVis } = useInView(0.15)
  const { data: brand }     = useBrand()
  const { data: heroPhoto } = useHero()

  const city = brand?.location || ''

  return (
    <section className={styles.section} id="about">
      <div className={styles.inner}>
        <div ref={lRef} className={`${styles.photoSide} ${lVis ? styles.visible : ''}`}>
          <div className={styles.photoFrame}>
            <img src={heroPhoto || '/hero-model.png'} alt={brand?.name || 'Kriya Boutique'} className={styles.photo} />
            <div className={styles.photoOverlay} />
          </div>
          <div className={styles.photoLabel}>
            {brand?.founded && <span>Est. {brand.founded}</span>}
            {brand?.founded && brand?.location && <span>·</span>}
            {brand?.location && <span>{brand.location}</span>}
          </div>
          <div className={styles.photoBorder} />
        </div>

        <div ref={rRef} className={`${styles.textSide} ${rVis ? styles.visible : ''}`}>
          <span className={styles.eyebrow}>Our Story</span>
          <h2 className={styles.title}>
            {city ? <>Crafted in {city.split(',')[0]},<br /></> : null}
            <em>worn everywhere</em>
          </h2>
          {brand?.about && <p className={styles.para}>{brand.about}</p>}
          {brand?.aboutPara2 && <p className={styles.para}>{brand.aboutPara2}</p>}

          <div className={styles.stats}>
            {[
              { n: brand?.statBrides || '500+', l: 'Happy Brides'   },
              { n: brand?.statYears  || '7+',   l: 'Years of Craft' },
              { n: brand?.statCraft  || '100%', l: 'Handcrafted'    },
            ].map(s => (
              <div key={s.l} className={styles.stat}>
                <span className={styles.statN}>{s.n}</span>
                <span className={styles.statL}>{s.l}</span>
              </div>
            ))}
          </div>

          <a href="#contact" className={styles.cta}>
            {city ? `Meet us in ${city.split(',')[0]} →` : 'Get in touch →'}
          </a>
        </div>
      </div>
    </section>
  )
}
