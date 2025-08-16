import React, { useEffect, useState } from 'react'
import { api } from '../api'
import { Link } from 'react-router-dom'

export default function DatasetTable() {
  const [rows, setRows] = useState([])

  useEffect(()=>{
    api.get('/datasets').then(r=>setRows(r.data))
  }, [])

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-pink-100">
      <h2 className="font-bold text-lg text-pink-600 mb-2">ชุดข้อมูลสาธารณะ</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b bg-gradient-to-r from-blue-100 to-pink-100">
            <th className="py-2">ชื่อชุดข้อมูล</th>
            <th>แหล่งที่มา</th>
            <th>วันที่สร้าง</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r=> (
            <tr key={r.id} className="border-b last:border-none hover:bg-yellow-50 transition">
              <td className="py-2 font-semibold text-blue-700">{r.name}</td>
              <td>{r.source_type}</td>
              <td>{new Date(r.created_at + 'Z').toLocaleString('th-TH')}</td>
              <td><Link to={`/dataset/${r.id}`} className="text-pink-600 font-bold hover:underline">เปิดดู</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
