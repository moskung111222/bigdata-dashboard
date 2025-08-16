import React, { useEffect, useState } from 'react'
import { api, API_BASE } from '../api'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function Card({ title, children, excelPath }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{title}</h3>
        {excelPath && (
          <a href={excelPath} className="text-blue-600 text-sm" download>Download Excel</a>
        )}
      </div>
      {children}
    </div>
  )
}

export default function PublicDashboard() {
  const [charts, setCharts] = useState([])
  const [cache, setCache] = useState({})

  useEffect(()=>{
    api.get('/charts/public').then(async r => {
      const rows = r.data
      setCharts(rows)
      // Preload data
      rows.forEach(async (c) => {
        const resp = await api.get(`/datasets/${c.dataset_id}/data`, { params: { sheet: c.sheet_name, limit: 500 } })
        setCache(prev => ({ ...prev, [c.id]: resp.data.rows }))
      })
    })
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {charts.map(c => {
        const cfg = JSON.parse(c.config_json)
        const xKey = cfg.xKey, yKey = cfg.yKey
        const rows = (cache[c.id] || []).map(r => ({ [xKey]: r[xKey], [yKey]: Number(r[yKey]) || 0 }))
        const excelUrl = c.file_path ? `${API_BASE}${c.file_path.replace(/^\./,'')}` : null

        return (
          <Card key={c.id} title={c.title} excelPath={excelUrl?.includes('/uploads/') ? excelUrl : null}>
            <div className="w-full h-80">
              <ResponsiveContainer>
                {c.chart_type === 'bar' ? (
                  <BarChart data={rows}>
                    <XAxis dataKey={xKey} />
                    <YAxis />
                    <Tooltip /><Legend />
                    <Bar dataKey={yKey} />
                  </BarChart>
                ) : c.chart_type === 'line' ? (
                  <LineChart data={rows}>
                    <XAxis dataKey={xKey} />
                    <YAxis />
                    <Tooltip /><Legend />
                    <Line dataKey={yKey} />
                  </LineChart>
                ) : (
                  <PieChart>
                    <Pie data={rows} dataKey={yKey} nameKey={xKey} outerRadius={120} label />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
