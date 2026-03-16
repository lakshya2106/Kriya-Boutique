// import { useState, useEffect } from 'react'
// import { dressAPI, categoryAPI, testimonialAPI, instaAPI, brandAPI, heroAPI } from '../services/api'

// // ── GENERIC FETCH HOOK ────────────────────────────────
// // - starts with loading state, no static fallback
// // - renders from live API only
// function useFetch(fetcher, initial = null) {
//   const [data,    setData]    = useState(initial)
//   const [loading, setLoading] = useState(true)
//   const [error,   setError]   = useState(null)

//   useEffect(() => {
//     let cancelled = false
//     setLoading(true)
//     fetcher()
//       .then(d => { if (!cancelled) setData(d) })
//       .catch(e => { if (!cancelled) setError(e) })
//       .finally(() => { if (!cancelled) setLoading(false) })
//     return () => { cancelled = true }
//   }, [])

//   return { data, loading, error }
// }

// export function useDresses(params = {}) {
//   return useFetch(
//     () => dressAPI.getAll(params).then(d => Array.isArray(d) ? d : []),
//     []
//   )
// }

// export function useCategories() {
//   return useFetch(
//     () => categoryAPI.getAll().then(d => Array.isArray(d) ? d : []),
//     []
//   )
// }

// export function useTestimonials() {
//   return useFetch(
//     () => testimonialAPI.getAll().then(d => Array.isArray(d) ? d : []),
//     []
//   )
// }

// export function useInsta() {
//   return useFetch(
//     () => instaAPI.getAll().then(d => Array.isArray(d) ? d : []),
//     []
//   )
// }

// export function useBrand() {
//   return useFetch(
//     () => brandAPI.get().then(obj => (obj && typeof obj === 'object') ? obj : {}),
//     {}
//   )
// }

// export function useHero() {
//   return useFetch(
//     () => heroAPI.get().then(r => r?.photo || null),
//     null
//   )
// }
import { useState, useEffect, useRef } from 'react'
import { dressAPI, categoryAPI, testimonialAPI, instaAPI, brandAPI, heroAPI } from '../services/api'

const BASE_URL = (import.meta.env.FRONTEND_API_URL || 'http://localhost:5000/api').replace('/api', '')

function useFetch(fetcher, initial = null) {
  const [data,    setData]    = useState(initial)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetcherRef.current()
      .then(d  => { if (!cancelled) { setData(d); setError(null) } })
      .catch(e => { if (!cancelled) setError(e) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return { data, loading, error }
}

export function useDresses() {
  return useFetch(
    () => dressAPI.getAll().then(d => Array.isArray(d) ? d : []),
    []
  )
}

export function useCategories() {
  return useFetch(
    () => categoryAPI.getAll().then(d => Array.isArray(d) ? d : []),
    []
  )
}

export function useTestimonials() {
  return useFetch(
    () => testimonialAPI.getAll().then(d => Array.isArray(d) ? d : []),
    []
  )
}

export function useInsta() {
  return useFetch(
    () => instaAPI.getAll().then(d => Array.isArray(d) ? d : []),
    []
  )
}

export function useBrand() {
  return useFetch(
    () => brandAPI.get().then(obj => (obj && typeof obj === 'object') ? obj : {}),
    {}
  )
}

export function useHero() {
  return useFetch(
    () => heroAPI.get().then(r => {
      const photo = r?.photo
      if (!photo) return null
      return photo.startsWith('/uploads/') ? `${BASE_URL}${photo}` : photo
    }),
    null
  )
} 