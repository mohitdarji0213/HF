import { motion } from 'framer-motion'
import { FiFileText } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import ExportButtons from '../../components/common/ExportButtons'
import { SkeletonStatCard, SkeletonTable } from '../../components/common/Skeleton'
import { useState, useEffect } from 'react'

const DATA = [
  { id: 1, parchi: 'P2024-1234', patient: 'Ramesh Kumar', type: 'X-Ray', dept: 'Orthopedics', uploadedBy: 'Lab Assistant', date: '2024-11-15', downloaded: true },
  { id: 2, parchi: 'P2024-1235', patient: 'Meena Sharma', type: 'Blood Test', dept: 'Cardiology', uploadedBy: 'Lab Assistant', date: '2024-11-15', downloaded: false },
  { id: 3, parchi: 'P2024-1236', patient: 'Asha Devi', type: 'MRI Scan', dept: 'Neurology', uploadedBy: 'Lab Assistant', date: '2024-11-14', downloaded: true },
  { id: 4, parchi: 'P2024-1237', patient: 'Govind Lal', type: 'CT Scan', dept: 'Orthopedics', uploadedBy: 'Lab Assistant', date: '2024-11-14', downloaded: true },
  { id: 5, parchi: 'P2024-1238', patient: 'Sita Devi', type: 'Blood Test', dept: 'Gynecology', uploadedBy: 'Lab Assistant', date: '2024-11-13', downloaded: false },
]

const chartData = [
  { day: 'Mon', uploads: 12 }, { day: 'Tue', uploads: 18 },
  { day: 'Wed', uploads: 25 }, { day: 'Thu', uploads: 15 },
  { day: 'Fri', uploads: 22 }, { day: 'Sat', uploads: 8 },
]

export default function ManagerReports() {
  const [loading, setLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1000); return () => clearTimeout(t) }, [])
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-display font-bold text-gray-800">Parchi Analytics</h2>
        <ExportButtons data={DATA} filename="Reports_Analytics" title="Parchi / Report Analytics" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Reports', value: DATA.length, color: 'text-blue-700', border: 'border-l-blue-500' },
          { label: 'Downloaded', value: DATA.filter(d => d.downloaded).length, color: 'text-green-600', border: 'border-l-green-500' },
          { label: 'Pending', value: DATA.filter(d => !d.downloaded).length, color: 'text-amber-600', border: 'border-l-amber-500' },
          { label: 'Today', value: DATA.filter(d => d.date === '2024-11-15').length, color: 'text-blue-600', border: 'border-l-blue-400' },
        ].map(s => (
          <div key={s.label} className={`card text-center border-l-4 ${s.border}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 className="section-title mb-4">Weekly Upload Trend</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="uploads" fill="#3b82f6" radius={4} name="Uploads" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <FiFileText className="text-blue-600" size={16} />
          <h3 className="section-title border-l-4 border-l-blue-500 pl-3">Report Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="table-header">
              <th className="text-left p-3">Parchi No.</th>
              <th className="p-3">Patient</th>
              <th className="p-3">Type</th>
              <th className="p-3">Department</th>
              <th className="p-3">Date</th>
              <th className="p-3">Downloaded</th>
            </tr></thead>
            <tbody>{loading ? <SkeletonTable rows={5} cols={4} /> : DATA.map(r => (
                <tr key={r.id} className="table-row">
                  <td className="p-3 font-mono text-xs text-primary-600 font-bold">{r.parchi}</td>
                  <td className="p-3 font-medium text-gray-800">{r.patient}</td>
                  <td className="p-3 text-center"><span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-lg">{r.type}</span></td>
                  <td className="p-3 text-center text-gray-600">{r.dept}</td>
                  <td className="p-3 text-center text-gray-600">{r.date}</td>
                  <td className="p-3 text-center"><span className={r.downloaded ? 'badge-green' : 'badge-orange'}>{r.downloaded ? 'Yes' : 'No'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
