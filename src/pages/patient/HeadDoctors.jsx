import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiStar, FiCalendar } from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import Navbar from '../../components/common/Navbar'
import { Link } from 'react-router-dom'
import { SkeletonHeadDoctorCard } from '../../components/common/Skeleton'
import { doctorAPI } from '../../services/api'

export default function HeadDoctors() {
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    doctorAPI.getAll({ head: 'true' })
      .then(data => setDoctors(Array.isArray(data) ? data : []))
      .catch(() => setDoctors([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-hospital-bg">
      <Navbar showMenu={false} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="page-title mb-1">Department Head Doctors</h1>
          <p className="text-gray-500 text-sm mb-6">Meet our specialist department heads</p>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              {[...Array(4)].map((_, i) => <SkeletonHeadDoctorCard key={i} />)}
            </div>
          )}

          {!loading && doctors.length === 0 && (
            <p className="text-center text-gray-400 py-12 text-sm">No department heads found</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!loading && doctors.map((doc, i) => (
              <motion.div key={doc._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="card cursor-pointer group" onClick={() => setSelected(selected?._id === doc._id ? null : doc)}>
                <div className="flex gap-4">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-red-600 flex items-center justify-center text-white font-bold text-xl">
                      {doc.name?.[0] || 'D'}
                    </div>
                    <span className="absolute -bottom-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">HEAD</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-display font-bold text-gray-800 text-sm">{doc.name}</h3>
                          <MdVerified className="text-primary-500" />
                        </div>
                        <p className="text-xs text-primary-600 font-medium">{doc.specialty || doc.department}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{doc.qualification || 'MBBS'}</p>
                      </div>
                      {doc.rating > 0 && (
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                          <FiStar className="text-amber-500 fill-amber-400" size={11} />
                          <span className="text-xs font-bold text-amber-700">{doc.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      {doc.experience ? <span>{doc.experience} yrs exp</span> : null}
                      <span className={`ml-auto flex items-center gap-1 font-medium ${doc.availability !== false ? 'text-green-600' : 'text-gray-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${doc.availability !== false ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        {doc.availability !== false ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                </div>

                {selected?._id === doc._id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-gray-100 flex gap-3 flex-wrap">
                    <Link
                      to={`/patient/book-appointment?doctorId=${doc._id}&department=${encodeURIComponent(doc.department || '')}&doctorName=${encodeURIComponent(doc.name || '')}`}
                      className="btn-primary text-xs py-2"
                      onClick={e => e.stopPropagation()}>
                      <FiCalendar size={13} /> Book Appointment
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

        </motion.div>
      </div>
    </div>
  )
}
