import { useState } from 'react'
import { useBrand } from '../hooks/useAPI'
import { useInView } from '../hooks/useScroll'
import styles from './Contact.module.css'

export default function Contact() {
  const { data: BRAND } = useBrand()
  const [form, setForm] = useState({ name: '', phone: '', occasion: '', date: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const { ref, visible } = useInView(0.1)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSending(true)
    // Build WhatsApp message from form
    const msg = encodeURIComponent(
      `Hi Kriya Boutique! 🌸\n\nName: ${form.name}\nPhone: ${form.phone}\nOccasion: ${form.occasion}\nPreferred Date: ${form.date}\n\nMessage: ${form.message}`
    )
    // Open WhatsApp with pre-filled message
    setTimeout(() => {
      window.open(`https://wa.me/${BRAND?.whatsapp}?text=${msg}`, '_blank')
      setSent(true)
      setSending(false)
    }, 800)
  }

  return (
    <section className={styles.section} id="contact" ref={ref}>
      {/* Header */}
      <div className={`${styles.header} ${visible ? styles.visible : ''}`}>
        <span className={styles.eyebrow}>Get In Touch</span>
        <h2 className={styles.title}>Begin your<br /><em>bespoke journey</em></h2>
      </div>

      <div className={styles.grid}>
        {/* Left: Form */}
        <div className={`${styles.formSide} ${visible ? styles.visible : ''}`}
          style={{ transitionDelay: '0.15s' }}>
          <h3 className={styles.sideTitle}>Book a Fitting</h3>
          <p className={styles.sideNote}>Fill the form and we'll open WhatsApp with your details ready to send.</p>

          {sent ? (
            <div className={styles.successMsg}>
              <span className={styles.successIcon}>✦</span>
              <p>WhatsApp opened! We'll reply within a few hours.</p>
              <button className={styles.resetBtn} onClick={() => setSent(false)}>Send another →</button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Your Name *</label>
                  <input className={styles.input} name="name" value={form.name}
                    onChange={handleChange} placeholder="Priya Sharma" required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Phone Number *</label>
                  <input className={styles.input} name="phone" value={form.phone}
                    onChange={handleChange} placeholder="+91 98765 43210" required />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Occasion</label>
                  <select className={styles.input} name="occasion" value={form.occasion} onChange={handleChange}>
                    <option value="">Select...</option>
                    <option>Wedding / Bridal</option>
                    <option>Sangeet</option>
                    <option>Reception</option>
                    <option>Festive / Diwali</option>
                    <option>Engagement</option>
                    <option>Custom / Other</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Preferred Date</label>
                  <input className={styles.input} name="date" type="date"
                    value={form.date} onChange={handleChange} />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Message</label>
                <textarea className={`${styles.input} ${styles.textarea}`}
                  name="message" value={form.message} onChange={handleChange}
                  placeholder="Tell us about your vision, colours, budget..." rows={4} />
              </div>
              <button className={styles.submitBtn} type="submit" disabled={sending}>
                {sending ? 'Opening WhatsApp...' : 'Send via WhatsApp →'}
              </button>
            </form>
          )}
        </div>

        {/* Right: Contact links + map */}
        <div className={`${styles.infoSide} ${visible ? styles.visible : ''}`}
          style={{ transitionDelay: '0.3s' }}>

          {/* Quick contact buttons */}
          <div className={styles.quickLinks}>
            <a href={`https://wa.me/${BRAND?.whatsapp}`} target="_blank" rel="noreferrer"
              className={`${styles.quickBtn} ${styles.whatsapp}`}>
              <span className={styles.qIcon}>💬</span>
              <div>
                <p className={styles.qLabel}>WhatsApp</p>
                <p className={styles.qValue}>{BRAND?.phone}</p>
              </div>
            </a>
            <a href={BRAND?.instagramUrl} target="_blank" rel="noreferrer"
              className={`${styles.quickBtn} ${styles.instagram}`}>
              <span className={styles.qIcon}>📸</span>
              <div>
                <p className={styles.qLabel}>Instagram</p>
                <p className={styles.qValue}>@{BRAND?.instagram}</p>
              </div>
            </a>
            <a href={`tel:${BRAND?.phone}`}
              className={`${styles.quickBtn} ${styles.phone}`}>
              <span className={styles.qIcon}>📞</span>
              <div>
                <p className={styles.qLabel}>Call Us</p>
                <p className={styles.qValue}>{BRAND?.phone}</p>
              </div>
            </a>
          </div>

          {/* Address */}
          <div className={styles.addressCard}>
            <p className={styles.addressLabel}>📍 Visit Our Atelier</p>
            <p className={styles.address}>{BRAND?.address}</p>
            <p className={styles.hours}>Mon–Sat: 10am – 7pm &nbsp;|&nbsp; Sun: By appointment</p>
          </div>

          {/* Map embed */}
          <div className={styles.mapWrap}>
            <iframe
              src={BRAND?.mapEmbed}
              className={styles.map}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kriya Boutique Location"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
