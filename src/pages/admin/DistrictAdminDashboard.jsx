import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import {
  FiHome, FiUsers, FiCalendar, FiFileText, FiAlertTriangle,
  FiStar, FiDownload, FiTrendingUp, FiBell, FiActivity
} from 'react-icons/fi'
import { MdEmergency, MdEvent, MdLocalHospital } from 'react-icons/md'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import StatCard from '../../components/common/StatCard'
import { exportToExcel } from '../../utils/exportExcel'
import ExportButtons from '../../components/common/ExportButtons'

const SIDEBAR_LINKS = [
  { section: 'Overview' },
  { to: '/admin', icon: <FiHome />, label: 'Dashboard' },
  { section: 'Analytics' },
  { to: '/admin/appointments', icon: <FiCalendar />, label: 'Appointments' },
  { to: '/admin/ambulance', icon: <MdEmergency />, label: 'Ambulance' },
  { to: '/admin/reports', icon: <FiFileText />, label: 'Report Analytics' },
  { to: '/admin/doctors', icon: <FiUsers />, label: 'Doctor Ratings' },
  { section: 'Management' },
  { to: '/admin/patients', icon: <FiActivity />, label: 'Patient Statistics' },
  { to: '/admin/issues', icon: <FiAlertTriangle />, label: 'Issues', badge: '5' },
  { to: '/admin/events', icon: <MdEvent />, label: 'Events' },
]

const statsData = [
  { month: 'Jun', appointments: 320, ambulance: 45 },
  { month: 'Jul', appointments: 410, ambulance: 62 },
  { month: 'Aug', appointments: 380, ambulance: 51 },
  { month: 'Sep', appointments: 450, ambulance: 70 },
  { month: 'Oct', appointments: 520, ambulance: 83 },
  { month: 'Nov', appointments: 490, ambulance: 76 },
]

const deptData = [
  { name: 'Orthopedics', value: 280, color: '#3b82f6' },
  { name: 'Cardiology', value: 190, color: '#e11d48' },
  { name: 'Pediatrics', value: 240, color: '#0ea5e9' },
  { name: 'Neurology', value: 120, color: '#1d4ed8' },
  { name: 'Others', value: 170, color: '#14b8a6' },
]

export default function DistrictAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const isBase = location.pathname === '/admin' || location.pathname === '/admin/'

  const handleExport = () => {
    exportToExcel(statsData.map(d => ({
      Month: d.month, Appointments: d.appointments, AmbulanceBookings: d.ambulance
    })), 'District_Analytics')
  }

  return (
    <div className="min-h-screen bg-hospital-bg">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex max-w-screen-2xl mx-auto">
        <Sidebar links={SIDEBAR_LINKS} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} title="District Admin" />

        <main className="flex-1 min-w-0 p-5">
          {isBase ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-800 to-blue-900 rounded-2xl p-6 mb-2 text-white flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-2xl font-display font-bold text-white">District Dashboard</h1>
                  <p className="text-blue-200 text-sm mt-1">District Level Hospital Management Overview</p>
                </div>
                <ExportButtons
                  data={statsData.map(d => ({ Month: d.month, Appointments: d.appointments, AmbulanceBookings: d.ambulance }))}
                  filename="District_Analytics"
                  title="District Analytics Report"
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon="🏥" label="Total Patients" value="12,485" color="blue" trend={8} />
                <StatCard icon={<FiCalendar />} label="Appointments" value="3,240" color="blue" trend={12} />
                <StatCard icon={<MdEmergency />} label="Ambulance Calls" value="487" color="orange" trend={-3} />
                <StatCard icon={<FiFileText />} label="Reports Downloaded" value="2,180" color="teal" trend={15} />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<FiUsers />} label="Total Doctors" value="48" color="blue" />
                <StatCard icon={<FiStar />} label="Avg Doctor Rating" value="4.7" color="orange" />
                <StatCard icon={<FiAlertTriangle />} label="Open Issues" value="5" color="red" />
                <StatCard icon={<MdEvent />} label="Events This Month" value="3" color="teal" />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="card lg:col-span-2">
                  <h3 className="section-title mb-4">Monthly Activity (Last 6 Months)</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={statsData}>
                      <defs>
                        <linearGradient id="aptGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="ambGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#e11d48" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="appointments" stroke="#3b82f6" fill="url(#aptGrad)" strokeWidth={2} name="Appointments" />
                      <Area type="monotone" dataKey="ambulance" stroke="#e11d48" fill="url(#ambGrad)" strokeWidth={2} name="Ambulance" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="card">
                  <h3 className="section-title mb-4">By Department</h3>
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart>
                      <Pie data={deptData} cx="50%" cy="50%" outerRadius={60} dataKey="value" label={({ name, percent }) => `${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                        {deptData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-2">
                    {deptData.map(d => (
                      <div key={d.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
                          <span className="text-gray-600">{d.name}</span>
                        </div>
                        <span className="font-semibold text-gray-800">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Doctor Ratings Table */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="section-title">Top Rated Doctors</h3>
                  <Link to="/admin/doctors" className="text-xs text-primary-600 font-medium hover:underline">View All →</Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="table-header"><th className="text-left p-3">Doctor</th><th className="text-left p-3">Dept</th><th className="p-3">Rating</th><th className="p-3">Patients</th><th className="p-3">Status</th></tr></thead>
                    <tbody>
                      {[
                        { name: 'Dr. Sunita Patel', dept: 'Pediatrics', rating: 4.9, patients: 200, active: true },
                        { name: 'Dr. Rajesh Sharma', dept: 'Orthopedics', rating: 4.8, patients: 120, active: true },
                        { name: 'Dr. Kavita Rao', dept: 'Gynecology', rating: 4.8, patients: 145, active: true },
                        { name: 'Dr. Arjun Mehta', dept: 'Cardiology', rating: 4.7, patients: 180, active: false },
                      ].map((d, i) => (
                        <tr key={i} className="table-row">
                          <td className="p-3 font-medium text-gray-800">{d.name}</td>
                          <td className="p-3 text-gray-600">{d.dept}</td>
                          <td className="p-3 text-center">
                            <span className="flex items-center justify-center gap-1"><FiStar className="text-amber-500 fill-amber-400" size={12} /> {d.rating}</span>
                          </td>
                          <td className="p-3 text-center font-semibold text-gray-800">{d.patients}</td>
                          <td className="p-3 text-center">
                            <span className={`badge-${d.active ? 'green' : 'red'}`}>{d.active ? 'Active' : 'Leave'}</span>
                          </td>
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
