import { motion } from 'framer-motion'
import { FiStar, FiUser } from 'react-icons/fi'

const TEAM = [
  { id: 1, name: 'Dr. Vikram Bose', spec: 'Sr. Orthopedic Surgeon', exp: '10 Yrs', rating: 4.5, patients: 85, reportsDownloaded: 67, available: true },
  { id: 2, name: 'Dr. Anita Joshi', spec: 'Orthopedic Surgeon', exp: '8 Yrs', rating: 4.3, patients: 72, reportsDownloaded: 54, available: true },
  { id: 3, name: 'Dr. Suresh Nair', spec: 'Trauma Specialist', exp: '12 Yrs', rating: 4.6, patients: 91, reportsDownloaded: 78, available: false },
  { id: 4, name: 'Dr. Rekha Singh', spec: 'Joint Specialist', exp: '6 Yrs', rating: 4.1, patients: 63, reportsDownloaded: 41, available: true },
  { id: 5, name: 'Dr. Arun Mehta', spec: 'Spine Surgeon', exp: '9 Yrs', rating: 4.4, patients: 77, reportsDownloaded: 60, available: true },
]

export default function DoctorHeadTeam() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-gray-800">My Team</h2>
        <span className="text-sm text-gray-500">{TEAM.length} doctors in department</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card text-center border-l-4 border-l-blue-500">
          <p className="text-2xl font-bold text-blue-700">{TEAM.length}</p>
          <p className="text-sm text-gray-500 mt-1">Total Doctors</p>
        </div>
        <div className="card text-center border-l-4 border-l-green-500">
          <p className="text-2xl font-bold text-green-600">{TEAM.filter(d => d.available).length}</p>
          <p className="text-sm text-gray-500 mt-1">Active Today</p>
        </div>
        <div className="card text-center border-l-4 border-l-amber-500">
          <p className="text-2xl font-bold text-amber-600">
            {(TEAM.reduce((s, d) => s + d.rating, 0) / TEAM.length).toFixed(1)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Avg Rating</p>
        </div>
        <div className="card text-center border-l-4 border-l-teal-500">
          <p className="text-2xl font-bold text-teal-600">{TEAM.reduce((s, d) => s + d.patients, 0)}</p>
          <p className="text-sm text-gray-500 mt-1">Total Patients</p>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title mb-4">Department Doctors</h3>
        <div className="space-y-3">
          {TEAM.map(doc => (
            <div key={doc.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-red-600 flex items-center justify-center text-white font-bold text-sm">
                  {doc.name.split(' ')[1]?.[0]}{doc.name.split(' ')[2]?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{doc.name}</p>
                  <p className="text-xs text-gray-500">{doc.spec} · {doc.exp}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div className="hidden sm:block">
                  <p className="text-xs text-gray-400">Patients</p>
                  <p className="text-sm font-bold text-gray-800">{doc.patients}</p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs text-gray-400">Reports DL</p>
                  <p className="text-sm font-bold text-gray-800">{doc.reportsDownloaded}</p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                  <FiStar className="text-amber-500 fill-amber-400" size={11} />
                  <span className="text-xs font-bold text-amber-700">{doc.rating}</span>
                </div>
                <span className={doc.available ? 'badge-green' : 'badge-red'}>
                  {doc.available ? 'Active' : 'On Leave'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
