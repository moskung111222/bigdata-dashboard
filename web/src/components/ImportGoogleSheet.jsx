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
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-semibold mb-2">Import Google Sheet</h2>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <input className="border px-2 py-1 rounded" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="Sheet ID" value={sheetId} onChange={e=>setSheetId(e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="Range (optional)" value={range} onChange={e=>setRange(e.target.value)} />
        <button className="bg-black text-white px-3 py-1 rounded">Import</button>
      </form>
      <div className="text-sm mt-1">{status}</div>
      <p className="text-xs text-gray-500 mt-2">
        Share the Google Sheet with your service account email (from <code>server/service-account.json</code>).
      </p>
    </div>
  )
}
