import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FiFileText } from 'react-icons/fi'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import ExportButtons from '../../components/common/ExportButtons'
import { SkeletonStatCard, SkeletonTable } from '../../components/common/Skeleton'
import { reportAPI } from '../../services/api'

const PIE_COLORS = ['#0d96eb', '#22c55e', '#f59e0b', '#8b5cf6', '#6b7280']

export default function AdminReports() {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState(null)
  const [reports, setReports] = useState([])

  useEffect(() => {
    Promise.all([reportAPI.getAnalytics(), reportAPI.getAll()])
      .then(([analyticsRes, reportsRes]) => {
        setAnalytics(analyticsRes)
        setReports(Array.isArray(reportsRes) ? reportsRes : [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const tableData = reports.flatMap(r =>
    r.files?.map(f => ({
      parchi: r.parchiNo,
      patient: r.patientName || '—',
      type: f.fileType || f.type || '—',
      dept: r.department || '—',
      date: f.uploadedAt ? new Date(f.uploadedAt).toLocaleDateString() : new Date(r.createdAt).toLocaleDateString(),
    })) || []
  )

  const today = new Date().toLocaleDateString()

  const typeGroups = tableData.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1
    return acc
  }, {})
  const pieData = Object.entries(typeGroups).map(([name, value], i) => ({ name, value, color: PIE_COLORS[i % PIE_COLORS.length] }))

  const stats = [
    { label: 'Total', value: analytics?.totalFiles ?? tableData.length, color: 'text-blue-700', border: 'border-l-blue-500' },
    { label: 'Downloads', value: analytics?.totalDownloads ?? '—', color: 'text-green-600', border: 'border-l-green-500' },
    { label: 'Total Parchi', value: analytics?.totalParchi ?? reports.length, color: 'text-amber-600', border: 'border-l-amber-500' },
    { label: 'Today', value: tableData.filter(d => d.date === today).length, color: 'text-blue-600', border: 'border-l-blue-400' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-display font-bold text-gray-800">Report Analytics</h2>
        <ExportButtons data={tableData} filename="Report_Analytics" title="Report Analytics" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {loading
          ? [...Array(4)].map((_, i) => <SkeletonStatCard key={i} />)
          : stats.map(s => (
            <div key={s.label} className={`card text-center border-l-4 ${s.border}`}>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))
        }
      </div>

      {!loading && pieData.length > 0 && (
        <div className="card">
          <h3 className="section-title mb-4">Report Types Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <FiFileText className="text-blue-600" size={16} />
          <h3 className="section-title border-l-4 border-l-blue-500 pl-3">Report Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="table-header">
              <th className="text-left p-3">Parchi</th>
              <th className="p-3">Patient</th>
              <th className="p-3">Type</th>
              <th className="p-3">Department</th>
              <th className="p-3">Date</th>
            </tr></thead>
            <tbody>
              {loading ? <SkeletonTable rows={5} cols={5} /> : tableData.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-gray-400 py-8 text-sm">No reports yet</td></tr>
              ) : tableData.map((r, i) => (
                <tr key={i} className="table-row">
                  <td className="p-3 font-mono text-xs text-primary-600 font-bold">{r.parchi}</td>
                  <td className="p-3 font-medium text-gray-800">{r.patient}</td>
                  <td className="p-3 text-center"><span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-lg">{r.type}</span></td>
                  <td className="p-3 text-center text-gray-600">{r.dept}</td>
                  <td className="p-3 text-center text-gray-600">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
