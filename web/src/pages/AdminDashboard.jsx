import React, { useEffect, useState } from 'react'
import UploadExcel from '../components/UploadExcel'
import ImportGoogleSheet from '../components/ImportGoogleSheet'
import ChartBuilder from '../components/ChartBuilder'
import { api, authHeaders } from '../api'

export default function AdminDashboard({ token }) {
  const [datasets, setDatasets] = useState([])
  const refresh = () => api.get('/datasets', { params: { admin: 1 } }).then(r=>setDatasets(r.data))
  useEffect(()=>{ refresh() }, [])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UploadExcel token={token} onUploaded={refresh} />
        <ImportGoogleSheet token={token} onImported={refresh} />
      </div>
      <ChartBuilder token={token} />
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Datasets (admin)</h2>
        <ul className="list-disc pl-5">
          {datasets.map(d => <li key={d.id}>{d.name} — {d.source_type}</li>)}
        </ul>
      </div>
    </div>
  )
}
