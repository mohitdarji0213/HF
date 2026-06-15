import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiDownload, FiFileText } from 'react-icons/fi'

const REPORTS = [
  { id: 1, patient: 'Suresh Yadav', age: 52, doctor: 'Dr. Vikram Bose', type: 'X-Ray', date: '2024-11-15', status: 'downloaded' },
  { id: 2, patient: 'Kamla Devi', age: 38, doctor: 'Dr. Anita Joshi', type: 'MRI Scan', date: '2024-11-14', status: 'pending' },
  { id: 3, patient: 'Ramesh Lal', age: 60, doctor: 'Dr. Suresh Nair', type: 'Blood Test', date: '2024-11-13', status: 'downloaded' },
  { id: 4, patient: 'Geeta Sharma', age: 45, doctor: 'Dr. Vikram Bose', type: 'CT Scan', date: '2024-11-13', status: 'downloaded' },
  { id: 5, patient: 'Mohan Das', age: 33, doctor: 'Dr. Rekha Singh', type: 'X-Ray', date: '2024-11-12', status: 'pending' },
  { id: 6, patient: 'Radha Bai', age: 55, doctor: 'Dr. Anita Joshi', type: 'Blood Test', date: '2024-11-11', status: 'downloaded' },
  { id: 7, patient: 'Amar Singh', age: 47, doctor: 'Dr. Arun Mehta', type: 'MRI Scan', date: '2024-11-10', status: 'downloaded' },
]

export default function DoctorHeadReports() {
  const [search, setSearch] = useState('')

  const filtered = REPORTS.filter(r =>
    r.patient.toLowerCase().includes(search.toLowerCase()) ||
    r.type.toLowerCase().includes(search.toLowerCase()) ||
    r.doctor.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-display font-bold text-gray-800">Patient Reports</h2>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search reports..."
            className="input-field pl-9 py-2 text-sm w-56"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center border-l-4 border-l-blue-500">
          <p className="text-2xl font-bold text-blue-700">{REPORTS.length}</p>
          <p className="text-sm text-gray-500 mt-1">Total Reports</p>
        </div>
        <div className="card text-center border-l-4 border-l-green-500">
          <p className="text-2xl font-bold text-green-600">{REPORTS.filter(r => r.status === 'downloaded').length}</p>
          <p className="text-sm text-gray-500 mt-1">Downloaded</p>
        </div>
        <div className="card text-center border-l-4 border-l-amber-500">
          <p className="text-2xl font-bold text-amber-600">{REPORTS.filter(r => r.status === 'pending').length}</p>
          <p className="text-sm text-gray-500 mt-1">Pending</p>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="text-left p-3">Patient</th>
                <th className="p-3">Doctor</th>
                <th className="p-3">Report Type</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center p-6 text-gray-400">No reports found</td></tr>
              ) : filtered.map(r => (
                <tr key={r.id} className="table-row">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        <FiFileText size={13} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{r.patient}</p>
                        <p className="text-xs text-gray-400">Age {r.age}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center text-gray-600 text-xs">{r.doctor}</td>
                  <td className="p-3 text-center">
                    <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-lg">{r.type}</span>
                  </td>
                  <td className="p-3 text-center text-gray-600">{r.date}</td>
                  <td className="p-3 text-center">
                    {r.status === 'downloaded' ? (
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
