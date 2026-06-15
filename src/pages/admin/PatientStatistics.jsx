import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiFilter, FiSearch } from 'react-icons/fi'
import { exportToExcel } from '../../utils/exportExcel'
import { exportPDF } from '../../utils/exportPDF'

const MOCK_PATIENTS = [
  { id: 'P001', name: 'Ramesh Kumar', phone: '9876543210', age: 45, gender: 'Male', date: '2024-11-15', action: 'Appointment', dept: 'Orthopedics', doctor: 'Dr. Rajesh Sharma', amount: 300, parchi: 'P2024-001234', reportDL: true },
  { id: 'P002', name: 'Sita Devi', phone: '9876543211', age: 32, gender: 'Female', date: '2024-11-15', action: 'Ambulance', dept: '—', doctor: '—', amount: 0, parchi: '—', reportDL: false },
  { id: 'P003', name: 'Arjun Singh', phone: '9876543212', age: 58, gender: 'Male', date: '2024-11-14', action: 'Appointment', dept: 'Cardiology', doctor: 'Dr. Priya Verma', amount: 400, parchi: 'P2024-001235', reportDL: true },
  { id: 'P004', name: 'Meena Gupta', phone: '9876543213', age: 29, gender: 'Female', date: '2024-11-14', action: 'Appointment', dept: 'Gynecology', doctor: 'Dr. Kavita Rao', amount: 350, parchi: 'P2024-001236', reportDL: false },
  { id: 'P005', name: 'Suresh Nair', phone: '9876543214', age: 62, gender: 'Male', date: '2024-11-13', action: 'Appointment', dept: 'Neurology', doctor: 'Dr. Amit Kumar', amount: 350, parchi: 'P2024-001237', reportDL: true },
]

export default function PatientStatistics() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const filtered = MOCK_PATIENTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.parchi.includes(search)
    const matchFilter = filter === 'all' || p.action.toLowerCase() === filter
    return matchSearch && matchFilter
  })

  const handleExport = () => {
    exportToExcel(filtered.map(p => ({
      'Patient ID': p.id, 'Name': p.name, 'Phone': p.phone, 'Age': p.age,
      'Gender': p.gender, 'Date': p.date, 'Action': p.action,
      'Department': p.dept, 'Doctor': p.doctor, 'Amount': p.amount,
      'Parchi No': p.parchi, 'Report Downloaded': p.reportDL ? 'Yes' : 'No',
    })), 'Patient_Statistics')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="page-title">Patient Statistics</h2>
          <p className="text-gray-500 text-sm">{filtered.length} records found</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn-secondary text-sm py-2">Excel</button>
          <button onClick={() => exportPDF(filtered, 'Patient_Statistics', 'Patient Statistics Report')}
            className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl border-2 border-red-500 text-red-600 hover:bg-red-50 transition-colors">PDF</button>
        </div>
      </div>

      {/* Filters */}
      <div className="card flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient or parchi no..." className="input-field pl-9 text-sm" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="select-field w-auto text-sm">
          <option value="all">All Actions</option>
          <option value="appointment">Appointments</option>
          <option value="ambulance">Ambulance</option>
        </select>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="input-field w-auto text-sm" />
        <span className="text-gray-400 text-sm">to</span>
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="input-field w-auto text-sm" />
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-max">
          <thead><tr className="table-header">
            <th className="text-left p-3">Patient</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Age/Gender</th>
            <th className="p-3">Date</th>
            <th className="p-3">Action</th>
            <th className="p-3">Department</th>
            <th className="p-3">Doctor</th>
            <th className="p-3">Parchi</th>
            <th className="p-3">Report DL</th>
          </tr></thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={i} className="table-row">
                <td className="p-3 font-medium text-gray-800">{p.name}</td>
                <td className="p-3 text-center text-gray-600 font-mono text-xs">{p.phone}</td>
                <td className="p-3 text-center text-gray-600">{p.age}/{p.gender[0]}</td>
                <td className="p-3 text-center text-gray-600 text-xs">{p.date}</td>
                <td className="p-3 text-center">
                  <span className={p.action === 'Ambulance' ? 'badge-orange' : 'badge-blue'}>{p.action}</span>
                </td>
                <td className="p-3 text-center text-gray-600">{p.dept}</td>
                <td className="p-3 text-center text-xs text-gray-600">{p.doctor}</td>
                <td className="p-3 text-center font-mono text-xs text-blue-700">{p.parchi}</td>
                <td className="p-3 text-center">
                  <span className={p.reportDL ? 'badge-green' : 'badge-red'}>{p.reportDL ? '✓ Yes' : 'No'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
