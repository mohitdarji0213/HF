import { useState } from 'react'
import { motion } from 'framer-motion'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import ExportButtons from '../../components/common/ExportButtons'

const HISTORY = [
  { parchi: 'P2024-001234', patient: 'Ramesh Kumar', type: 'X-Ray', date: '2024-11-15 10:30', size: '2.4 MB', status: 'uploaded' },
  { parchi: 'P2024-001235', patient: 'Meena Sharma', type: 'Blood Test', date: '2024-11-15 11:15', size: '1.1 MB', status: 'uploaded' },
  { parchi: 'P2024-001236', patient: 'Asha Devi', type: 'MRI Scan', date: '2024-11-14 03:00', size: '8.6 MB', status: 'uploaded' },
  { parchi: 'P2024-001237', patient: 'Govind Lal', type: 'CT Scan', date: '2024-11-13 09:45', size: '12.1 MB', status: 'uploaded' },
  { parchi: 'P2024-001238', patient: 'Sita Devi', type: 'Blood Test', date: '2024-11-13 01:30', size: '0.9 MB', status: 'uploaded' },
]

const weekData = [
  { day: 'Mon', uploads: 12 }, { day: 'Tue', uploads: 18 },
  { day: 'Wed', uploads: 25 }, { day: 'Thu', uploads: 15 },
  { day: 'Fri', uploads: 22 }, { day: 'Sat', uploads: 8 },
]

export default function LabAnalytics() {
  const [filterDays, setFilterDays] = useState('7')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-xl font-display font-bold text-gray-800 border-l-4 border-l-blue-500 pl-3">Report Analytics</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Uploads', value: 342, color: 'text-blue-700', border: 'border-l-blue-500' },
          { label: 'Today', value: 23, color: 'text-blue-600', border: 'border-l-blue-400' },
          { label: 'Pending', value: 4, color: 'text-amber-600', border: 'border-l-amber-500' },
          { label: 'Downloaded', value: '2,180', color: 'text-green-600', border: 'border-l-green-500' },
        ].map(s => (
          <div key={s.label} className={`card text-center border-l-4 ${s.border}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">Upload Activity</h3>
          <select value={filterDays} onChange={e => setFilterDays(e.target.value)} className="select-field w-auto text-xs py-1.5">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weekData} barSize={22}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="uploads" fill="#3b82f6" radius={4} name="Uploads" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">Upload History</h3>
          <ExportButtons data={HISTORY} filename="Lab_Upload_History" title="Lab Upload History" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="table-header">
              <th className="text-left p-3">Parchi No.</th>
              <th className="p-3">Patient</th>
              <th className="p-3">Type</th>
              <th className="p-3">Size</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr></thead>
            <tbody>
              {HISTORY.map(r => (
                <tr key={r.parchi} className="table-row">
                  <td className="p-3 font-mono text-xs text-primary-600 font-bold">{r.parchi}</td>
                  <td className="p-3 font-medium text-gray-800">{r.patient}</td>
                  <td className="p-3 text-center"><span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-lg">{r.type}</span></td>
                  <td className="p-3 text-center text-gray-600">{r.size}</td>
                  <td className="p-3 text-center text-gray-600 text-xs">{r.date}</td>
                  <td className="p-3 text-center"><span className="badge-green">{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
