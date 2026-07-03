import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi'
import { SkeletonStatCard } from '../../components/common/Skeleton'
import { appointmentAPI } from '../../services/api'

const STATUS_BADGE = {
  confirmed: 'badge-blue',
  pending: 'badge-orange',
  completed: 'badge-green',
  cancelled: 'badge-red',
}

export default function DoctorHeadAppointments() {
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    appointmentAPI.getAll()
      .then(res => setAppointments(Array.isArray(res) ? res : []))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false))
  }, [])

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const counts = {
    upcoming: appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-display font-bold text-gray-800">My Appointments</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-xl border border-gray-200">
          <FiCalendar size={14} />
          <span>{today}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {loading ? [...Array(3)].map((_, i) => <SkeletonStatCard key={i} />) : (<>
          <div className="card text-center border-l-4 border-l-blue-500">
            <p className="text-2xl font-bold text-blue-700">{counts.upcoming}</p>
            <p className="text-sm text-gray-500 mt-1">Upcoming</p>
          </div>
          <div className="card text-center border-l-4 border-l-green-500">
            <p className="text-2xl font-bold text-green-600">{counts.completed}</p>
            <p className="text-sm text-gray-500 mt-1">Completed</p>
          </div>
          <div className="card text-center border-l-4 border-l-red-500">
            <p className="text-2xl font-bold text-red-600">{counts.cancelled}</p>
            <p className="text-sm text-gray-500 mt-1">Cancelled</p>
          </div>
        </>)}
      </div>

      <div className="card">
        <h3 className="section-title mb-4">All Appointments</h3>
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-xl" />)}
          </div>
        ) : appointments.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">No appointments yet</p>
        ) : (
          <div className="space-y-3">
            {appointments.map(appt => (
              <div key={appt._id} className={`flex items-center justify-between gap-3 p-3 rounded-xl transition-colors ${appt.status === 'cancelled' ? 'bg-red-50 border border-red-100' : 'bg-gray-50 hover:bg-blue-50'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <FiUser size={15} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{appt.patientName || '—'}</p>
                    <p className="text-xs text-gray-500">{appt.department || '—'}{appt.patientPhone ? ` · ${appt.patientPhone}` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-right">
                  {appt.date && (
                    <div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 justify-end">
                        <FiClock size={11} />
                        <span>{appt.time || new Date(appt.date).toLocaleDateString()}</span>
                      </div>
                      {appt.time && <p className="text-xs text-gray-400">{new Date(appt.date).toLocaleDateString()}</p>}
                    </div>
                  )}
                  <span className={`${STATUS_BADGE[appt.status] || 'badge-blue'} text-xs capitalize`}>{appt.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
