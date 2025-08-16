import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api'

export default function DatasetDetail() {
  const { id } = useParams()
  const [info, setInfo] = useState(null)
  const [sheet, setSheet] = useState('')
  const [rows, setRows] = useState([])
  const [offset, setOffset] = useState(0)

  useEffect(()=>{
    api.get(`/datasets/${id}/tables`).then(r => {
      setInfo(r.data)
      if (r.data.tables[0]) setSheet(r.data.tables[0].sheet_name)
    })
  }, [id])

  useEffect(()=>{
    if (!sheet) return
    api.get(`/datasets/${id}/data`, { params: { sheet, offset, limit: 100 } }).then(r => setRows(r.data.rows))
  }, [sheet, id, offset])

  if (!info) return null
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h1 className="text-2xl font-semibold mb-2">{info.dataset.name}</h1>
      <div className="flex gap-2 mb-3">
        {info.tables.map(t => (
          <button key={t.id} onClick={()=>{setSheet(t.sheet_name); setOffset(0)}} className={`px-3 py-1 rounded border ${sheet===t.sheet_name?'bg-black text-white':'bg-white'}`}>
            {t.sheet_name} <span className="text-xs text-gray-500">({t.row_count})</span>
          </button>
        ))}
      </div>
      <div className="overflow-auto border rounded">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-100">
              {rows[0] && Object.keys(rows[0]).map(k => <th key={k} className="px-2 py-1 text-left">{k}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i) => (
              <tr key={i} className="border-t">
                {Object.keys(rows[0]||{}).map(k => <td key={k} className="px-2 py-1">{String(r[k])}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 flex gap-2">
        <button className="px-3 py-1 rounded border" onClick={()=>setOffset(Math.max(0, offset-100))}>Prev</button>
        <button className="px-3 py-1 rounded border" onClick={()=>setOffset(offset+100)}>Next</button>
      </div>
    </div>
  )
}
