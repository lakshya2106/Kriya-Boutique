const router = require('express').Router()
const { Category, Testimonial, InstaPost, Brand, Hero } = require('../models')
const auth   = require('../middleware/auth')
const upload = require('../middleware/upload')
const fs     = require('fs')
const path   = require('path')

// ══════════════════════════════════════════════════════
//  CATEGORIES
// ══════════════════════════════════════════════════════

// GET /api/categories
router.get('/categories', async (req, res) => {
  try {
    const cats = await Category.find().sort({ order: 1 })
    res.json(cats)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// POST /api/categories (admin)
router.post('/categories', auth, async (req, res) => {
  try {
    const cat = await Category.create(req.body)
    res.status(201).json(cat)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

// PUT /api/categories/:id (admin)
router.put('/categories/:id', auth, async (req, res) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!cat) return res.status(404).json({ error: 'Not found' })
    res.json(cat)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

// DELETE /api/categories/:id (admin)
router.delete('/categories/:id', auth, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ══════════════════════════════════════════════════════
//  TESTIMONIALS
// ══════════════════════════════════════════════════════

// GET /api/testimonials
router.get('/testimonials', async (req, res) => {
  try {
    // const t = await Testimonial.find({ visible: true }).sort({ order: 1, createdAt: -1 })
    const t = await Testimonial.find({ visible: { $ne: false } }).sort({ order: 1, createdAt: -1 })
    res.json(t)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// POST /api/testimonials (admin)
router.post('/testimonials', auth, async (req, res) => {
  try {
    const t = await Testimonial.create(req.body)
    res.status(201).json(t)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

// PUT /api/testimonials/:id (admin)
router.put('/testimonials/:id', auth, async (req, res) => {
  try {
    const t = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!t) return res.status(404).json({ error: 'Not found' })
    res.json(t)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

// DELETE /api/testimonials/:id (admin)
router.delete('/testimonials/:id', auth, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ══════════════════════════════════════════════════════
//  INSTAGRAM POSTS
// ══════════════════════════════════════════════════════

// GET /api/insta
router.get('/insta', async (req, res) => {
  try {
    const posts = await InstaPost.find().sort({ order: 1, createdAt: -1 })
    res.json(posts)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// POST /api/insta (admin) + photo upload
router.post('/insta', auth, upload.single('photo'), async (req, res) => {
  try {
    const data = { ...req.body }
    if (req.file) data.photo = `/uploads/${req.file.filename}`
    const post = await InstaPost.create(data)
    res.status(201).json(post)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

// PUT /api/insta/:id (admin)
router.put('/insta/:id', auth, upload.single('photo'), async (req, res) => {
  try {
    const data = { ...req.body }
    if (req.file) data.photo = `/uploads/${req.file.filename}`
    const post = await InstaPost.findByIdAndUpdate(req.params.id, data, { new: true })
    if (!post) return res.status(404).json({ error: 'Not found' })
    res.json(post)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

// DELETE /api/insta/:id (admin)
router.delete('/insta/:id', auth, async (req, res) => {
  try {
    const post = await InstaPost.findByIdAndDelete(req.params.id)
    if (post?.photo?.startsWith('/uploads/')) {
      const fp = path.join(__dirname, '../', post.photo)
      if (fs.existsSync(fp)) fs.unlinkSync(fp)
    }
    res.json({ message: 'Deleted' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ══════════════════════════════════════════════════════
//  BRAND SETTINGS  (stored as key-value pairs)
// ══════════════════════════════════════════════════════

// GET /api/brand — returns all settings as one flat object
router.get('/brand', async (req, res) => {
  try {
    const rows = await Brand.find()
    const obj  = {}
    rows.forEach(r => {
      // value could be stored as string or mixed — always flatten
      obj[r.key] = r.value
    })
    res.json(obj)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// PUT /api/brand — upsert all settings (admin)
router.put('/brand', auth, async (req, res) => {
  try {
    const updates = req.body // { name, whatsapp, instagram, address, ... }
    await Promise.all(
      Object.entries(updates).map(([key, value]) =>
        Brand.findOneAndUpdate({ key }, { key, value }, { upsert: true, new: true })
      )
    )
    res.json({ message: 'Brand settings updated' })
  } catch (err) { res.status(400).json({ error: err.message }) }
})

// ══════════════════════════════════════════════════════
//  HERO PHOTO
// ══════════════════════════════════════════════════════

// GET /api/hero
router.get('/hero', async (req, res) => {
  try {
    const hero = await Hero.findOne().sort({ createdAt: -1 })
    res.json({ photo: hero ? hero.photo : '/hero-model.png' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// POST /api/hero — upload new hero photo (admin)
router.post('/hero', auth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No photo uploaded' })
    const photo = `/uploads/${req.file.filename}`
    // Delete old hero file
    const old = await Hero.findOne().sort({ createdAt: -1 })
    if (old?.photo?.startsWith('/uploads/')) {
      const fp = path.join(__dirname, '../', old.photo)
      if (fs.existsSync(fp)) fs.unlinkSync(fp)
    }
    await Hero.deleteMany({}) // only keep one hero
    const hero = await Hero.create({ photo })
    res.json(hero)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

module.exports = router
