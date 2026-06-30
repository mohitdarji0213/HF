import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiAlertTriangle, FiSend, FiCheckCircle } from 'react-icons/fi'
import Navbar from '../../components/common/Navbar'
import { sendIssueEmail } from '../../services/emailService'
import { issueAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { DEMO_MODE } from '../../utils/demo'

const ISSUE_TYPES = ['Medical Concern', 'Staff Behavior', 'Facility Issue', 'Wrong Diagnosis', 'Billing Issue', 'Waiting Time', 'Hygiene', 'Other']

export default function SubmitIssue() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    recipientRole: 'hospital_manager',
    department: '',
    issueType: '',
    description: '',
    urgency: 'medium',
    anonymous: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await issueAPI.submit(form)
      sendIssueEmail({
        senderName: form.anonymous ? 'Anonymous Patient' : user?.name || 'Patient',
        senderEmail: user?.email || 'noreply@hospital.com',
        ...form,
      }).catch(() => {})
      setSubmitted(true)
    } catch (err) {
      if (DEMO_MODE) {
        setSubmitted(true)
      } else {
        toast.error(err?.message || 'Issue submission failed. Please try again.')
      }
    }
    setLoading(false)
  }

  if (submitted) return (
    <div className="min-h-screen bg-hospital-bg">
      <Navbar showMenu={false} />
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="text-green-500 text-4xl" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-800 mb-2">Issue Submitted!</h2>
          <p className="text-gray-500 mb-4">Your issue has been forwarded to the concerned authority. We will get back to you within 24-48 hours.</p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            For urgent issues, please contact the hospital reception directly.
          </div>
        </motion.div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-hospital-bg">
      <Navbar showMenu={false} />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <FiAlertTriangle className="text-red-500 text-xl" />
            </div>
            <div>
              <h1 className="page-title">Submit an Issue</h1>
              <p className="text-gray-500 text-sm">Report concerns to hospital management</p>
            </div>
          </div>

          <div className="card mt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Send to */}
              <div>
                <label className="label">Send Issue To *</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'hospital_manager', label: '🏥 Hospital Manager', desc: 'General & admin issues' },
                    { value: 'doctor_head', label: '👨‍⚕️ Department Head', desc: 'Medical concerns' },
                  ].map(opt => (
                    <button type="button" key={opt.value} onClick={() => set('recipientRole', opt.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${form.recipientRole === opt.value ? 'border-blue-700 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
                      <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Issue Type *</label>
                  <select required value={form.issueType} onChange={e => set('issueType', e.target.value)} className="select-field">
                    <option value="">Select issue type</option>
                    {ISSUE_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Department (if applicable)</label>
                  <input value={form.department} onChange={e => set('department', e.target.value)} placeholder="e.g. Orthopedics" className="input-field" />
                </div>
              </div>

              <div>
                <label className="label">Urgency Level</label>
                <div className="flex gap-2">
                  {[['low','🟢 Low'],['medium','🟡 Medium'],['high','🔴 High']].map(([v,l]) => (
                    <button type="button" key={v} onClick={() => set('urgency', v)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium border-2 transition-all ${form.urgency === v ? (v === 'high' ? 'border-red-500 bg-red-50 text-red-700' : v === 'medium' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-green-500 bg-green-50 text-green-700') : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Describe the Issue *</label>
                <textarea required value={form.description} onChange={e => set('description', e.target.value)} rows={5} className="input-field resize-none" placeholder="Please provide a detailed description of the issue, including date, time, and any other relevant details..." />
                <p className="text-xs text-gray-400 mt-1">{form.description.length}/500 characters</p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.anonymous} onChange={e => set('anonymous', e.target.checked)} className="w-4 h-4 accent-gray-500" />
                <span className="text-sm text-gray-600">Submit anonymously (your identity will not be shared)</span>
              </label>

              <button type="submit" disabled={loading || !form.issueType || !form.description}
                className="w-full btn-danger py-3 justify-center text-base">
                <FiSend /> {loading ? 'Submitting...' : 'Submit Issue'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
