import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiEdit, FiStar } from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'

export default function DoctorHeadProfile() {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: user?.name || 'Dr. Rajesh Sharma',
    department: user?.department || 'Orthopedics',
    experience: user?.experience || '15',
    qualification: user?.qualification || 'MBBS, MS (Ortho), DNB',
    bio: 'Head of Orthopedics department. Specializing in joint replacement and trauma surgery.',
    phone: user?.phone || '+91 90990 97329',
    email: user?.email || 'dr.head@dbhchuru.org',
  })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-xl font-display font-bold text-gray-800">My Profile</h2>

      <div className="card">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-red-600 flex items-center justify-center text-white font-bold text-3xl">
              {profile.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-display font-bold text-gray-800">{profile.name}</h2>
                <MdVerified className="text-blue-600 text-lg" />
              </div>
              <p className="text-blue-700 font-semibold text-sm border-l-4 border-l-red-500 pl-2">Head — {profile.department}</p>
              <p className="text-gray-500 text-xs mt-0.5">{profile.qualification} · {profile.experience} yrs exp</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl">
              <FiStar className="text-amber-500 fill-amber-400" />
              <span className="font-bold text-amber-700">4.8</span>
              <span className="text-amber-500 text-xs">(120)</span>
            </div>
            <button onClick={() => setEditing(!editing)} className="btn-secondary text-sm py-2">
              <FiEdit size={14} /> {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {!editing && (
          <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><span className="label">Department</span><p className="text-gray-800 font-medium mt-1">{profile.department}</p></div>
            <div><span className="label">Phone</span><p className="text-gray-800 font-medium mt-1">{profile.phone}</p></div>
            <div><span className="label">Email</span><p className="text-gray-800 font-medium mt-1">{profile.email}</p></div>
            <div><span className="label">Bio</span><p className="text-gray-700 mt-1">{profile.bio}</p></div>
          </div>
        )}

        {editing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">Full Name</label><input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className="input-field" /></div>
            <div><label className="label">Department</label><input value={profile.department} onChange={e => setProfile(p => ({ ...p, department: e.target.value }))} className="input-field" /></div>
            <div><label className="label">Experience (years)</label><input type="number" value={profile.experience} onChange={e => setProfile(p => ({ ...p, experience: e.target.value }))} className="input-field" /></div>
            <div><label className="label">Qualification</label><input value={profile.qualification} onChange={e => setProfile(p => ({ ...p, qualification: e.target.value }))} className="input-field" /></div>
            <div><label className="label">Phone</label><input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className="input-field" /></div>
            <div><label className="label">Email</label><input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} className="input-field" /></div>
            <div className="sm:col-span-2"><label className="label">Bio</label><textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} rows={3} className="input-field resize-none" /></div>
            <div className="sm:col-span-2 flex justify-end"><button onClick={() => setEditing(false)} className="btn-primary">Save Changes</button></div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
