import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MdLocalHospital } from 'react-icons/md'

export default function Sidebar({ links, isOpen, onClose, title = 'Dashboard' }) {
  const sidebarContent = (
    <div className="h-full flex flex-col bg-slate-900 border-r border-slate-700/50">
      {/* Header */}
      <div className="p-5 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shrink-0">
            <MdLocalHospital className="text-white text-lg" />
          </div>
          <div>
            <p className="text-sm font-display font-bold text-white leading-tight">MediCare HMS</p>
            <p className="text-[10px] text-red-400 font-semibold leading-tight">{title}</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto scrollbar-hide">
        {links.map((link) =>
          link.section ? (
            <p key={link.section}
              className="text-[10px] font-bold uppercase text-slate-500 tracking-widest px-3 pt-5 pb-1.5">
              {link.section}
            </p>
          ) : (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin' || link.to === '/manager' || link.to === '/doctor' || link.to === '/doctor-head' || link.to === '/lab' || link.to === '/patient'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
              }
              onClick={onClose}>
              <span className="text-lg shrink-0">{link.icon}</span>
              <span className="flex-1 truncate">{link.label}</span>
              {link.badge && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {link.badge}
                </span>
              )}
            </NavLink>
          )
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <p className="text-[10px] text-slate-500 text-center">DBH · Churu, Rajasthan</p>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden shadow-2xl">
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
