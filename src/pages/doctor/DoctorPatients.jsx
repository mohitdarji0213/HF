import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiUser, FiDownload } from 'react-icons/fi'

const PATIENTS = [
  { id: 1, name: 'Ramesh Kumar', age: 45, issue: 'Knee Pain', lastVisit: '2024-11-15', visits: 5, reportDownloaded: true },
  { id: 2, name: 'Meena Sharma', age: 32, issue: 'Back Injury', lastVisit: '2024-11-14', visits: 2, reportDownloaded: false },
  { id: 3, name: 'Govind Lal', age: 58, issue: 'Joint Pain', lastVisit: '2024-11-13', visits: 8, reportDownloaded: true },
  { id: 4, name: 'Asha Devi', age: 29, issue: 'Fracture Follow-up', lastVisit: '2024-11-12', visits: 3, reportDownloaded: true },
  { id: 5, name: 'Suresh Patel', age: 40, issue: 'Shoulder Pain', lastVisit: '2024-11-10', visits: 1, reportDownloaded: false },
  { id: 6, name: 'Kavita Singh', age: 35, issue: 'Wrist Fracture', lastVisit: '2024-11-08', visits: 4, reportDownloaded: true },
]

export default function DoctorPatients() {
  const [search, setSearch] = useState('')

  const filtered = PATIENTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.issue.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-display font-bold text-gray-800">My Patients</h2>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search patients..."
            className="input-field pl-9 py-2 text-sm w-56"
          />
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="text-left p-3">Patient</th>
                <th className="p-3">Age</th>
                <th className="p-3">Issue</th>
                <th className="p-3">Last Visit</th>
                <th className="p-3">Total Visits</th>
                <th className="p-3">Report</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center p-6 text-gray-400">No patients found</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="table-row">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        <FiUser size={13} />
                      </div>
                      <span className="font-medium text-gray-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-center text-gray-600">{p.age}</td>
                  <td className="p-3 text-center text-gray-600">{p.issue}</td>
                  <td className="p-3 text-center text-gray-600">{p.lastVisit}</td>
                  <td className="p-3 text-center text-gray-600">{p.visits}</td>
                  <td className="p-3 text-center">
                    {p.reportDownloaded ? (
                      <span className="badge-green">Downloaded</span>
                    ) : (
                      <button className="flex items-center gap-1 text-blue-700 hover:text-blue-800 text-xs mx-auto">
                        <FiDownload size={12} /> Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
