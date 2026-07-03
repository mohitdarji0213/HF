import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { FiHome, FiUser, FiCalendar, FiStar, FiUsers } from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import { SkeletonStatCard, SkeletonTableRow } from '../../components/common/Skeleton'
import { useAuth } from '../../context/AuthContext'
import { statsAPI, appointmentAPI } from '../../services/api'

const SIDEBAR_LINKS = [
  { to: '/doctor', icon: <FiHome />, label: 'Dashboard' },
  { to: '/doctor/profile', icon: <FiUser />, label: 'My Profile' },
  { to: '/doctor/appointments', icon: <FiCalendar />, label: 'My Appointments' },
  { to: '/doctor/patients', icon: <FiUsers />, label: 'My Patients' },
]

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [recentAppointments, setRecentAppointments] = useState([])
  const location = useLocation()
  const isBase = location.pathname === '/doctor' || location.pathname === '/doctor/'

  useEffect(() => {
    if (!isBase) return
    Promise.all([statsAPI.doctor(), appointmentAPI.getAll()])
      .then(([statsRes, apptRes]) => {
        setStats(statsRes)
        setRecentAppointments(Array.isArray(apptRes) ? apptRes.slice(0, 5) : [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isBase])

  const myRating = user?.rating?.average ?? user?.rating ?? null

  return (
    <div className="min-h-screen bg-hospital-bg">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex max-w-screen-2xl mx-auto">
        <Sidebar links={SIDEBAR_LINKS} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} title="Doctor" />
        <main className="flex-1 min-w-0 p-5">
          {isBase ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Profile Banner */}
              <div className="bg-gradient-to-r from-slate-800 to-blue-900 rounded-2xl p-5 text-white flex items-center gap-4 flex-wrap">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-red-600 flex items-center justify-center text-white font-bold text-2xl shrink-0">
                  {user?.name?.[0] || 'D'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-display font-bold text-white">{user?.name || 'Doctor'}</h2>
                    <MdVerified className="text-blue-300 text-lg" />
                  </div>
                  <p className="text-blue-200 text-sm">{user?.department || '—'}</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {user?.qualification || '—'}
                    {user?.experience ? ` · ${user.experience} yrs exp` : ''}
                  </p>
                </div>
                {myRating && (
                  <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-xl">
                    <FiStar className="fill-amber-400 text-amber-400" />
                    <span className="font-bold text-white">{myRating}</span>
                    {user?.rating?.count ? <span className="text-blue-200 text-xs">({user.rating.count})</span> : null}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? [...Array(4)].map((_, i) => <SkeletonStatCard key={i} />) : (<>
                  <div className="card text-center border-l-4 border-l-blue-500">
                    <p className="text-2xl font-bold text-blue-700">{stats?.todayAppointments ?? recentAppointments.length}</p>
                    <p className="text-sm text-gray-500 mt-1">Today's Appointments</p>
                  </div>
                  <div className="card text-center border-l-4 border-l-teal-500">
                    <p className="text-2xl font-bold text-teal-700">{stats?.totalPatients ?? '—'}</p>
                    <p className="text-sm text-gray-500 mt-1">Total Patients</p>
                  </div>
                  <div className="card text-center border-l-4 border-l-amber-500">
                    <p className="text-2xl font-bold text-amber-600">{myRating ?? stats?.rating ?? '—'}</p>
                    <p className="text-sm text-gray-500 mt-1">My Rating</p>
                  </div>
                  <div className="card text-center border-l-4 border-l-green-500">
                    <p className="text-2xl font-bold text-green-600">{stats?.reports ?? '—'}</p>
                    <p className="text-sm text-gray-500 mt-1">Reports</p>
                  </div>
                </>)}
              </div>

              {/* Recent Appointments */}
              <div className="card">
                <h3 className="section-title mb-4">Recent Appointments</h3>
                {loading ? (
                  <table className="w-full text-sm"><tbody>{[...Array(4)].map((_, i) => <SkeletonTableRow key={i} cols={4} />)}</tbody></table>
                ) : recentAppointments.length === 0 ? (
                  <p className="text-center text-gray-400 py-8 text-sm">No appointments yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="table-header">
                        <th className="text-left p-3">Patient</th>
                        <th className="p-3">Department</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Status</th>
                      </tr></thead>
                      <tbody>
                        {recentAppointments.map(a => (
                          <tr key={a._id} className="table-row">
                            <td className="p-3 font-medium text-gray-800">{a.patientName || '—'}</td>
                            <td className="p-3 text-center text-gray-600">{a.department || '—'}</td>
                            <td className="p-3 text-center text-gray-600">{a.date ? new Date(a.date).toLocaleDateString() : '—'}</td>
                            <td className="p-3 text-center">
                              <span className={a.status === 'completed' ? 'badge-green' : a.status === 'cancelled' ? 'badge-red' : a.status === 'confirmed' ? 'badge-blue' : 'badge-orange'}>
                                {a.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          ) : <Outlet />}
        </main>
      </div>
    </div>
  )
}
