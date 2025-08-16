import React from 'react'
import PublicDashboard from '../components/PublicDashboard'
import DatasetTable from '../components/DatasetTable'

export default function PublicView() {
  return (
    <div className="space-y-4">
      <PublicDashboard />
      <DatasetTable />
    </div>
  )
}
