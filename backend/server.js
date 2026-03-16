require('dotenv').config()
const express  = require('express')
const mongoose = require('mongoose')
const cors     = require('cors')
const path     = require('path')
const fs       = require('fs')

const app = express()

// ── ENSURE UPLOADS DIR EXISTS ─────────────────────────
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

// ── CORS ──────────────────────────────────────────────
// Allow all localhost ports in dev + your production frontend URL
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true)
    // Allow any localhost port during development
    if (origin.match(/^http:\/\/localhost:\d+$/) || origin.match(/^http:\/\/127\.0\.0\.1:\d+$/)) {
      return callback(null, true)
    }
    // Allow your configured frontend URL (Vercel etc.)
    const allowed = (process.env.FRONTEND_URL || '').split(',').map(u => u.trim()).filter(Boolean)
    if (allowed.includes(origin)) return callback(null, true)
    // Block unknown origins in production
    callback(new Error(`CORS: origin ${origin} not allowed`))
  },
  credentials: true,
}))

// ── BODY PARSERS ──────────────────────────────────────
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── STATIC: serve uploaded photos ─────────────────────
app.use('/uploads', express.static(uploadsDir))

// ── ROUTES ────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'))
app.use('/api/seed',    require('./routes/seed'))
app.use('/api/dresses', require('./routes/dresses'))
app.use('/api',         require('./routes/other'))

// ── HEALTH CHECK ──────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Kriya Boutique API running',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  })
})

// ── 404 HANDLER ───────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` })
})

// ── ERROR HANDLER ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌', err.message)
  // Don't leak CORS errors with 500 — use 403
  if (err.message?.startsWith('CORS:')) return res.status(403).json({ error: err.message })
  res.status(500).json({ error: err.message || 'Something went wrong' })
})

// ── CONNECT DB & START ────────────────────────────────
const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected')
    // Seed default brand settings if DB is empty
    await seedBrandIfEmpty()
    app.listen(PORT, () => {
      console.log(`🚀 Kriya Boutique API → http://localhost:${PORT}`)
      console.log(`   Health: http://localhost:${PORT}/api/health`)
      console.log(`   Admin login: ${process.env.ADMIN_USERNAME} / ${process.env.ADMIN_PASSWORD}`)
    })
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  })

// ── SEED DEFAULT BRAND SETTINGS ───────────────────────
// All defaults live in config/brandDefaults.js — edit there!
async function seedBrandIfEmpty() {
  const { Brand } = require('./models')
  const count = await Brand.countDocuments()
  if (count > 0) return // already seeded — edit via Admin Panel

  const defaults = require('./config/brandDefaults')

  await Promise.all(
    Object.entries(defaults).map(([key, value]) =>
      Brand.findOneAndUpdate({ key }, { key, value }, { upsert: true, new: true })
    )
  )
  console.log('✅ Default brand settings seeded from config/brandDefaults.js')
}
