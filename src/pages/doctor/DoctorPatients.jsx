import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiUser } from 'react-icons/fi'
import { SkeletonTable } from '../../components/common/Skeleton'
import { appointmentAPI } from '../../services/api'

export default function DoctorPatients() {
  const [loading, setLoading] = useState(true)
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    appointmentAPI.getAll()
      .then(res => {
        const appts = Array.isArray(res) ? res : []
        // Deduplicate by patientName, keep latest appointment per patient
        const map = new Map()
        appts.forEach(a => {
          const key = a.patientName || a.patientPhone || a._id
          if (!map.has(key) || new Date(a.date) > new Date(map.get(key).date)) {
            map.set(key, a)
          }
        })
        setPatients(Array.from(map.values()))
      })
      .catch(() => setPatients([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = patients.filter(p =>
    (p.patientName || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.department || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-display font-bold text-gray-800">
          My Patients
          {!loading && <span className="text-sm text-gray-400 font-normal ml-2">({patients.length} total)</span>}
        </h2>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients..." className="input-field pl-9 py-2 text-sm w-56" />
        </div>
      </div>

      <div className="card overflow-x-auto">
        {loading ? <SkeletonTable rows={5} cols={5} /> : filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">No patients found</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="text-left p-3">Patient</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Department</th>
                <th className="p-3">Last Visit</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p._id} className="table-row">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        <FiUser size={13} />
                      </div>
                      <span className="font-medium text-gray-800">{p.patientName || '—'}</span>
                    </div>
                  </td>
                  <td className="p-3 text-center text-gray-600 font-mono text-xs">{p.patientPhone || '—'}</td>
                  <td className="p-3 text-center text-gray-600">{p.department || '—'}</td>
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
        )}
      </div>
    </motion.div>
  )
}
