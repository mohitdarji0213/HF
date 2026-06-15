import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiStar, FiPhone, FiMail, FiCalendar } from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import Navbar from '../../components/common/Navbar'
import { Link } from 'react-router-dom'
import { SkeletonHeadDoctorCard } from '../../components/common/Skeleton'

const HEAD_DOCTORS = [
  { _id: '1', name: 'Dr. Rajesh Sharma', specialty: 'Orthopedic Surgeon', department: 'Orthopedics', experience: 15, rating: 4.8, ratingCount: 120, qualification: 'MBBS, MS (Ortho), DNB', teamSize: 6, availability: true },
  { _id: '4', name: 'Dr. Sunita Patel', specialty: 'Pediatrician', department: 'Pediatrics', experience: 18, rating: 4.9, ratingCount: 200, qualification: 'MBBS, MD (Pediatrics)', teamSize: 5, availability: true },
  { _id: '6', name: 'Dr. Kavita Rao', specialty: 'Gynecologist', department: 'Gynecology', experience: 14, rating: 4.8, ratingCount: 145, qualification: 'MBBS, MS (OBG)', teamSize: 4, availability: true },
  { _id: '7', name: 'Dr. Arjun Mehta', specialty: 'Cardiologist', department: 'Cardiology', experience: 20, rating: 4.7, ratingCount: 180, qualification: 'MBBS, DM (Cardiology)', teamSize: 7, availability: false },
  { _id: '8', name: 'Dr. Pradeep Nair', specialty: 'Neurologist', department: 'Neurology', experience: 16, rating: 4.6, ratingCount: 95, qualification: 'MBBS, DM (Neurology)', teamSize: 4, availability: true },
]

export default function HeadDoctors() {
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  // Try backend; fallback to static HEAD_DOCTORS
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(t)
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!loading && HEAD_DOCTORS.map((doc, i) => (
              <motion.div key={doc._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="card cursor-pointer group" onClick={() => setSelected(selected?._id === doc._id ? null : doc)}>
                <div className="flex gap-4">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-red-600 flex items-center justify-center text-white font-bold text-xl">
                      {doc.name[3]}
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
                        <p className="text-xs text-primary-600 font-medium">{doc.specialty}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{doc.qualification}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                        <FiStar className="text-amber-500 fill-amber-400" size={11} />
                        <span className="text-xs font-bold text-amber-700">{doc.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>{doc.experience} yrs exp</span>
                      <span>·</span>
                      <span>{doc.teamSize} doctors</span>
                      <span className={`ml-auto flex items-center gap-1 font-medium ${doc.availability ? 'text-green-600' : 'text-gray-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${doc.availability ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        {doc.availability ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded */}
                {selected?._id === doc._id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-gray-100 flex gap-3 flex-wrap">
                    <Link to={`/patient/book-appointment?doctor=${doc._id}&dept=${doc.department}`}
                      className="btn-primary text-xs py-2" onClick={e => e.stopPropagation()}>
                      <FiCalendar size={13} /> Book with Dept
                    </Link>
                    <Link to="/patient/submit-issue" className="btn-secondary text-xs py-2" onClick={e => e.stopPropagation()}>
                      Submit Issue
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
