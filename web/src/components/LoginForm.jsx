import React, { useState } from 'react'
import { API_BASE, api } from '../api'

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/auth/login', { email, password })
      onLogin(res.data.token)
    } catch (e) {
      setError(e?.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-semibold mb-4">Admin Login</h1>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-sm">Email</label>
          <input className="w-full border rounded px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Password</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="bg-black text-white px-4 py-2 rounded">Login</button>
      </form>
    </div>
  )
}
