import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  FiHome, FiCalendar, FiFileText, FiAlertTriangle, FiUsers, FiActivity
} from 'react-icons/fi'
import { MdEmergency, MdEvent } from 'react-icons/md'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import { issueAPI, statsAPI, appointmentAPI, reportAPI } from '../../services/api'
import { SkeletonStatCard } from '../../components/common/Skeleton'
import ExportButtons from '../../components/common/ExportButtons'
import { DEMO_MODE, DEMO_ISSUES, DEMO_MANAGER_STATS, DEMO_WEEK_ACTIVITY } from '../../utils/demo'

const SIDEBAR_LINKS = [
  { section: 'Overview' },
  { to: '/manager', icon: <FiHome />, label: 'Dashboard' },
  { section: 'Data & Analytics' },
  { to: '/manager/appointments', icon: <FiCalendar />, label: 'Appointments' },
  { to: '/manager/ambulance', icon: <MdEmergency />, label: 'Ambulance Stats' },
  { to: '/manager/reports', icon: <FiFileText />, label: 'Parchi Analytics' },
  { to: '/manager/patients', icon: <FiActivity />, label: 'Patient Stats' },
  { section: 'Management' },
  { to: '/manager/issues', icon: <FiAlertTriangle />, label: 'Issues' },
  { to: '/manager/events', icon: <MdEvent />, label: 'Upload Events' },
  { to: '/manager/doctors', icon: <FiUsers />, label: 'Doctor Overview' },
]

export default function ManagerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [issues, setIssues] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const isBase = location.pathname === '/manager' || location.pathname === '/manager/'

  useEffect(() => {
    if (!isBase) return
    const load = async () => {
      try {
        const [issuesRes, statsRes] = await Promise.all([
          issueAPI.getAll(),
          statsAPI.manager(),
        ])
        setIssues(Array.isArray(issuesRes) ? issuesRes.slice(0, 3) : [])
        setStats(statsRes)
      } catch {
        if (DEMO_MODE) {
          setIssues(DEMO_ISSUES)
          setStats(DEMO_MANAGER_STATS)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isBase])

  const urgencyColor = { high: 'badge-red', medium: 'badge-orange', low: 'badge-green' }
  const statusColor = { open: 'badge-red', 'in-progress': 'badge-orange', resolved: 'badge-green' }

  const exportData = issues.map(i => ({
    Date: i.createdAt ? new Date(i.createdAt).toLocaleDateString() : i.date || '—',
    From: i.senderName || i.from || '—',
    Department: i.department || i.dept || '—',
    Type: i.issueType || i.type || '—',
    Urgency: i.urgency,
    Status: i.status,
  }))

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
                {!loading && <ExportButtons data={exportData} filename="Manager_Issues" title="Manager Dashboard Report" />}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? [...Array(4)].map((_, i) => <SkeletonStatCard key={i} />) : (<>
                  <div className="card text-center border-l-4 border-l-blue-500">
                    <p className="text-2xl font-bold text-blue-700">{stats?.appointments ?? '—'}</p>
                    <p className="text-sm text-gray-500 mt-1">Appointments</p>
                  </div>
                  <div className="card text-center border-l-4 border-l-orange-500">
                    <p className="text-2xl font-bold text-orange-600">{stats?.ambulance ?? '—'}</p>
                    <p className="text-sm text-gray-500 mt-1">Ambulance</p>
                  </div>
                  <div className="card text-center border-l-4 border-l-teal-500">
                    <p className="text-2xl font-bold text-teal-700">{stats?.reports ?? '—'}</p>
                    <p className="text-sm text-gray-500 mt-1">Reports Uploaded</p>
                  </div>
                  <div className="card text-center border-l-4 border-l-red-500">
                    <p className="text-2xl font-bold text-red-600">{stats?.issues ?? issues.length}</p>
                    <p className="text-sm text-gray-500 mt-1">Pending Issues</p>
                  </div>
                </>)}
              </div>

              {/* Chart + Issues */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="card lg:col-span-2">
                  <h3 className="section-title mb-4">This Week's Activity</h3>
                  {loading ? (
                    <div className="h-[200px] bg-slate-100 animate-pulse rounded-xl" />
                  ) : (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={DEMO_WEEK_ACTIVITY} barSize={18}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="appointments" fill="#3b82f6" radius={4} name="Appointments" />
                        <Bar dataKey="reports" fill="#e11d48" radius={4} name="Reports" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Issues */}
                <div className="card">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="section-title">Recent Issues</h3>
                    <Link to="/manager/issues" className="text-xs text-primary-600 hover:underline">View All</Link>
                  </div>
                  <div className="space-y-3">
                    {loading ? [...Array(3)].map((_, i) => (
                      <div key={i} className="p-3 bg-slate-100 animate-pulse rounded-xl h-16" />
                    )) : issues.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-4">No issues</p>
                    ) : issues.map(issue => (
                      <div key={issue._id || issue.id} className={`p-3 bg-gray-50 rounded-xl border ${issue.urgency === 'high' ? 'border-l-4 border-l-red-500 border-gray-100' : 'border-gray-100'}`}>
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-xs font-semibold text-gray-800">{issue.issueType || issue.type}</p>
                          <span className={`text-[10px] ${urgencyColor[issue.urgency]} px-1.5 py-0.5 rounded-full font-medium`}>{issue.urgency}</span>
                        </div>
                        <p className="text-xs text-gray-500">{issue.department || issue.dept} · {issue.senderName || issue.from}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[10px] text-gray-400">{issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : issue.date}</span>
                          <span className={`text-[10px] ${statusColor[issue.status]} px-1.5 py-0.5 rounded-full font-medium`}>{issue.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card text-center py-6 text-sm text-gray-500">
                View detailed appointment and ambulance data in the sidebar sections →
              </div>
            </motion.div>
          ) : <Outlet />}
        </main>
      </div>
    </div>
  )
}
