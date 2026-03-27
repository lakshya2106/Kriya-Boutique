const multer = require('multer')
const path   = require('path')
const fs     = require('fs')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const { cloudinary, hasCloudinaryConfig } = require('../utils/cloudinary')

const uploadDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase()
    const name = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`
    cb(null, name)
  },
})

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'kriya-boutique',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    public_id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
  }),
})

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp']
  const ext = path.extname(file.originalname).toLowerCase()
  if (allowed.includes(ext)) cb(null, true)
  else cb(new Error('Only jpg, png, webp images allowed'), false)
}

const upload = multer({
  storage: hasCloudinaryConfig ? cloudinaryStorage : diskStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
})

module.exports = upload
