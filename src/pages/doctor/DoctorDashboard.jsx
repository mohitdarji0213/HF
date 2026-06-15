import { useState } from 'react'
import { motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { FiHome, FiUser, FiCalendar, FiStar, FiUsers, FiEdit } from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import StatCard from '../../components/common/StatCard'
import { useAuth } from '../../context/AuthContext'

const SIDEBAR_LINKS = [
  { to: '/doctor', icon: <FiHome />, label: 'Dashboard' },
  { to: '/doctor/profile', icon: <FiUser />, label: 'My Profile' },
  { to: '/doctor/appointments', icon: <FiCalendar />, label: 'My Appointments' },
  { to: '/doctor/patients', icon: <FiUsers />, label: 'My Patients' },
]

const MY_PATIENTS = [
  { name: 'Ramesh Kumar', age: 45, issue: 'Knee Pain', date: '2024-11-15', reportDownloaded: true },
  { name: 'Meena Sharma', age: 32, issue: 'Back Injury', date: '2024-11-14', reportDownloaded: false },
  { name: 'Govind Lal', age: 58, issue: 'Joint Pain', date: '2024-11-13', reportDownloaded: true },
  { name: 'Asha Devi', age: 29, issue: 'Fracture Follow-up', date: '2024-11-12', reportDownloaded: true },
]

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: user?.name || 'Dr. Anita Joshi',
    specialty: user?.specialty || 'Orthopedic Surgeon',
    experience: user?.experience || '8',
    qualification: user?.qualification || 'MBBS, MS (Ortho)',
    bio: 'Specializing in sports injuries and joint replacement surgeries.',
  })
  const location = useLocation()
  const isBase = location.pathname === '/doctor' || location.pathname === '/doctor/'

  return (
    <div className="min-h-screen bg-hospital-bg">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex max-w-screen-2xl mx-auto">
        <Sidebar links={SIDEBAR_LINKS} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} title="Doctor" />
        <main className="flex-1 min-w-0 p-5">
          {isBase ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Profile Card */}
              <div className="bg-gradient-to-r from-slate-800 to-blue-900 rounded-2xl p-5 text-white">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-red-600 flex items-center justify-center text-white font-bold text-2xl">
                      {profile.name[3]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-display font-bold text-white">{profile.name}</h2>
                        <MdVerified className="text-blue-300 text-lg" />
                      </div>
                      <p className="text-blue-200 font-medium text-sm">{profile.specialty}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{profile.qualification} · {profile.experience} yrs exp</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-xl">
                      <FiStar className="text-amber-400 fill-amber-400" />
                      <span className="font-bold text-white">4.5</span>
                      <span className="text-blue-200 text-xs">(85)</span>
                    </div>
                    <button onClick={() => setEditing(!editing)} className="bg-white/20 hover:bg-white/30 text-white border border-white/30 text-sm font-medium px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors">
                      <FiEdit size={14} /> {editing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>
                </div>

                {editing && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-white/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="label text-blue-200">Full Name</label><input value={profile.name} onChange={e => setProfile(p => ({...p, name: e.target.value}))} className="input-field" /></div>
                    <div><label className="label text-blue-200">Specialty</label><input value={profile.specialty} onChange={e => setProfile(p => ({...p, specialty: e.target.value}))} className="input-field" /></div>
                    <div><label className="label text-blue-200">Experience (years)</label><input type="number" value={profile.experience} onChange={e => setProfile(p => ({...p, experience: e.target.value}))} className="input-field" /></div>
                    <div><label className="label text-blue-200">Qualification</label><input value={profile.qualification} onChange={e => setProfile(p => ({...p, qualification: e.target.value}))} className="input-field" /></div>
                    <div className="sm:col-span-2"><label className="label text-blue-200">Bio</label><textarea value={profile.bio} onChange={e => setProfile(p => ({...p, bio: e.target.value}))} rows={3} className="input-field resize-none" /></div>
                    <div className="sm:col-span-2 flex justify-end"><button onClick={() => setEditing(false)} className="btn-primary">Save Changes</button></div>
                  </motion.div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<FiCalendar />} label="Today's Appointments" value="8" color="blue" />
                <StatCard icon={<FiUsers />} label="Total Patients" value="85" color="teal" />
                <StatCard icon={<FiStar />} label="Rating" value="4.5" color="orange" />
                <StatCard icon="📋" label="Reports Uploaded" value="67" color="blue" />
              </div>

              {/* My Patients */}
              <div className="card">
                <h3 className="section-title mb-4">My Recent Patients</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="table-header">
                      <th className="text-left p-3">Patient</th>
                      <th className="p-3">Age</th>
                      <th className="p-3">Issue</th>
                      <th className="p-3">Visit Date</th>
                      <th className="p-3">Report DL</th>
                    </tr></thead>
                    <tbody>
                      {MY_PATIENTS.map((p, i) => (
                        <tr key={i} className="table-row">
                          <td className="p-3 font-medium text-gray-800">{p.name}</td>
                          <td className="p-3 text-center text-gray-600">{p.age}</td>
                          <td className="p-3 text-center text-gray-600">{p.issue}</td>
                          <td className="p-3 text-center text-gray-600">{p.date}</td>
                          <td className="p-3 text-center">
                            <span className={p.reportDownloaded ? 'badge-green' : 'badge-orange'}>
                              {p.reportDownloaded ? '✓ Downloaded' : 'Not yet'}
                            </span>
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
