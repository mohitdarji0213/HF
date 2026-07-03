import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { FiHome, FiUser, FiCalendar, FiStar, FiUsers, FiFileText } from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import { SkeletonStatCard, SkeletonTableRow } from '../../components/common/Skeleton'
import { useAuth } from '../../context/AuthContext'
import { statsAPI, doctorAPI } from '../../services/api'

const SIDEBAR_LINKS = [
  { section: 'Overview' },
  { to: '/doctor-head', icon: <FiHome />, label: 'Dashboard' },
  { to: '/doctor-head/profile', icon: <FiUser />, label: 'My Profile' },
  { section: 'Department' },
  { to: '/doctor-head/my-appointments', icon: <FiCalendar />, label: 'Appointments' },
  { to: '/doctor-head/team', icon: <FiUsers />, label: 'My Team' },
  { to: '/doctor-head/department-reports', icon: <FiFileText />, label: 'Patient Reports' },
]

export default function DoctorHeadDashboard() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [team, setTeam] = useState([])
  const location = useLocation()
  const isBase = location.pathname === '/doctor-head' || location.pathname === '/doctor-head/'

  useEffect(() => {
    if (!isBase) return
    Promise.all([
      statsAPI.doctorHead(),
      doctorAPI.getAll({ department: user?.department }),
    ])
      .then(([statsRes, doctorsRes]) => {
        setStats(statsRes)
        setTeam(Array.isArray(doctorsRes) ? doctorsRes.filter(d => d._id !== user?._id) : [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isBase, user])

  const myRating = user?.rating?.average ?? user?.rating ?? null

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
                    <h2 className="text-xl font-display font-bold">{user?.name || 'Doctor Head'}</h2>
                    <MdVerified className="text-blue-300 text-lg" />
                  </div>
                  <p className="text-blue-200 text-sm">Head — {user?.department || '—'}</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {user?.qualification || '—'}
                    {user?.experience ? ` · ${user.experience} yrs experience` : ''}
                  </p>
                </div>
                {myRating && (
                  <div className="hidden sm:flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-xl">
                    <FiStar className="fill-yellow-300 text-yellow-300" />
                    <span className="text-white font-bold">{myRating}</span>
                    {user?.rating?.count ? <span className="text-blue-200 text-xs">({user.rating.count})</span> : null}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? [...Array(4)].map((_, i) => <SkeletonStatCard key={i} />) : (<>
                  <div className="card text-center border-l-4 border-l-blue-500">
                    <p className="text-2xl font-bold text-blue-700">{stats?.teamCount ?? team.length}</p>
                    <p className="text-sm text-gray-500 mt-1">My Team</p>
                  </div>
                  <div className="card text-center border-l-4 border-l-green-500">
                    <p className="text-2xl font-bold text-green-600">{stats?.appointments ?? '—'}</p>
                    <p className="text-sm text-gray-500 mt-1">Dept Appointments</p>
                  </div>
                  <div className="card text-center border-l-4 border-l-teal-500">
                    <p className="text-2xl font-bold text-teal-600">{stats?.reports ?? '—'}</p>
                    <p className="text-sm text-gray-500 mt-1">Reports</p>
                  </div>
                  <div className="card text-center border-l-4 border-l-amber-500">
                    <p className="text-2xl font-bold text-amber-600">{myRating ?? '—'}</p>
                    <p className="text-sm text-gray-500 mt-1">My Rating</p>
                  </div>
                </>)}
              </div>

              {/* Team Table */}
              <div className="card">
                <h3 className="section-title mb-4">My Department Doctors</h3>
                {loading ? (
                  <table className="w-full text-sm"><tbody>{[...Array(3)].map((_, i) => <SkeletonTableRow key={i} cols={4} />)}</tbody></table>
                ) : team.length === 0 ? (
                  <p className="text-center text-gray-400 py-8 text-sm">No other doctors in department yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="table-header">
                        <th className="text-left p-2.5">Doctor</th>
                        <th className="p-2.5">Qualification</th>
                        <th className="p-2.5">Experience</th>
                        <th className="p-2.5">Rating</th>
                        <th className="p-2.5">Status</th>
                      </tr></thead>
                      <tbody>
                        {team.map(d => (
                          <tr key={d._id} className="table-row">
                            <td className="p-2.5 font-medium text-gray-800">{d.name}</td>
                            <td className="p-2.5 text-center text-gray-600 text-xs">{d.qualification || '—'}</td>
                            <td className="p-2.5 text-center text-gray-600">{d.experience ? `${d.experience} yrs` : '—'}</td>
                            <td className="p-2.5 text-center">
                              <span className="flex items-center justify-center gap-1">
                                <FiStar className="text-amber-500 fill-amber-400" size={11} />
                                {d.rating?.average ?? d.rating ?? '—'}
                              </span>
                            </td>
                            <td className="p-2.5 text-center">
                              <span className={d.isAvailable !== false ? 'badge-green' : 'badge-red'}>
                                {d.isAvailable !== false ? 'Active' : 'Leave'}
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
