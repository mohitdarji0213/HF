import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiFilter, FiSearch } from 'react-icons/fi'
import { exportToExcel } from '../../utils/exportExcel'
import { SkeletonStatCard, SkeletonTable } from '../../components/common/Skeleton'
import { appointmentAPI } from '../../services/api'

export default function PatientStatistics() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    appointmentAPI.getAll()
      .then(res => setData(Array.isArray(res) ? res : []))
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = data.filter(p => {
    const matchSearch =
      (p.patientName || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.patientPhone || '').includes(search)
    const matchFilter = filter === 'all' || p.status === filter
    return matchSearch && matchFilter
  })

  const handleExport = () => {
    exportToExcel(filtered.map(p => ({
      'Name': p.patientName || '—',
      'Phone': p.patientPhone || '—',
      'Department': p.department || '—',
      'Doctor': p.doctorName || '—',
      'Date': p.date ? new Date(p.date).toLocaleDateString() : '—',
      'Status': p.status,
    })), 'Patient_Statistics')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="page-title">Patient Statistics</h2>
          <p className="text-gray-500 text-sm">{loading ? '...' : `${filtered.length} records found`}</p>
        </div>
        {!loading && <button onClick={handleExport} className="btn-secondary text-sm py-2">Excel</button>}
      </div>

      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: data.length, color: 'text-blue-700', border: 'border-l-blue-500' },
            { label: 'Confirmed', value: data.filter(d => d.status === 'confirmed').length, color: 'text-blue-600', border: 'border-l-blue-400' },
            { label: 'Completed', value: data.filter(d => d.status === 'completed').length, color: 'text-green-600', border: 'border-l-green-500' },
            { label: 'Cancelled', value: data.filter(d => d.status === 'cancelled').length, color: 'text-red-600', border: 'border-l-red-500' },
          ].map(s => (
            <div key={s.label} className={`card text-center border-l-4 ${s.border}`}>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="card flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient or phone..." className="input-field pl-9 text-sm" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="select-field w-auto text-sm">
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-max">
          <thead><tr className="table-header">
            <th className="text-left p-3">Patient</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Department</th>
            <th className="p-3">Doctor</th>
            <th className="p-3">Date</th>
            <th className="p-3">Status</th>
          </tr></thead>
          <tbody>
            {loading ? <SkeletonTable rows={5} cols={6} /> : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-gray-400 py-8 text-sm">No records found</td></tr>
            ) : filtered.map((p, i) => (
              <tr key={i} className="table-row">
                <td className="p-3 font-medium text-gray-800">{p.patientName || '—'}</td>
                <td className="p-3 text-center text-gray-600 font-mono text-xs">{p.patientPhone || '—'}</td>
                <td className="p-3 text-center text-gray-600">{p.department || '—'}</td>
                <td className="p-3 text-center text-xs text-gray-600">{p.doctorName || '—'}</td>
                <td className="p-3 text-center text-gray-600">{p.date ? new Date(p.date).toLocaleDateString() : '—'}</td>
                <td className="p-3 text-center">
                  <span className={p.status === 'completed' ? 'badge-green' : p.status === 'cancelled' ? 'badge-red' : p.status === 'confirmed' ? 'badge-blue' : 'badge-orange'}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
