import { motion } from 'framer-motion'

const GRADIENTS = {
  blue:   'from-blue-600 to-blue-800',
  red:    'from-red-500 to-red-700',
  green:  'from-emerald-500 to-emerald-700',
  orange: 'from-orange-500 to-orange-700',
  teal:   'from-teal-500 to-teal-700',
  purple: 'from-purple-600 to-purple-800',
  pink:   'from-pink-500 to-pink-700',
  indigo: 'from-indigo-600 to-indigo-800',
}

export default function StatCard({ icon, label, value, sub, color = 'blue', trend }) {
  const grad = GRADIENTS[color] || GRADIENTS.blue

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`bg-gradient-to-br ${grad} rounded-2xl shadow-lg p-5 text-white relative overflow-hidden`}>
      {/* Decorative circle */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full" />
      <div className="absolute -bottom-6 -left-3 w-20 h-20 bg-white/5 rounded-full" />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center text-2xl shadow-inner">
            {icon}
          </div>
          {trend !== undefined && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trend >= 0 ? 'bg-white/20 text-white' : 'bg-red-900/40 text-red-200'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        <p className="text-3xl font-display font-black tracking-tight leading-none mb-1">{value}</p>
        <p className="text-sm font-medium text-white/75">{label}</p>
        {sub && <p className="text-xs text-white/50 mt-0.5 truncate">{sub}</p>}
      </div>
    </motion.div>
  )
}
