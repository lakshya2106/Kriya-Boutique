// ═══════════════════════════════════════════════════════════════
//  KRIYA BOUTIQUE — BRAND DEFAULTS
//  ✦ THIS IS THE ONE PLACE TO EDIT ALL BOUTIQUE DETAILS ✦
//  These values are seeded into the database on first run.
//  After that, edit everything via the Admin Panel → Settings.
// ═══════════════════════════════════════════════════════════════

module.exports = {

  // ── IDENTITY ──────────────────────────────────────────────────
  name:         'Kriya Boutique',
  tagline:      'Indian Couture, Reimagined',
  founded:      '2018',

  // ── LOCATION & ADDRESS ────────────────────────────────────────
  location:     'Udaipur, Rajasthan',
  address:      'B-12, Near City Palace Road, Udaipur, Rajasthan 313001',

  // ── CONTACT ───────────────────────────────────────────────────
  phone:        '+91 98765 43210',
  whatsapp:     '919876543210',   // no +, no spaces
  email:        'hello@kriyaboutique.com',

  // ── SOCIAL ────────────────────────────────────────────────────
  instagram:    'kriyaboutique',
  instagramUrl: 'https://instagram.com/kriyaboutique',

  // ── ABOUT TEXT ────────────────────────────────────────────────
  about: 'Born in the heart of Udaipur, Kriya Boutique is a bespoke Indian couture house dedicated to handcrafted lehengas, bridal wear, and festive outfits. Every piece is made with intention — each stitch a love letter to the woman who wears it.',

  // ── GOOGLE MAPS EMBED URL ─────────────────────────────────────
  // Replace with your actual Google Maps embed URL
  mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3628.3!2d73.6856!3d24.5854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3967e5e01b83fd4d%3A0x5b7e7d3f!2sCity+Palace+Rd%2C+Udaipur%2C+Rajasthan!5e0!3m2!1sen!2sin!4v1234567890',

  // ── HERO PHOTO ────────────────────────────────────────────────
  heroPhoto: '/hero-model.png',

  // ── STATS (shown in About section) ───────────────────────────
  statBrides:  '500+',
  statYears:   '7+',
  statCraft:   '100%',

  // ── QUOTE (shown in scrolling quote section) ──────────────────
  siteQuote: 'She wears her culture like armour — beautiful, fearless, and unforgettable',

  // ── MARQUEE TEXT (space-separated scrolling banner items) ─────
  marqueeText: 'Bridal Lehengas|Bespoke Couture|Udaipur Atelier|Handcrafted Zardozi|Limited Pieces|For Every Woman',

  // ── INTRO TEXT ────────────────────────────────────────────────
  introText1: 'At Kriya Boutique, we create bespoke Indian couture — lehengas, bridal wear, and festive outfits crafted entirely by hand in our Udaipur atelier. Each piece is a dialogue between heritage craft and contemporary vision.',
  introText2: 'We work in small batches, never mass production. The result is something rare: a lehenga that moves with you, celebrates your culture, and tells your story.',

  // ── ABOUT PAGE EXTRA PARA ─────────────────────────────────────
  aboutPara2: 'We believe every woman deserves a lehenga that fits not just her body but her soul. Our karigars bring decades of inherited knowledge — zardozi, gota patti, banarasi weaving — into every single piece we create.',
  // ── PROCESS STEPS (shown in "How we create" section) ─────────
  // Edit via Admin Panel → Settings → Process Steps
  processSteps: [
    {
      num: '01',
      icon: '\u2726',
      title: 'Consultation',
      desc: 'We begin with a personal meeting — in-person at our Udaipur atelier or via video call — to understand your occasion, vision, measurements, and the story you want to wear.',
    },
    {
      num: '02',
      icon: '\u25c8',
      title: 'Design & Fabric',
      desc: 'Our designers sketch custom concepts and select fabrics — silks, organzas, banarasi weaves — from our curated collection. You approve every detail before we begin.',
    },
    {
      num: '03',
      icon: '\u274b',
      title: 'Craft & Fittings',
      desc: 'Two to three fittings refine every pleat, embroidery, and hem. Our karigars work by hand — the embroidery alone can take weeks.',
    },
    {
      num: '04',
      icon: '\u25ce',
      title: 'Delivery',
      desc: 'Your lehenga arrives in our signature box, steamed and preserved, ready for your most unforgettable moment. We ship across India and internationally.',
    },
  ],

}
