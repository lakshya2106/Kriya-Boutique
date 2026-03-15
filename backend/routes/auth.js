const router  = require('express').Router()
const jwt     = require('jsonwebtoken')
const bcrypt  = require('bcryptjs')

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { username, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({ token, message: 'Login successful' })
})

// GET /api/auth/verify  — frontend uses this to check if token still valid
router.get('/verify', require('../middleware/auth'), (req, res) => {
  res.json({ valid: true, admin: req.admin })
})

module.exports = router
