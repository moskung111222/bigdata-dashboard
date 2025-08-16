import React, { useState } from 'react'
import { api, authHeaders } from '../api'

export default function ImportGoogleSheet({ token, onImported }) {
  const [name, setName] = useState('My Google Sheet')
  const [sheetId, setSheetId] = useState('')
  const [range, setRange] = useState('A1:Z10000')
  const [status, setStatus] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setStatus('Importing...')
    try {
      const res = await api.post('/google/import', { name, sheetId, range }, authHeaders(token))
      setStatus(`Imported ${res.data.rowsImported} rows ✔`)
      onImported && onImported(res.data)
    } catch (e) {
      setStatus(e?.response?.data?.error || 'Import failed')
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-blue-100">
      <h2 className="font-bold text-lg text-blue-600 mb-2">นำเข้าข้อมูล Google Sheet</h2>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <input className="border px-2 py-2 rounded-lg bg-blue-50" placeholder="ชื่อชุดข้อมูล" value={name} onChange={e=>setName(e.target.value)} />
        <input className="border px-2 py-2 rounded-lg bg-blue-50" placeholder="Sheet ID" value={sheetId} onChange={e=>setSheetId(e.target.value)} />
        <input className="border px-2 py-2 rounded-lg bg-blue-50" placeholder="ช่วงข้อมูล (A1:Z10000)" value={range} onChange={e=>setRange(e.target.value)} />
        <button className="bg-gradient-to-r from-blue-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform">นำเข้า</button>
      </form>
      <div className="text-sm mt-1">{status}</div>
      <p className="text-xs text-gray-500 mt-2">
        กรุณาแชร์ Google Sheet ให้กับอีเมล service account (จาก <code>server/service-account.json</code>)
      </p>
    </div>
  )
}
