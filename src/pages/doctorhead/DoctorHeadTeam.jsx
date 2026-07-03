import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'
import { SkeletonStatCard } from '../../components/common/Skeleton'
import { doctorAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function DoctorHeadTeam() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [team, setTeam] = useState([])

  useEffect(() => {
    doctorAPI.getAll({ department: user?.department })
      .then(res => setTeam(Array.isArray(res) ? res : []))
      .catch(() => setTeam([]))
      .finally(() => setLoading(false))
  }, [user])

  const active = team.filter(d => d.isAvailable !== false)
  const avgRating = team.length
    ? (team.reduce((s, d) => s + (d.rating?.average ?? d.rating ?? 0), 0) / team.length).toFixed(1)
    : '—'

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-gray-800">My Team</h2>
        {!loading && <span className="text-sm text-gray-500">{team.length} doctors in department</span>}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {loading ? [...Array(4)].map((_, i) => <SkeletonStatCard key={i} />) : (<>
          <div className="card text-center border-l-4 border-l-blue-500">
            <p className="text-2xl font-bold text-blue-700">{team.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total Doctors</p>
          </div>
          <div className="card text-center border-l-4 border-l-green-500">
            <p className="text-2xl font-bold text-green-600">{active.length}</p>
            <p className="text-sm text-gray-500 mt-1">Active Today</p>
          </div>
          <div className="card text-center border-l-4 border-l-amber-500">
            <p className="text-2xl font-bold text-amber-600">{avgRating}</p>
            <p className="text-sm text-gray-500 mt-1">Avg Rating</p>
          </div>
          <div className="card text-center border-l-4 border-l-red-500">
            <p className="text-2xl font-bold text-red-600">{team.length - active.length}</p>
            <p className="text-sm text-gray-500 mt-1">On Leave</p>
          </div>
        </>)}
      </div>

      <div className="card">
        <h3 className="section-title mb-4">Department Doctors</h3>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : team.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">No doctors in department yet</p>
        ) : (
          <div className="space-y-3">
            {team.map(doc => (
              <div key={doc._id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-red-600 flex items-center justify-center text-white font-bold text-sm">
                    {doc.name?.[0] || 'D'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{doc.name}</p>
                    <p className="text-xs text-gray-500">
                      {doc.qualification || '—'}
                      {doc.experience ? ` · ${doc.experience} yrs` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {(doc.rating?.average ?? doc.rating) && (
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                      <FiStar className="text-amber-500 fill-amber-400" size={11} />
                      <span className="text-xs font-bold text-amber-700">{doc.rating?.average ?? doc.rating}</span>
                    </div>
                  )}
                  <span className={doc.isAvailable !== false ? 'badge-green' : 'badge-red'}>
                    {doc.isAvailable !== false ? 'Active' : 'On Leave'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
