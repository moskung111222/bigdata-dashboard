import React, { useEffect, useState } from 'react'
import { api, authHeaders } from '../api'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'

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
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffc0cb']

    return (
      <div className="w-full h-80">
        <ResponsiveContainer>
          {chartType === 'bar' ? (
            <BarChart data={data}>
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip /><Legend />
              <Bar dataKey={yKey}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : chartType === 'line' ? (
            <LineChart data={data}>
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip /><Legend />
              <Line dataKey={yKey} stroke="#8884d8" />
            </LineChart>
          ) : chartType === 'pie' ? (
            <PieChart>
              <Pie data={data} dataKey={yKey} nameKey={xKey} outerRadius={120} label>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          ) : chartType === 'area' ? (
            <AreaChart data={data}>
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip /><Legend />
              <Area dataKey={yKey} fill="#82ca9d" stroke="#82ca9d" />
            </AreaChart>
          ) : chartType === 'radar' ? (
            <RadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey={xKey} />
              <PolarRadiusAxis />
              <Radar name="Radar" dataKey={yKey} stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
          ) : null}
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
          <option value="area">Area</option>
          <option value="radar">Radar</option>
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
