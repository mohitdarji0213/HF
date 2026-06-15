import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  FiHome, FiCalendar, FiFileText, FiAlertTriangle, FiDownload, FiUsers, FiActivity
} from 'react-icons/fi'
import { MdEmergency, MdEvent } from 'react-icons/md'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import StatCard from '../../components/common/StatCard'
import { exportToExcel } from '../../utils/exportExcel'
import ExportButtons from '../../components/common/ExportButtons'

const SIDEBAR_LINKS = [
  { section: 'Overview' },
  { to: '/manager', icon: <FiHome />, label: 'Dashboard' },
  { section: 'Data & Analytics' },
  { to: '/manager/appointments', icon: <FiCalendar />, label: 'Appointments' },
  { to: '/manager/ambulance', icon: <MdEmergency />, label: 'Ambulance Stats' },
  { to: '/manager/reports', icon: <FiFileText />, label: 'Parchi Analytics' },
  { to: '/manager/patients', icon: <FiActivity />, label: 'Patient Stats' },
  { section: 'Management' },
  { to: '/manager/issues', icon: <FiAlertTriangle />, label: 'Issues', badge: '3' },
  { to: '/manager/events', icon: <MdEvent />, label: 'Upload Events' },
  { to: '/manager/doctors', icon: <FiUsers />, label: 'Doctor Overview' },
]

const MOCK_ISSUES = [
  { id: 1, from: 'Patient', dept: 'Orthopedics', type: 'Waiting Time', urgency: 'high', status: 'open', date: '2024-11-14' },
  { id: 2, from: 'Patient', dept: 'Cardiology', type: 'Staff Behavior', urgency: 'medium', status: 'in-progress', date: '2024-11-13' },
  { id: 3, from: 'Doctor Head', dept: 'Pediatrics', type: 'Facility Issue', urgency: 'medium', status: 'open', date: '2024-11-12' },
]

const weekData = [
  { day: 'Mon', appointments: 42, reports: 18 },
  { day: 'Tue', appointments: 38, reports: 22 },
  { day: 'Wed', appointments: 55, reports: 31 },
  { day: 'Thu', appointments: 47, reports: 25 },
  { day: 'Fri', appointments: 60, reports: 35 },
  { day: 'Sat', appointments: 35, reports: 14 },
]

export default function ManagerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const isBase = location.pathname === '/manager' || location.pathname === '/manager/'

  const urgencyColor = { high: 'badge-red', medium: 'badge-orange', low: 'badge-green' }
  const statusColor = { open: 'badge-red', 'in-progress': 'badge-orange', resolved: 'badge-green' }

  const handleExport = () => {
    exportToExcel([
      ...MOCK_ISSUES.map(i => ({ Date: i.date, From: i.from, Department: i.dept, Type: i.type, Urgency: i.urgency, Status: i.status }))
    ], 'Manager_Issues')
  }

  return (
    <div className="min-h-screen bg-hospital-bg">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex max-w-screen-2xl mx-auto">
        <Sidebar links={SIDEBAR_LINKS} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} title="Hospital Manager" />
        <main className="flex-1 min-w-0 p-5">
          {isBase ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="bg-gradient-to-r from-slate-800 to-blue-900 rounded-2xl p-6 mb-2 text-white flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-2xl font-display font-bold text-white">Manager Dashboard</h1>
                  <p className="text-blue-200 text-sm mt-1">Hospital Operations Overview</p>
                </div>
                <ExportButtons
                  data={MOCK_ISSUES.map(i => ({ Date: i.date, From: i.from, Department: i.dept, Type: i.type, Urgency: i.urgency, Status: i.status }))}
                  filename="Manager_Issues"
                  title="Manager Dashboard Report"
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<FiCalendar />} label="Today's Appointments" value="47" color="blue" trend={5} />
                <StatCard icon={<MdEmergency />} label="Ambulance Today" value="8" color="orange" />
                <StatCard icon={<FiFileText />} label="Reports Uploaded" value="23" color="teal" />
                <StatCard icon={<FiAlertTriangle />} label="Pending Issues" value="3" color="red" />
              </div>

              {/* Chart + Issues */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="card lg:col-span-2">
                  <h3 className="section-title mb-4">This Week's Activity</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={weekData} barSize={18}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="appointments" fill="#3b82f6" radius={4} name="Appointments" />
                      <Bar dataKey="reports" fill="#e11d48" radius={4} name="Reports" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Issues */}
                <div className="card">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="section-title">Recent Issues</h3>
                    <Link to="/manager/issues" className="text-xs text-primary-600 hover:underline">View All</Link>
                  </div>
                  <div className="space-y-3">
                    {MOCK_ISSUES.map(issue => (
                      <div key={issue.id} className={`p-3 bg-gray-50 rounded-xl border ${issue.urgency === 'high' ? 'border-l-4 border-l-red-500 border-gray-100' : 'border-gray-100'}`}>
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-xs font-semibold text-gray-800">{issue.type}</p>
                          <span className={`text-[10px] ${urgencyColor[issue.urgency]} px-1.5 py-0.5 rounded-full font-medium`}>{issue.urgency}</span>
                        </div>
                        <p className="text-xs text-gray-500">{issue.dept} · {issue.from}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[10px] text-gray-400">{issue.date}</span>
                          <span className={`text-[10px] ${statusColor[issue.status]} px-1.5 py-0.5 rounded-full font-medium`}>{issue.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity Table */}
              <div className="card">
                <h3 className="section-title mb-4">Recent Bookings Summary</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="table-header"><th className="text-left p-3">Patient</th><th className="p-3">Type</th><th className="p-3">Department</th><th className="p-3">Date</th><th className="p-3">Status</th></tr></thead>
                    <tbody>
                      {[
                        { name: 'Ramesh Kumar', type: 'Appointment', dept: 'Orthopedics', date: '2024-11-15', status: 'confirmed' },
                        { name: 'Sita Devi', type: 'Ambulance', dept: '—', date: '2024-11-15', status: 'completed' },
                        { name: 'Arjun Singh', type: 'Appointment', dept: 'Cardiology', date: '2024-11-14', status: 'pending' },
                        { name: 'Meena Gupta', type: 'Appointment', dept: 'Gynecology', date: '2024-11-14', status: 'confirmed' },
                      ].map((r, i) => (
                        <tr key={i} className="table-row">
                          <td className="p-3 font-medium text-gray-800">{r.name}</td>
                          <td className="p-3 text-center"><span className={r.type === 'Ambulance' ? 'badge-orange' : 'badge-blue'}>{r.type}</span></td>
                          <td className="p-3 text-center text-gray-600">{r.dept}</td>
                          <td className="p-3 text-center text-gray-600">{r.date}</td>
                          <td className="p-3 text-center"><span className={r.status === 'confirmed' ? 'badge-blue' : r.status === 'completed' ? 'badge-green' : 'badge-orange'}>{r.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : <Outlet />}
        </main>
      </div>
    </div>
  )
}
