import React, { useEffect, useState } from 'react'
import { api, authHeaders } from '../api'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function ChartBuilder({ token }) {
  const [datasets, setDatasets] = useState([])
  const [selected, setSelected] = useState(null)
  const [tables, setTables] = useState([])
  const [sheet, setSheet] = useState('')
  const [rows, setRows] = useState([])
  const [xKey, setXKey] = useState('')
  const [yKey, setYKey] = useState('')
  const [chartType, setChartType] = useState('bar')
  const [title, setTitle] = useState('My Chart')
  const [isPublic, setIsPublic] = useState(true)

  useEffect(()=>{
    api.get('/datasets', { params: { admin: 1 } }).then(r=>setDatasets(r.data))
  }, [])

  useEffect(()=>{
    if (!selected) return
    api.get(`/datasets/${selected}/tables`).then(r=>{
      setTables(r.data.tables || [])
      if (r.data.tables[0]) setSheet(r.data.tables[0].sheet_name)
    })
  }, [selected])

  useEffect(()=>{
    if (!selected || !sheet) return
    api.get(`/datasets/${selected}/data`, { params: { sheet, limit: 500 } }).then(r=> setRows(r.data.rows))
  }, [selected, sheet])

  const currentCols = rows[0] ? Object.keys(rows[0]) : []

  async function saveChart() {
    const payload = {
      title,
      chart_type: chartType,
      dataset_id: selected,
      sheet_name: sheet,
      config: { xKey, yKey, public: isPublic, sort_order: 0 }
    }
    await api.post('/charts', payload, authHeaders(token))
    alert('Saved chart ✔')
  }

  function Preview() {
    if (!rows.length || !xKey || !yKey) return <div className="text-sm text-gray-500">Select dataset/sheet and columns to preview.</div>
    const data = rows.map(r => ({ [xKey]: r[xKey], [yKey]: Number(r[yKey]) || 0 }))
    return (
      <div className="w-full h-80">
        <ResponsiveContainer>
          {chartType === 'bar' ? (
            <BarChart data={data}>
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip /><Legend />
              <Bar dataKey={yKey} />
            </BarChart>
          ) : chartType === 'line' ? (
            <LineChart data={data}>
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip /><Legend />
              <Line dataKey={yKey} />
            </LineChart>
          ) : (
            <PieChart>
              <Pie data={data} dataKey={yKey} nameKey={xKey} outerRadius={120} label />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-3">
      <h2 className="font-semibold">Chart Builder</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <select className="border px-2 py-1 rounded" value={selected||''} onChange={e=>setSelected(Number(e.target.value))}>
          <option value="">Select Dataset</option>
          {datasets.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select className="border px-2 py-1 rounded" value={sheet} onChange={e=>setSheet(e.target.value)}>
          {tables.map(t => <option key={t.id} value={t.sheet_name}>{t.sheet_name}</option>)}
        </select>
        <select className="border px-2 py-1 rounded" value={xKey} onChange={e=>setXKey(e.target.value)}>
          <option value="">X (category)</option>
          {currentCols.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="border px-2 py-1 rounded" value={yKey} onChange={e=>setYKey(e.target.value)}>
          <option value="">Y (value)</option>
          {currentCols.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="border px-2 py-1 rounded" value={chartType} onChange={e=>setChartType(e.target.value)}>
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
        </select>
      </div>
      <input className="border px-2 py-1 rounded w-full" placeholder="Chart title" value={title} onChange={e=>setTitle(e.target.value)} />
      <label className="text-sm flex items-center gap-2">
        <input type="checkbox" checked={isPublic} onChange={e=>setIsPublic(e.target.checked)} /> Public
      </label>
      <Preview />
      <div><button className="bg-black text-white px-3 py-1 rounded" onClick={saveChart}>Save Chart</button></div>
    </div>
  )
}
