import { motion } from 'framer-motion'
import { FiStar, FiMapPin, FiClock, FiCalendar } from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import { Link } from 'react-router-dom'

export default function DoctorCard({ doctor }) {
  const {
    _id, name, specialty, department, experience, rating, ratingCount,
    availability, hospital, photo, isHead, fee,
  } = doctor

  return (
    <motion.div whileHover={{ y: -3 }} className="card group cursor-pointer">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl overflow-hidden">
            {photo ? <img src={photo} alt={name} className="w-full h-full object-cover" /> : name?.[0]}
          </div>
          {isHead && (
            <span className="absolute -top-1 -right-1 bg-accent-orange text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              HEAD
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-semibold text-gray-800 text-sm">{name}</h3>
                <MdVerified className="text-primary-500 text-base shrink-0" />
              </div>
              <p className="text-xs text-primary-600 font-medium">{specialty}</p>
            </div>
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
              <FiStar className="text-amber-500 fill-amber-400" size={12} />
              <span className="text-xs font-semibold text-amber-700">{rating?.toFixed(1) || '—'}</span>
              <span className="text-[10px] text-gray-400">({ratingCount || 0})</span>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <FiClock size={11} /> {experience} yrs exp
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <FiMapPin size={11} /> {department}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${availability ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              <span className={`text-xs font-medium ${availability ? 'text-green-600' : 'text-gray-400'}`}>
                {availability ? 'Available Today' : 'Not Available'}
              </span>
            </div>
            {fee && <span className="text-xs font-semibold text-gray-700">₹{fee} / visit</span>}
            <Link to={`/patient/book-appointment?doctor=${_id}`}
              className="text-xs btn-primary py-1.5 px-3">
              <FiCalendar size={12} /> Book
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
