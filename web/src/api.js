import axios from 'axios'

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export const api = axios.create({
  baseURL: API_BASE + '/api',
})

export function authHeaders(token) {
  return { headers: { Authorization: `Bearer ${token}` } }
}
