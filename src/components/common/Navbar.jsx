import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMenu, FiBell, FiLogOut, FiHome,
  FiSearch, FiCalendar, FiFileText, FiAlertTriangle,
  FiStar, FiChevronDown, FiGrid,
} from 'react-icons/fi'
import { MdLocalHospital, MdEmergency } from 'react-icons/md'
import { useAuth, ROLE_LABELS } from '../../context/AuthContext'

const roleBadgeColors = {
  patient:          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  district_admin:   'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  hospital_manager: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  doctor_head:      'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  doctor:           'bg-teal-500/20 text-teal-300 border border-teal-500/30',
  lab_assistant:    'bg-pink-500/20 text-pink-300 border border-pink-500/30',
}

const PATIENT_SERVICES = [
  { label: 'Find Doctor',      to: '/patient/find-doctor',      icon: FiSearch,        color: 'text-blue-400',   hov: 'hover:bg-blue-500/10'   },
  { label: 'Book Appointment', to: '/patient/book-appointment', icon: FiCalendar,      color: 'text-cyan-400',   hov: 'hover:bg-cyan-500/10'    },
  { label: 'Ambulance',        to: '/patient/ambulance',        icon: MdEmergency,     color: 'text-red-400',    hov: 'hover:bg-red-500/10'    },
  { label: 'My Reports',       to: '/patient/reports',          icon: FiFileText,      color: 'text-indigo-400', hov: 'hover:bg-indigo-500/10' },
  { label: 'Submit Issue',     to: '/patient/submit-issue',     icon: FiAlertTriangle, color: 'text-violet-400', hov: 'hover:bg-violet-500/10' },
  { label: 'Head Doctors',     to: '/patient/head-doctors',     icon: FiStar,          color: 'text-amber-400',  hov: 'hover:bg-amber-500/10'  },
]

export default function Navbar({ onMenuToggle, showMenu = true }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropOpen, setDropOpen]         = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const servicesRef = useRef(null)

  const handleLogout = () => { logout(); navigate('/home') }

  useEffect(() => {
    const handler = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target))
        setServicesOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const showServices = !user || user.role === 'patient'

  return (
    <header className="bg-slate-900 border-b border-slate-700/60 sticky top-0 z-50 shadow-lg">
      <div className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center justify-between gap-3">

        {/* Left — Logo */}
        <div className="flex items-center gap-3">
          {showMenu && (
            <button onClick={onMenuToggle}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white lg:hidden transition-colors">
              <FiMenu size={20} />
            </button>
          )}
          <Link to="/home" className="flex items-center gap-2.5 no-underline group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <MdLocalHospital className="text-white text-xl" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-display font-bold text-white leading-tight group-hover:text-blue-300 transition-colors">DBH · MediCare HMS</p>
              <p className="text-[10px] text-slate-400 leading-tight">Hospital Management</p>
            </div>
          </Link>
        </div>

        {/* Center — Nav links */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/home"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all no-underline">
            <FiHome size={14} /> Home
          </Link>

          {showServices && (
            <div ref={servicesRef} className="relative">
              <button onClick={() => setServicesOpen(!servicesOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                <FiGrid size={14} />
                Services
                <FiChevronDown size={12} className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 w-52 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 py-2 z-50">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 pb-1.5">Hospital Services</p>
                    {PATIENT_SERVICES.map(s => {
                      const Icon = s.icon
                      return (
                        <Link key={s.to} to={s.to} onClick={() => setServicesOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white ${s.hov} no-underline transition-colors`}>
                          <Icon size={15} className={s.color} />
                          {s.label}
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Right */}
        {user ? (
          <div className="flex items-center gap-2">
            <span className={`hidden md:inline text-xs font-semibold px-2.5 py-1 rounded-full ${roleBadgeColors[user.role] || 'bg-slate-700 text-slate-300'}`}>
              {ROLE_LABELS[user.role]}
            </span>
            <button className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white relative transition-colors">
              <FiBell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>
            <div className="relative">
              <button onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-red-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden md:block text-sm font-medium text-slate-300">{user.name?.split(' ')[0]}</span>
              </button>

              <AnimatePresence>
                {dropOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-56 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 py-1 z-50">
                    <div className="px-4 py-3 border-b border-slate-700">
                      <p className="text-sm font-bold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-blue-400 font-semibold">{ROLE_LABELS[user.role]}</p>
                    </div>
                    <Link to="/home" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 no-underline transition-colors">
                      <FiHome size={14} /> Hospital Home
                    </Link>
                    {showServices && (
                      <div className="md:hidden">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 pt-2 pb-1">Services</p>
                        {PATIENT_SERVICES.map(s => {
                          const Icon = s.icon
                          return (
                            <Link key={s.to} to={s.to} onClick={() => setDropOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 no-underline transition-colors">
                              <Icon size={14} className={s.color} />
                              {s.label}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                    <hr className="my-1 border-slate-700" />
                    <button onClick={() => { setDropOpen(false); handleLogout() }}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-white hover:bg-red-600 w-full text-left transition-colors rounded-b-2xl">
                      <FiLogOut size={14} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="border-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all no-underline">Login</Link>
            <Link to="/register" className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all shadow-md no-underline">Register</Link>
          </div>
        )}
      </div>
    </header>
  )
}
