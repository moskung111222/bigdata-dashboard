import React, { useState } from 'react'
import { api, authHeaders } from '../api'

export default function UploadExcel({ token, onUploaded }) {
  const [file, setFile] = useState(null)
  const [name, setName] = useState('')
  const [status, setStatus] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!file) return
    setStatus('Uploading...')
    const form = new FormData()
    form.append('file', file)
    form.append('name', name || file.name)
    try {
      const res = await api.post('/datasets/upload', form, {
        ...authHeaders(token),
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      })
      setStatus('Uploaded ✔')
      onUploaded && onUploaded(res.data)
    } catch (e) {
      setStatus(e?.response?.data?.error || 'Upload failed')
    }
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-semibold mb-2">Upload Excel</h2>
      <form onSubmit={submit} className="flex items-center gap-3">
        <input className="border px-2 py-1 rounded" placeholder="Dataset Name (optional)" value={name} onChange={e=>setName(e.target.value)} />
        <input type="file" accept=".xlsx" onChange={e=>setFile(e.target.files?.[0])} />
        <button className="bg-black text-white px-3 py-1 rounded">Upload</button>
        <div className="text-sm">{status}</div>
      </form>
    </div>
  )
}
