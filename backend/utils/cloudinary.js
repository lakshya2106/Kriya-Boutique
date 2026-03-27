const { v2: cloudinary } = require('cloudinary')

const hasCloudinaryConfig = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
)

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

function isCloudinaryUrl(value) {
  return typeof value === 'string' && /res\.cloudinary\.com/i.test(value)
}

function getPublicIdFromUrl(url) {
  if (!isCloudinaryUrl(url)) return null
  // Example:
  // https://res.cloudinary.com/<cloud>/image/upload/v1234/kriya-boutique/abc.jpg
  const m = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+(?:\?.*)?$/)
  return m?.[1] || null
}

async function destroyCloudinaryAssetByUrl(url) {
  if (!hasCloudinaryConfig) return false
  const publicId = getPublicIdFromUrl(url)
  if (!publicId) return false
  try {
    await cloudinary.uploader.destroy(publicId)
    return true
  } catch {
    return false
  }
}

module.exports = {
  cloudinary,
  hasCloudinaryConfig,
  isCloudinaryUrl,
  destroyCloudinaryAssetByUrl,
}
