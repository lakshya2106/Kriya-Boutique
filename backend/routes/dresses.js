const router = require('express').Router()
const { Dress } = require('../models')
const auth   = require('../middleware/auth')
const upload = require('../middleware/upload')
const fs     = require('fs')
const path   = require('path')
const { destroyCloudinaryAssetByUrl, isCloudinaryUrl } = require('../utils/cloudinary')

// GET /api/dresses — public, all dresses
router.get('/', async (req, res) => {
  try {
    const { category, badge } = req.query
    const filter = {}
    if (category && category !== 'all') {
      if (category === 'new') filter.badge = 'new'
      else filter.category = category
    }
    if (badge) filter.badge = badge

    const dresses = await Dress.find(filter).sort({ order: 1, createdAt: -1 })
    res.json(dresses)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/dresses/:id — single dress
router.get('/:id', async (req, res) => {
  try {
    const dress = await Dress.findById(req.params.id)
    if (!dress) return res.status(404).json({ error: 'Not found' })
    res.json(dress)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/dresses — create (admin only) + up to 5 photos
router.post('/', auth, upload.array('photos', 5), async (req, res) => {
  try {
    const data  = JSON.parse(req.body.data || '{}')
    const files = req.files || []
    const photoPaths = files.map(f => f.path || `/uploads/${f.filename}`)

    // Auto-assign num if not provided
    if (!data.num) {
      const count = await Dress.countDocuments()
      data.num = String(count + 1).padStart(2, '0')
    }

    // Parse swatches/colors if they came as strings
    if (typeof data.swatches === 'string') data.swatches = JSON.parse(data.swatches)
    if (typeof data.colors   === 'string') data.colors   = JSON.parse(data.colors)
data.showcase = data.showcase === true || data.showcase === 'true'
    const dress = await Dress.create({ ...data, photos: photoPaths })
    res.status(201).json(dress)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/dresses/:id — update dress (admin only), can add new photos
router.put('/:id', auth, upload.array('photos', 5), async (req, res) => {
  try {
    const data  = JSON.parse(req.body.data || '{}')
    const files = req.files || []
    const newPhotoPaths = files.map(f => f.path || `/uploads/${f.filename}`)

    if (typeof data.swatches === 'string') data.swatches = JSON.parse(data.swatches)
    if (typeof data.colors   === 'string') data.colors   = JSON.parse(data.colors)
    if (typeof data.photos   === 'string') data.photos   = JSON.parse(data.photos)
data.showcase = data.showcase === true || data.showcase === 'true'
    // Merge existing kept photos + new uploads
    const existingPhotos = Array.isArray(data.photos) ? data.photos : []
    data.photos = [...existingPhotos, ...newPhotoPaths]

    const dress = await Dress.findByIdAndUpdate(req.params.id, data, { new: true })
    if (!dress) return res.status(404).json({ error: 'Not found' })
    res.json(dress)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/dresses/:id — delete dress + its photos (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const dress = await Dress.findByIdAndDelete(req.params.id)
    if (!dress) return res.status(404).json({ error: 'Not found' })

    // Delete photo files from disk
    if (Array.isArray(dress.photos)) {
      for (const p of dress.photos) {
        if (isCloudinaryUrl(p)) {
          await destroyCloudinaryAssetByUrl(p)
          continue
        }
        const photoPath = String(p || '').replace(/^\/+/, '') // DB stores paths like `/uploads/<file>`
        if (!photoPath) continue
        const fp = path.join(__dirname, '..', photoPath)
        if (fs.existsSync(fp)) fs.unlinkSync(fp)
      }
    }

    res.json({ message: 'Deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/dresses/:id/photo — remove a single photo from a dress
router.delete('/:id/photo', auth, async (req, res) => {
  try {
    const { photoPath } = req.body
    const dress = await Dress.findById(req.params.id)
    if (!dress) return res.status(404).json({ error: 'Not found' })

    dress.photos = dress.photos.filter(p => p !== photoPath)
    await dress.save()

    // Delete file from disk
    if (isCloudinaryUrl(photoPath)) {
      await destroyCloudinaryAssetByUrl(photoPath)
    } else {
      const normalized = String(photoPath || '').replace(/^\/+/, '')
      const fp = path.join(__dirname, '..', normalized)
      if (fs.existsSync(fp)) fs.unlinkSync(fp)
    }

    res.json(dress)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
