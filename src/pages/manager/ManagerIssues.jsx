import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiAlertTriangle } from 'react-icons/fi'
import ExportButtons from '../../components/common/ExportButtons'
import { SkeletonStatCard, SkeletonTable } from '../../components/common/Skeleton'

const ISSUES = [
  { id: 1, from: 'Patient', dept: 'Orthopedics', type: 'Waiting Time', urgency: 'high', status: 'open', date: '2024-11-14', desc: 'Patient waited over 2 hours for consultation.' },
  { id: 2, from: 'Patient', dept: 'Cardiology', type: 'Staff Behavior', urgency: 'medium', status: 'in-progress', date: '2024-11-13', desc: 'Staff was rude during registration process.' },
  { id: 3, from: 'Doctor Head', dept: 'Pediatrics', type: 'Facility Issue', urgency: 'medium', status: 'open', date: '2024-11-12', desc: 'Air conditioning not working in ward.' },
  { id: 4, from: 'Patient', dept: 'ENT', type: 'Report Delay', urgency: 'low', status: 'resolved', date: '2024-11-11', desc: 'Report not available for 3 days.' },
  { id: 5, from: 'Doctor', dept: 'Neurology', type: 'Equipment Issue', urgency: 'high', status: 'in-progress', date: '2024-11-10', desc: 'MRI machine calibration required urgently.' },
]

const URGENCY = { high: 'badge-red', medium: 'badge-orange', low: 'badge-green' }
const STATUS = { open: 'badge-red', 'in-progress': 'badge-orange', resolved: 'badge-green' }
const NEXT = { open: 'in-progress', 'in-progress': 'resolved', resolved: 'resolved' }

export default function ManagerIssues() {
  const [loading, setLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1000); return () => clearTimeout(t) }, [])
  const [issues, setIssues] = useState(ISSUES)

  const updateStatus = (id) => {
    setIssues(prev => prev.map(i => i.id === id ? { ...i, status: NEXT[i.status] } : i))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-display font-bold text-gray-800">Issues</h2>
        <ExportButtons data={issues} filename="Issues" title="Issues Report" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: issues.length, color: 'text-blue-700', border: 'border-l-blue-500' },
          { label: 'Open', value: issues.filter(i => i.status === 'open').length, color: 'text-red-600', border: 'border-l-red-500' },
          { label: 'In Progress', value: issues.filter(i => i.status === 'in-progress').length, color: 'text-orange-500', border: 'border-l-orange-500' },
          { label: 'Resolved', value: issues.filter(i => i.status === 'resolved').length, color: 'text-green-600', border: 'border-l-green-500' },
        ].map(s => (
          <div key={s.label} className={`card text-center border-l-4 ${s.border}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : issues.map(issue => (
          <div key={issue.id} className={`card ${issue.urgency === 'high' ? 'border-l-4 border-l-red-500' : issue.urgency === 'medium' ? 'border-l-4 border-l-orange-400' : ''}`}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0 mt-0.5">
                  <FiAlertTriangle size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-800 text-sm">{issue.type}</p>
                    <span className={URGENCY[issue.urgency]}>{issue.urgency}</span>
                    <span className={STATUS[issue.status]}>{issue.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{issue.dept} · From: {issue.from} · {issue.date}</p>
                  <p className="text-sm text-gray-600 mt-1">{issue.desc}</p>
                </div>
              </div>
              {issue.status !== 'resolved' && (
                <button onClick={() => updateStatus(issue.id)} className="btn-secondary text-xs py-1.5 shrink-0">
                  {issue.status === 'open' ? 'Mark In Progress' : 'Mark Resolved'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
