import { motion } from 'framer-motion'
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi'

const APPOINTMENTS = [
  { id: 1, patient: 'Suresh Yadav', age: 52, time: '09:00 AM', type: 'New', status: 'completed', issue: 'Joint Replacement Consultation' },
  { id: 2, patient: 'Kamla Devi', age: 38, time: '10:00 AM', type: 'Follow-up', status: 'upcoming', issue: 'Post-op Follow-up' },
  { id: 3, patient: 'Ramesh Lal', age: 60, time: '11:30 AM', type: 'New', status: 'upcoming', issue: 'Knee Pain' },
  { id: 4, patient: 'Geeta Sharma', age: 45, time: '12:00 PM', type: 'Follow-up', status: 'cancelled', issue: 'Spine Surgery Follow-up' },
  { id: 5, patient: 'Mohan Das', age: 33, time: '02:00 PM', type: 'New', status: 'upcoming', issue: 'Sports Injury' },
  { id: 6, patient: 'Radha Bai', age: 55, time: '03:30 PM', type: 'Follow-up', status: 'upcoming', issue: 'Arthritis Management' },
]

const STATUS_BADGE = {
  completed: 'badge-green',
  upcoming: 'badge-blue',
  cancelled: 'badge-red',
}

export default function DoctorHeadAppointments() {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

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
        <div className="card text-center border-l-4 border-l-blue-500">
          <p className="text-2xl font-bold text-blue-700">{APPOINTMENTS.filter(a => a.status === 'upcoming').length}</p>
          <p className="text-sm text-gray-500 mt-1">Upcoming</p>
        </div>
        <div className="card text-center border-l-4 border-l-green-500">
          <p className="text-2xl font-bold text-green-600">{APPOINTMENTS.filter(a => a.status === 'completed').length}</p>
          <p className="text-sm text-gray-500 mt-1">Completed</p>
        </div>
        <div className="card text-center border-l-4 border-l-red-500">
          <p className="text-2xl font-bold text-red-600">{APPOINTMENTS.filter(a => a.status === 'cancelled').length}</p>
          <p className="text-sm text-gray-500 mt-1">Cancelled</p>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title mb-4">Today's Schedule</h3>
        <div className="space-y-3">
          {APPOINTMENTS.map(appt => (
            <div key={appt.id} className={`flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors ${appt.status === 'cancelled' ? 'bg-red-50 border border-red-100' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <FiUser size={15} />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{appt.patient}</p>
                  <p className="text-xs text-gray-500">{appt.issue} · Age {appt.age}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-right">
                <div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 justify-end">
                    <FiClock size={11} />
                    <span>{appt.time}</span>
                  </div>
                  <p className="text-xs text-gray-400">{appt.type}</p>
                </div>
                <span className={STATUS_BADGE[appt.status] + ' text-xs capitalize'}>{appt.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
