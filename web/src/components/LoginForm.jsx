import React, { useState } from 'react'
import { API_BASE, api } from '../api'

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123')
  const [showChange, setShowChange] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [changeStatus, setChangeStatus] = useState('')
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
    <div className="max-w-md mx-auto bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 p-8 rounded-2xl shadow-lg border border-blue-200">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">เข้าสู่ระบบผู้ดูแล</h1>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-sm">อีเมล</label>
          <input className="w-full border rounded-lg px-3 py-2 bg-white" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">รหัสผ่าน</label>
          <input type="password" className="w-full border rounded-lg px-3 py-2 bg-white" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="bg-gradient-to-r from-blue-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform">เข้าสู่ระบบ</button>
      </form>
      <div className="mt-4 text-center">
        <button className="text-blue-600 underline text-sm" onClick={()=>setShowChange(v=>!v)}>
          {showChange ? 'ซ่อนฟอร์มเปลี่ยนรหัสผ่าน' : 'เปลี่ยนชื่อผู้ใช้/รหัสผ่าน'}
        </button>
      </div>
      {showChange && (
        <form className="mt-4 space-y-3 bg-white p-4 rounded-xl border border-pink-100" onSubmit={async e=>{
          e.preventDefault();
          setChangeStatus('');
          try {
            await api.post('/auth/change-admin', { email: newEmail, password: newPassword })
            setChangeStatus('เปลี่ยนข้อมูลสำเร็จ! (Success)')
          } catch (e) {
            setChangeStatus(e?.response?.data?.error || 'เปลี่ยนข้อมูลไม่สำเร็จ')
          }
        }}>
          <div>
            <label className="text-sm">อีเมลใหม่</label>
            <input className="w-full border rounded-lg px-3 py-2 bg-blue-50" value={newEmail} onChange={e=>setNewEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">รหัสผ่านใหม่</label>
            <input type="password" className="w-full border rounded-lg px-3 py-2 bg-blue-50" value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
          </div>
          {changeStatus && <div className="text-green-600 text-sm">{changeStatus}</div>}
          <button className="bg-gradient-to-r from-pink-500 to-yellow-400 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform">บันทึก</button>
        </form>
      )}
    </div>
  )
}
