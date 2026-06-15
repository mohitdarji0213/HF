import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiCalendar, FiSearch } from 'react-icons/fi'
import ExportButtons from '../../components/common/ExportButtons'
import { SkeletonStatCard, SkeletonTable } from '../../components/common/Skeleton'

const DATA = [
  { id: 1, patient: 'Ramesh Kumar', dept: 'Orthopedics', doctor: 'Dr. Vikram Bose', date: '2024-11-15', time: '10:00 AM', status: 'confirmed' },
  { id: 2, patient: 'Meena Sharma', dept: 'Cardiology', doctor: 'Dr. Vikram Singh', date: '2024-11-15', time: '11:00 AM', status: 'pending' },
  { id: 3, patient: 'Arjun Singh', dept: 'Neurology', doctor: 'Dr. Meena Gupta', date: '2024-11-15', time: '12:00 PM', status: 'confirmed' },
  { id: 4, patient: 'Sita Devi', dept: 'Gynecology', doctor: 'Dr. Priya Mehta', date: '2024-11-14', time: '09:00 AM', status: 'completed' },
  { id: 5, patient: 'Govind Lal', dept: 'Pediatrics', doctor: 'Dr. Anita Joshi', date: '2024-11-14', time: '10:30 AM', status: 'completed' },
  { id: 6, patient: 'Asha Kumari', dept: 'ENT', doctor: 'Dr. Ramesh Bohra', date: '2024-11-14', time: '02:00 PM', status: 'cancelled' },
  { id: 7, patient: 'Mohan Das', dept: 'Orthopedics', doctor: 'Dr. Suresh Agarwal', date: '2024-11-13', time: '11:00 AM', status: 'completed' },
]

const STATUS = { confirmed: 'badge-blue', pending: 'badge-orange', completed: 'badge-green', cancelled: 'badge-red' }

export default function ManagerAppointments() {
  const [loading, setLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1000); return () => clearTimeout(t) }, [])
  const [search, setSearch] = useState('')
  const filtered = DATA.filter(r =>
    r.patient.toLowerCase().includes(search.toLowerCase()) ||
    r.dept.toLowerCase().includes(search.toLowerCase()) ||
    r.doctor.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-display font-bold text-gray-800">Appointments</h2>
        <ExportButtons data={filtered} filename="Appointments" title="Appointments Report" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: DATA.length, color: 'text-blue-700', border: 'border-l-blue-500' },
          { label: 'Confirmed', value: DATA.filter(d => d.status === 'confirmed').length, color: 'text-blue-600', border: 'border-l-blue-400' },
          { label: 'Completed', value: DATA.filter(d => d.status === 'completed').length, color: 'text-green-600', border: 'border-l-green-500' },
          { label: 'Cancelled', value: DATA.filter(d => d.status === 'cancelled').length, color: 'text-red-600', border: 'border-l-red-500' },
        ].map(s => (
          <div key={s.label} className={`card text-center border-l-4 ${s.border}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
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
            <tbody>{loading ? <SkeletonTable rows={5} cols={6} /> : filtered.map(r => (
                <tr key={r.id} className="table-row">
                  <td className="p-3 font-medium text-gray-800">{r.patient}</td>
                  <td className="p-3 text-center text-gray-600">{r.dept}</td>
                  <td className="p-3 text-center text-gray-600 text-xs">{r.doctor}</td>
                  <td className="p-3 text-center text-gray-600">{r.date}</td>
                  <td className="p-3 text-center text-gray-600">{r.time}</td>
                  <td className="p-3 text-center"><span className={STATUS[r.status]}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
