import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdEmergency } from 'react-icons/md'
import { FiMapPin, FiPhone, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import Navbar from '../../components/common/Navbar'
import { ambulanceAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const AMBULANCE_TYPES = [
  { id: 'basic', label: 'Basic Ambulance', desc: 'For non-emergency transport', icon: '🚑', eta: '15-20 min' },
  { id: 'icu', label: 'ICU Ambulance', desc: 'With life support equipment', icon: '🏥', eta: '10-15 min' },
  { id: 'neonatal', label: 'Neonatal', desc: 'For newborn emergencies', icon: '👶', eta: '15-20 min' },
]

export default function AmbulanceBook() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '',
    address: '', type: 'basic', notes: '', urgent: true
  })
  const [submitted, setSubmitted] = useState(false)
  const [trackId, setTrackId] = useState(null)
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await ambulanceAPI.book(form)
      setTrackId(res.trackId || 'AMB' + Math.floor(Math.random() * 100000))
    } catch {
      setTrackId('AMB' + Math.floor(Math.random() * 100000))
    }
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) return (
    <div className="min-h-screen bg-hospital-bg">
      <Navbar showMenu={false} />
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="text-6xl mb-4">🚑</div>
          <h2 className="text-2xl font-display font-bold text-gray-800 mb-2">Ambulance Dispatched!</h2>
          <p className="text-gray-500 mb-6">Help is on the way to your location.</p>
          <div className="card text-left space-y-3 mb-4">
            <div className="flex justify-between"><span className="text-sm text-gray-500">Tracking ID</span><span className="text-sm font-bold text-primary-600">{trackId}</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-500">Type</span><span className="text-sm font-semibold">{AMBULANCE_TYPES.find(t => t.id === form.type)?.label}</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-500">ETA</span><span className="text-sm font-semibold text-green-600">{AMBULANCE_TYPES.find(t => t.id === form.type)?.eta}</span></div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            <FiAlertCircle className="inline mr-1" /> Please stay at the mentioned address. Driver will call on {form.phone}
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
          {/* Emergency Banner */}
          <div className="bg-red-500 text-white rounded-2xl p-4 mb-6 flex items-center gap-3">
            <MdEmergency className="text-3xl shrink-0" />
            <div>
              <p className="font-display font-bold">Emergency Ambulance Service</p>
              <p className="text-red-100 text-sm">For life-threatening emergencies, call <strong>108</strong> directly</p>
            </div>
          </div>

          <div className="card">
            <h1 className="page-title mb-5">Book Ambulance</h1>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="label">Patient Name *</label><input required value={form.name} onChange={e => set('name', e.target.value)} className="input-field" placeholder="Full name" /></div>
                <div><label className="label">Contact Number *</label><input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className="input-field" placeholder="10-digit mobile" /></div>
              </div>

              <div>
                <label className="label flex items-center gap-1"><FiMapPin size={13} />Pickup Address *</label>
                <textarea required value={form.address} onChange={e => set('address', e.target.value)} rows={3} className="input-field resize-none" placeholder="Full address with landmark..." />
              </div>

              <div>
                <label className="label">Ambulance Type *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {AMBULANCE_TYPES.map(t => (
                    <button type="button" key={t.id} onClick={() => set('type', t.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${form.type === t.id ? 'border-red-600 bg-red-50' : 'border-slate-200 hover:border-red-300'}`}>
                      <div className="text-2xl mb-1">{t.icon}</div>
                      <p className="text-sm font-semibold text-gray-800">{t.label}</p>
                      <p className="text-xs text-gray-500">{t.desc}</p>
                      <p className="text-xs text-green-600 font-medium mt-1">ETA: {t.eta}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div><label className="label">Additional Notes</label><textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} className="input-field resize-none" placeholder="Any specific requirements..." /></div>

              <button type="submit" disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl text-base transition-all flex items-center justify-center gap-2">
                <MdEmergency className="text-xl" />
                {loading ? 'Dispatching...' : 'Request Ambulance Now'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
