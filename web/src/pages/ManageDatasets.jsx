import React, { useEffect, useState } from 'react'
import { api, authHeaders } from '../api'

export default function ManageDatasets({ token }) {
  const [datasets, setDatasets] = useState([])
  const [name, setName] = useState('')
  const [source, setSource] = useState('')
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const [editing, setEditing] = useState(null)
  const [editName, setEditName] = useState('')
  const [editSource, setEditSource] = useState('')

  useEffect(() => {
    fetchDatasets()
  }, [])

  function fetchDatasets() {
    api.get('/datasets', authHeaders(token)).then(r => setDatasets(r.data))
  }

  async function handleUpload(e) {
    e.preventDefault()
    setStatus('')
    const form = new FormData()
    form.append('name', name)
    form.append('source_type', source)
    if (file) form.append('file', file)
    try {
      await api.post('/datasets/upload', form, { ...authHeaders(token), headers: { 'Content-Type': 'multipart/form-data' } })
      setStatus('อัปโหลดสำเร็จ!')
      setName(''); setSource(''); setFile(null)
      fetchDatasets()
    } catch (e) {
      setStatus('อัปโหลดล้มเหลว')
    }
  }

  async function handleEdit(id) {
    setStatus('')
    try {
      await api.put(`/datasets/${id}`, { name: editName, source_type: editSource }, authHeaders(token))
      setEditing(null)
      fetchDatasets()
    } catch (e) {
      setStatus('แก้ไขล้มเหลว')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('ลบชุดข้อมูลนี้?')) return
    setStatus('')
    try {
      await api.delete(`/datasets/${id}`, authHeaders(token))
      fetchDatasets()
    } catch (e) {
      setStatus('ลบล้มเหลว')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100 max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-pink-600 mb-4">จัดการชุดข้อมูล</h2>
      <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6">
        <input className="border px-2 py-2 rounded-lg bg-blue-50" placeholder="ชื่อชุดข้อมูล" value={name} onChange={e=>setName(e.target.value)} required />
        <input className="border px-2 py-2 rounded-lg bg-blue-50" placeholder="แหล่งที่มา" value={source} onChange={e=>setSource(e.target.value)} required />
        <input type="file" className="border px-2 py-2 rounded-lg bg-blue-50" onChange={e=>setFile(e.target.files[0])} required />
        <button className="bg-gradient-to-r from-blue-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform">อัปโหลด</button>
      </form>
      {status && <div className="text-pink-600 mb-2">{status}</div>}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b bg-gradient-to-r from-blue-100 to-pink-100">
            <th className="py-2">ชื่อชุดข้อมูล</th>
            <th>แหล่งที่มา</th>
            <th>แก้ไข</th>
            <th>ลบ</th>
          </tr>
        </thead>
        <tbody>
          {datasets.map(ds => (
            <tr key={ds.id} className="border-b last:border-none hover:bg-yellow-50 transition">
              <td className="py-2 font-semibold text-blue-700">
                {editing === ds.id ? (
                  <input className="border px-2 py-1 rounded bg-yellow-50" value={editName} onChange={e=>setEditName(e.target.value)} />
                ) : ds.name}
              </td>
              <td>
                {editing === ds.id ? (
                  <input className="border px-2 py-1 rounded bg-yellow-50" value={editSource} onChange={e=>setEditSource(e.target.value)} />
                ) : ds.source_type}
              </td>
              <td>
                {editing === ds.id ? (
                  <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={()=>handleEdit(ds.id)}>บันทึก</button>
                ) : (
                  <button className="bg-yellow-400 text-white px-2 py-1 rounded mr-2" onClick={()=>{setEditing(ds.id); setEditName(ds.name); setEditSource(ds.source_type)}}>แก้ไข</button>
                )}
              </td>
              <td>
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={()=>handleDelete(ds.id)}>ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
