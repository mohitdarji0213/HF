import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSearch } from 'react-icons/fi'
import ExportButtons from '../../components/common/ExportButtons'
import { SkeletonStatCard, SkeletonTable } from '../../components/common/Skeleton'
import { appointmentAPI } from '../../services/api'

const STATUS = { confirmed: 'badge-blue', pending: 'badge-orange', completed: 'badge-green', cancelled: 'badge-red' }

export default function ManagerAppointments() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    appointmentAPI.getAll()
      .then(res => setData(Array.isArray(res) ? res : []))
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = data.filter(r =>
    (r.patientName || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.department || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.doctorName || '').toLowerCase().includes(search.toLowerCase())
  )

  const counts = {
    total: data.length,
    confirmed: data.filter(d => d.status === 'confirmed').length,
    completed: data.filter(d => d.status === 'completed').length,
    cancelled: data.filter(d => d.status === 'cancelled').length,
  }

  const stats = [
    { label: 'Total', value: counts.total, color: 'text-blue-700', border: 'border-l-blue-500' },
    { label: 'Confirmed', value: counts.confirmed, color: 'text-blue-600', border: 'border-l-blue-400' },
    { label: 'Completed', value: counts.completed, color: 'text-green-600', border: 'border-l-green-500' },
    { label: 'Cancelled', value: counts.cancelled, color: 'text-red-600', border: 'border-l-red-500' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-display font-bold text-gray-800">Appointments</h2>
        <ExportButtons data={filtered} filename="Appointments" title="Appointments Report" />
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

      <div className="card">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="section-title">All Appointments</h3>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="input-field pl-9 py-2 text-sm w-52" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="table-header">
              <th className="text-left p-3">Patient</th>
              <th className="p-3">Department</th>
              <th className="p-3">Doctor</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time</th>
              <th className="p-3">Status</th>
            </tr></thead>
            <tbody>
              {loading ? <SkeletonTable rows={5} cols={6} /> : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-gray-400 py-8 text-sm">No appointments yet</td></tr>
              ) : filtered.map(r => (
                <tr key={r._id} className="table-row">
                  <td className="p-3 font-medium text-gray-800">{r.patientName || '—'}</td>
                  <td className="p-3 text-center text-gray-600">{r.department || '—'}</td>
                  <td className="p-3 text-center text-gray-600 text-xs">{r.doctorName || '—'}</td>
                  <td className="p-3 text-center text-gray-600">{r.date ? new Date(r.date).toLocaleDateString() : '—'}</td>
                  <td className="p-3 text-center text-gray-600">{r.time || '—'}</td>
                  <td className="p-3 text-center"><span className={STATUS[r.status] || 'badge-blue'}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
