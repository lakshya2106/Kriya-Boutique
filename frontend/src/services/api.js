// ── KRIYA BOUTIQUE — API SERVICE ─────────────────────
// All backend calls go through this file.
// Change BASE_URL when you deploy the backend.

const BASE_URL = import.meta.env.FRONTEND_API_URL || 'http://localhost:5000/api'

// ── HELPERS ───────────────────────────────────────────
function getToken() {
  return localStorage.getItem('kb_admin_token')
}

async function request(method, path, body = null, isFormData = false) {
  const headers = {}
  const token   = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (!isFormData && body) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : null,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

const get    = (path)           => request('GET',    path)
const post   = (path, body, fd) => request('POST',   path, body, fd)
const put    = (path, body, fd) => request('PUT',    path, body, fd)
const del    = (path)           => request('DELETE', path)

// ── AUTH ──────────────────────────────────────────────
export const authAPI = {
  login:  (username, password) => post('/auth/login', { username, password }),
  verify: ()                   => get('/auth/verify'),
}

// ── DRESSES ───────────────────────────────────────────
export const dressAPI = {
  getAll:      (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return get(`/dresses${q ? '?' + q : ''}`)
  },
  getOne:      (id)          => get(`/dresses/${id}`),

  create: (formData)         => post('/dresses', formData, true),
  update: (id, formData)     => put(`/dresses/${id}`, formData, true),
  delete: (id)               => del(`/dresses/${id}`),
  deletePhoto: (id, photoPath) =>
    request('DELETE', `/dresses/${id}/photo`, { photoPath }),
}

// ── CATEGORIES ────────────────────────────────────────
export const categoryAPI = {
  getAll:  ()         => get('/categories'),
  create:  (data)     => post('/categories', data),
  update:  (id, data) => put(`/categories/${id}`, data),
  delete:  (id)       => del(`/categories/${id}`),
}

// ── TESTIMONIALS ──────────────────────────────────────
export const testimonialAPI = {
  getAll:  ()         => get('/testimonials'),
  create:  (data)     => post('/testimonials', data),
  update:  (id, data) => put(`/testimonials/${id}`, data),
  delete:  (id)       => del(`/testimonials/${id}`),
}

// ── INSTAGRAM ─────────────────────────────────────────
export const instaAPI = {
  getAll:  ()            => get('/insta'),
  create:  (formData)    => post('/insta', formData, true),
  update:  (id, formData)=> put(`/insta/${id}`, formData, true),
  delete:  (id)          => del(`/insta/${id}`),
}

// ── BRAND SETTINGS ────────────────────────────────────
export const brandAPI = {
  get:    ()     => get('/brand'),
  update: (data) => put('/brand', data),
}

// ── HERO PHOTO ────────────────────────────────────────
export const heroAPI = {
  get:    ()         => get('/hero'),
  upload: (formData) => post('/hero', formData, true),
}
