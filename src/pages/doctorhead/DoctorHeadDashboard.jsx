import { useState } from 'react'
import { motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { FiHome, FiUser, FiCalendar, FiStar, FiUsers, FiFileText, FiEdit, FiPlus } from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import StatCard from '../../components/common/StatCard'
import { useAuth } from '../../context/AuthContext'

const SIDEBAR_LINKS = [
  { section: 'Overview' },
  { to: '/doctor-head', icon: <FiHome />, label: 'Dashboard' },
  { to: '/doctor-head/profile', icon: <FiUser />, label: 'My Profile' },
  { section: 'Department' },
  { to: '/doctor-head/my-appointments', icon: <FiCalendar />, label: 'Appointments' },
  { to: '/doctor-head/team', icon: <FiUsers />, label: 'My Team' },
  { to: '/doctor-head/department-reports', icon: <FiFileText />, label: 'Patient Reports' },
]

const aptData = [
  { month: 'Aug', appointments: 85 }, { month: 'Sep', appointments: 102 },
  { month: 'Oct', appointments: 94 }, { month: 'Nov', appointments: 118 },
]

export default function DoctorHeadDashboard() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const isBase = location.pathname === '/doctor-head' || location.pathname === '/doctor-head/'

  const TEAM_DOCTORS = [
    { name: 'Dr. Vikram Bose', rating: 4.5, patients: 85, reportsDownloaded: 67, available: true },
    { name: 'Dr. Anita Joshi', rating: 4.3, patients: 72, reportsDownloaded: 54, available: true },
    { name: 'Dr. Suresh Nair', rating: 4.6, patients: 91, reportsDownloaded: 78, available: false },
    { name: 'Dr. Rekha Singh', rating: 4.1, patients: 63, reportsDownloaded: 41, available: true },
  ]

  return (
    <div className="min-h-screen bg-hospital-bg">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex max-w-screen-2xl mx-auto">
        <Sidebar links={SIDEBAR_LINKS} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} title="Dept Head" />
        <main className="flex-1 min-w-0 p-5">
          {isBase ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Profile Banner */}
              <div className="bg-gradient-to-r from-slate-800 to-blue-900 rounded-2xl p-5 text-white flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-red-600 flex items-center justify-center text-2xl font-bold shrink-0">
                  {user?.name?.[0] || 'D'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-display font-bold">{user?.name || 'Dr. Rajesh Sharma'}</h2>
                    <MdVerified className="text-blue-300 text-lg" />
                  </div>
                  <p className="text-blue-200 text-sm">Head — {user?.department || 'Orthopedics'}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{user?.qualification || 'MBBS, MS (Ortho), DNB'} · 15 yrs experience</p>
                </div>
                <div className="hidden sm:flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-xl">
                  <FiStar className="fill-yellow-300 text-yellow-300" />
                  <span className="text-white font-bold">4.8</span>
                  <span className="text-blue-200 text-xs">(120)</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<FiUsers />} label="My Team" value="6" color="blue" />
                <StatCard icon={<FiCalendar />} label="Dept Appointments" value="118" sub="This month" color="green" />
                <StatCard icon={<FiFileText />} label="Reports Downloaded" value="342" color="teal" />
                <StatCard icon={<FiStar />} label="My Rating" value="4.8" sub="120 reviews" color="orange" />
              </div>

              {/* Chart + Team */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="card lg:col-span-1">
                  <h3 className="section-title mb-4">Department Appointments</h3>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={aptData} barSize={20}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="appointments" fill="#3b82f6" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="card lg:col-span-2">
                  <h3 className="section-title mb-4">My Department Doctors</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="table-header">
                        <th className="text-left p-2.5">Doctor</th>
                        <th className="p-2.5">Rating</th>
                        <th className="p-2.5">Patients</th>
                        <th className="p-2.5">Reports DL</th>
                        <th className="p-2.5">Status</th>
                      </tr></thead>
                      <tbody>
                        {TEAM_DOCTORS.map((d, i) => (
                          <tr key={i} className="table-row">
                            <td className="p-2.5 font-medium text-gray-800">{d.name}</td>
                            <td className="p-2.5 text-center">
                              <span className="flex items-center justify-center gap-1">
                                <FiStar className="text-amber-500 fill-amber-400" size={11} /> {d.rating}
                              </span>
                            </td>
                            <td className="p-2.5 text-center font-semibold text-gray-800">{d.patients}</td>
                            <td className="p-2.5 text-center text-gray-600">{d.reportsDownloaded}</td>
                            <td className="p-2.5 text-center">
                              <span className={d.available ? 'badge-green' : 'badge-red'}>
                                {d.available ? 'Active' : 'Leave'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : <Outlet />}
        </main>
      </div>
    </div>
  )
}
