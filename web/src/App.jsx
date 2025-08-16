import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import PublicView from './pages/PublicView'
import DatasetDetail from './pages/DatasetDetail'
import LoginForm from './components/LoginForm'

function Navbar({ token, onLogout }) {
  return (
    <div className="w-full bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-semibold">BigData Dashboard</Link>
        <Link to="/public">Public</Link>
        {token && <Link to="/admin">Admin</Link>}
      </div>
      <div>
        {token
          ? <button className="bg-gray-700 px-3 py-1 rounded" onClick={onLogout}>Logout</button>
          : <Link to="/login" className="bg-gray-700 px-3 py-1 rounded">Login</Link>}
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
    <div className="min-h-screen bg-gray-50">
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
