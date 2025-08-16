import React, { useEffect, useState } from 'react'
import { api, authHeaders } from '../api'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'

// Color palette for advanced colorful charts
const COLORS = [
  '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40', '#e57373', '#81c784', '#64b5f6', '#ffd54f', '#ba68c8', '#4dd0e1', '#f06292', '#aed581', '#fff176', '#9575cd', '#4fc3f7', '#ffb74d', '#a1887f', '#90a4ae'
]

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
    if (!rows.length || !xKey || !yKey) return <div className="text-sm text-gray-500">กรุณาเลือกชุดข้อมูล/ชีท และคอลัมน์เพื่อดูตัวอย่างกราฟ</div>
    const data = rows.map(r => ({ [xKey]: r[xKey], [yKey]: Number(r[yKey]) || 0 }))
    return (
      <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-pink-50 rounded-xl p-4 shadow-inner">
        <ResponsiveContainer>
          {chartType === 'bar' ? (
            <BarChart data={data}>
              <XAxis dataKey={xKey} tick={{fontWeight:'bold',fontSize:13}}/>
              <YAxis tick={{fontWeight:'bold',fontSize:13}}/>
              <Tooltip wrapperStyle={{fontSize:14}}/>
              <Legend />
              <Bar dataKey={yKey} radius={[8,8,0,0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : chartType === 'line' ? (
            <LineChart data={data}>
              <XAxis dataKey={xKey} tick={{fontWeight:'bold',fontSize:13}}/>
              <YAxis tick={{fontWeight:'bold',fontSize:13}}/>
              <Tooltip wrapperStyle={{fontSize:14}}/>
              <Legend />
              <Line dataKey={yKey} stroke="#36a2eb" strokeWidth={3} dot={{r:5,stroke:'#fff',strokeWidth:2}}/>
            </LineChart>
          ) : chartType === 'pie' ? (
            <PieChart>
              <Pie data={data} dataKey={yKey} nameKey={xKey} outerRadius={120} label>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip wrapperStyle={{fontSize:14}}/>
              <Legend />
            </PieChart>
          ) : chartType === 'area' ? (
            <AreaChart data={data}>
              <XAxis dataKey={xKey} tick={{fontWeight:'bold',fontSize:13}}/>
              <YAxis tick={{fontWeight:'bold',fontSize:13}}/>
              <Tooltip wrapperStyle={{fontSize:14}}/>
              <Legend />
              <Area dataKey={yKey} fill="#ffce56" stroke="#ff6384" strokeWidth={3} />
            </AreaChart>
          ) : chartType === 'radar' ? (
            <RadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey={xKey} tick={{fontWeight:'bold',fontSize:13}}/>
              <PolarRadiusAxis tick={{fontWeight:'bold',fontSize:13}}/>
              <Radar name="Radar" dataKey={yKey} stroke="#36a2eb" fill="#36a2eb" fillOpacity={0.5} />
              <Tooltip wrapperStyle={{fontSize:14}}/>
              <Legend />
            </RadarChart>
          ) : null}
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4 border border-blue-100">
      <h2 className="font-bold text-2xl text-blue-700 mb-2">สร้างกราฟข้อมูล (Chart Builder)</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <select className="border px-2 py-2 rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300" value={selected||''} onChange={e=>setSelected(Number(e.target.value))}>
          <option value="">เลือกชุดข้อมูล</option>
          {datasets.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select className="border px-2 py-2 rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300" value={sheet} onChange={e=>setSheet(e.target.value)}>
          {tables.map(t => <option key={t.id} value={t.sheet_name}>{t.sheet_name}</option>)}
        </select>
        <select className="border px-2 py-2 rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300" value={xKey} onChange={e=>setXKey(e.target.value)}>
          <option value="">แกน X (หมวดหมู่)</option>
          {currentCols.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="border px-2 py-2 rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300" value={yKey} onChange={e=>setYKey(e.target.value)}>
          <option value="">แกน Y (ค่า)</option>
          {currentCols.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="border px-2 py-2 rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300" value={chartType} onChange={e=>setChartType(e.target.value)}>
          <option value="bar">กราฟแท่ง (Bar)</option>
          <option value="line">กราฟเส้น (Line)</option>
          <option value="pie">กราฟวงกลม (Pie)</option>
          <option value="area">กราฟพื้นที่ (Area)</option>
          <option value="radar">กราฟเรดาร์ (Radar)</option>
        </select>
      </div>
      <input className="border px-2 py-2 rounded-lg w-full bg-yellow-50 focus:ring-2 focus:ring-yellow-300" placeholder="ชื่อกราฟ" value={title} onChange={e=>setTitle(e.target.value)} />
      <label className="text-sm flex items-center gap-2">
        <input type="checkbox" checked={isPublic} onChange={e=>setIsPublic(e.target.checked)} /> สาธารณะ (Public)
      </label>
      <Preview />
      <div><button className="bg-gradient-to-r from-blue-500 to-pink-500 text-white px-5 py-2 rounded-lg shadow hover:scale-105 transition-transform" onClick={saveChart}>บันทึกกราฟ</button></div>
    </div>
  )
}
