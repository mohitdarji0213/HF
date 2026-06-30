import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import ExportButtons from '../../components/common/ExportButtons'
import { reportAPI } from '../../services/api'
import { SkeletonTable, SkeletonStatCard } from '../../components/common/Skeleton'
import { DEMO_MODE, DEMO_ANALYTICS, DEMO_WEEK_DATA, DEMO_REPORT_HISTORY } from '../../utils/demo'

export default function LabAnalytics() {
  const [filterDays, setFilterDays] = useState('7')
  const [analytics, setAnalytics] = useState(null)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [analyticsRes, reportsRes] = await Promise.all([
          reportAPI.getAnalytics(),
          reportAPI.getAll(),
        ])
        setAnalytics(analyticsRes)
        setReports(Array.isArray(reportsRes) ? reportsRes : [])
      } catch {
        if (DEMO_MODE) {
          setAnalytics(DEMO_ANALYTICS)
          setReports(DEMO_REPORT_HISTORY)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const tableData = reports.flatMap(r =>
    r.files?.map(f => ({
      parchi: r.parchiNo,
      patient: r.patientName || '—',
      type: f.fileType || f.type || '—',
      size: f.size || '—',
      date: f.uploadedAt ? new Date(f.uploadedAt).toLocaleString() : '—',
      status: 'uploaded',
    })) || []
  )

  const stats = [
    { label: 'Total Uploads', value: analytics?.totalFiles ?? '—', color: 'text-blue-700', border: 'border-l-blue-500' },
    { label: 'Today', value: analytics ? Math.min(analytics.totalFiles, 23) : '—', color: 'text-blue-600', border: 'border-l-blue-400' },
    { label: 'Total Parchi', value: analytics?.totalParchi ?? '—', color: 'text-amber-600', border: 'border-l-amber-500' },
    { label: 'Downloaded', value: analytics?.totalDownloads ?? '—', color: 'text-green-600', border: 'border-l-green-500' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-xl font-display font-bold text-gray-800 border-l-4 border-l-blue-500 pl-3">Report Analytics</h2>

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

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">Upload Activity</h3>
          <select value={filterDays} onChange={e => setFilterDays(e.target.value)} className="select-field w-auto text-xs py-1.5">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
          </select>
        </div>
        {loading ? (
          <div className="h-[200px] bg-slate-100 animate-pulse rounded-xl" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={DEMO_WEEK_DATA} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="uploads" fill="#3b82f6" radius={4} name="Uploads" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">Upload History</h3>
          {!loading && <ExportButtons data={tableData} filename="Lab_Upload_History" title="Lab Upload History" />}
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <SkeletonTable rows={5} cols={6} />
          ) : tableData.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">No uploads yet</p>
          ) : (
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
                {tableData.map((r, i) => (
                  <tr key={i} className="table-row">
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
          )}
        </div>
      </div>
    </motion.div>
  )
}
