import React, { useEffect, useState } from 'react'
import { api } from '../api'
import { Link } from 'react-router-dom'

export default function DatasetTable() {
  const [rows, setRows] = useState([])

  useEffect(()=>{
    api.get('/datasets').then(r=>setRows(r.data))
  }, [])

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="font-semibold mb-2">Public Datasets</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Name</th>
            <th>Source</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r=> (
            <tr key={r.id} className="border-b last:border-none">
              <td className="py-2">{r.name}</td>
              <td>{r.source_type}</td>
              <td>{new Date(r.created_at + 'Z').toLocaleString()}</td>
              <td><Link to={`/dataset/${r.id}`} className="text-blue-600">Open</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
