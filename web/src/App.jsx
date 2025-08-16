import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import PublicView from './pages/PublicView'
import DatasetDetail from './pages/DatasetDetail'
import LoginForm from './components/LoginForm'

function Navbar({ token, onLogout }) {
  return (
    <div className="w-full bg-gradient-to-r from-blue-500 via-pink-400 to-yellow-400 text-white px-4 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-xl tracking-wide drop-shadow">แดชบอร์ดข้อมูล (BigData)</Link>
        <Link to="/public" className="hover:underline">สาธารณะ</Link>
        {token && <Link to="/admin" className="hover:underline">ผู้ดูแล</Link>}
      </div>
      <div>
        {token
          ? <button className="bg-white text-pink-600 font-semibold px-4 py-1 rounded-lg shadow hover:bg-pink-100" onClick={onLogout}>ออกจากระบบ</button>
          : <Link to="/login" className="bg-white text-blue-600 font-semibold px-4 py-1 rounded-lg shadow hover:bg-blue-100">เข้าสู่ระบบ</Link>}
      </div>
    </div>
  )
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('token')
    setToken(null)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-100">
      <Navbar token={token} onLogout={handleLogout} />
      <div className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/public" replace />} />
          <Route path="/public" element={<PublicView />} />
          <Route path="/dataset/:id" element={<DatasetDetail />} />
          <Route path="/login" element={<LoginForm onLogin={(t)=>{localStorage.setItem('token', t); setToken(t); navigate('/admin')}} />} />
          <Route path="/admin" element={token ? <AdminDashboard token={token} /> : <Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  )
}
