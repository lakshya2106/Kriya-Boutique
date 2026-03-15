import { useScrollY } from '../hooks/useScroll'
import { useBrand } from '../hooks/useAPI'
import styles from './Navbar.module.css'

export default function Navbar() {
  const scrollY  = useScrollY()
  const scrolled = scrollY > 80
  const { data: BRAND } = useBrand()

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.logo}>{BRAND?.name || 'Kriya Boutique'}</div>
      <div className={styles.links}>
        <a href="#collections">Collections</a>
        <a href="#about">About</a>
        <a href="#process">Process</a>
        <a href="#contact">Contact</a>
      </div>
      <a
        href={`https://wa.me/${BRAND?.whatsapp}`}
        target="_blank" rel="noreferrer"
        className={styles.cta}
      >
        Book a Fitting
      </a>
    </nav>
  )
}
