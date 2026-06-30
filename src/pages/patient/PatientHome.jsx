import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiSearch, FiCalendar, FiAlertTriangle, FiFileText,
  FiPhone, FiChevronRight, FiHeart, FiShield, FiActivity
} from 'react-icons/fi'
import { MdLocalHospital, MdEmergency, MdStar } from 'react-icons/md'
import Navbar from '../../components/common/Navbar'
import { useAuth } from '../../context/AuthContext'

const quickLinks = [
  { to: '/patient/find-doctor', icon: <FiSearch className="text-white" />, label: 'Find Doctor', color: 'bg-blue-600', cardBg: 'bg-white border-slate-200', desc: 'Browse specialists' },
  { to: '/patient/book-appointment', icon: <FiCalendar className="text-white" />, label: 'Book Appointment', color: 'bg-green-600', cardBg: 'bg-white border-slate-200', desc: 'Schedule a visit' },
  { to: '/patient/ambulance', icon: <MdEmergency className="text-white" />, label: 'Ambulance', color: 'bg-red-600', cardBg: 'bg-white border-red-200', desc: 'Emergency service' },
  { to: '/patient/reports', icon: <FiFileText className="text-white" />, label: 'My Reports', color: 'bg-orange-500', cardBg: 'bg-white border-slate-200', desc: 'Download reports' },
  { to: '/patient/submit-issue', icon: <FiAlertTriangle className="text-white" />, label: 'Submit Issue', color: 'bg-purple-600', cardBg: 'bg-white border-slate-200', desc: 'Report a problem' },
  { to: '/patient/head-doctors', icon: <MdStar className="text-white" />, label: 'Head Doctors', color: 'bg-amber-500', cardBg: 'bg-white border-slate-200', desc: 'Department heads' },
]

const features = [
  { icon: <FiHeart className="text-red-500" />, bg: 'bg-red-50', title: '24/7 Emergency', desc: 'Round the clock emergency care available' },
  { icon: <FiShield className="text-blue-600" />, bg: 'bg-blue-50', title: 'Verified Doctors', desc: 'All doctors are certified & verified' },
  { icon: <FiActivity className="text-green-600" />, bg: 'bg-green-50', title: 'Digital Reports', desc: 'Access your reports anytime, anywhere' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
}
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 }
}

export default function PatientHome() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-hospital-bg">
      <Navbar showMenu={false} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900">
          <div className="max-w-4xl mx-auto px-5 py-14 text-center">
            <motion.div className="hero-text" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-4">
                <MdLocalHospital /> District Government Hospital
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-3 leading-tight">
                Welcome{user ? `, ${user.name?.split(' ')[0]}` : ''} to<br />
                <span className="text-red-400">MediCare HMS</span>
              </h1>
              <p className="text-blue-200 text-base max-w-xl mx-auto mb-8">
                Your complete healthcare solution. Book appointments, access reports, and connect with specialists — all in one place.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/patient/find-doctor" className="bg-white text-primary-600 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-all shadow-lg flex items-center gap-2">
                  <FiSearch /> Find a Doctor
                </Link>
                <Link to="/patient/ambulance" className="bg-red-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-600 transition-all shadow-lg flex items-center gap-2">
                  <MdEmergency /> Emergency
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        {/* Wave */}
        <svg viewBox="0 0 1440 40" className="block -mt-1 w-full" fill="#f8fafc">
          <path d="M0,40 C480,0 960,0 1440,40 L1440,40 L0,40 Z" />
        </svg>
      </section>

      {/* Quick Links */}
      <section className="max-w-4xl mx-auto px-5 -mt-2 pb-8">
        <h2 className="section-title mb-4 text-center">Quick Services</h2>
        <motion.div variants={containerVariants} initial="hidden" animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickLinks.map((link) => (
            <motion.div key={link.to} variants={itemVariants}>
              <Link to={link.to}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${link.cardBg} hover:shadow-hover transition-all duration-200 group`}>
                <div className={`w-12 h-12 ${link.color} rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>{link.icon}</div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-800">{link.label}</p>
                  <p className="text-[11px] text-gray-500">{link.desc}</p>
                </div>
                <FiChevronRight className="text-gray-300 text-sm" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-5 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-slate-800 text-white rounded-2xl p-5 flex gap-3 items-start">
              <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center text-xl shrink-0`}>
                {f.icon}
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{f.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="max-w-4xl mx-auto px-5 pb-10">
        <motion.div whileInView={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.97 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-5 flex items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-3">
            <FiPhone className="text-3xl shrink-0" />
            <div>
              <p className="font-display font-bold text-lg">Emergency Helpline</p>
              <p className="text-red-100 text-sm">Available 24/7 — Call Now</p>
            </div>
          </div>
          <a href="tel:108" className="bg-white text-red-600 font-bold text-lg px-6 py-2 rounded-xl hover:bg-red-50 transition-colors shrink-0">
            108
          </a>
        </motion.div>
      </section>
    </div>
  )
}
