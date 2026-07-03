import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiCalendar, FiUser, FiPhone, FiCheckCircle } from 'react-icons/fi'
import { MdLocalHospital } from 'react-icons/md'
import Navbar from '../../components/common/Navbar'
import toast from 'react-hot-toast'
import { appointmentAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { DEMO_MODE } from '../../utils/demo'
import { useSearchParams } from 'react-router-dom'

const DEPARTMENTS = ['Orthopedics', 'Cardiology', 'Neurology', 'Pediatrics', 'Gynecology', 'General Medicine', 'ENT', 'Dermatology', 'Ophthalmology']
const TIME_SLOTS = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '04:00 PM']

export default function BookAppointment() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({
    patientName: user?.name || '',
    age: '', gender: '', phone: user?.phone || '',
    department: searchParams.get('department') || '',
    doctorName: searchParams.get('doctorName') || '',
    doctorId: searchParams.get('doctorId') || '',
    date: '', time: searchParams.get('time') || '', reason: '', urgent: false
  })
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [bookingId, setBookingId] = useState(null)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await appointmentAPI.book(form)
      setBookingId(res.appointmentId || res.data?._id || 'APT' + Date.now())
      setSubmitted(true)
    } catch (err) {
      if (DEMO_MODE) {
        setBookingId('APT-DEMO-' + Math.floor(Math.random() * 100000))
        setSubmitted(true)
      } else {
        toast.error(err?.message || 'Appointment booking failed. Please try again.')
      }
    }
    setLoading(false)
  }

  if (submitted) return (
    <div className="min-h-screen bg-hospital-bg">
      <Navbar showMenu={false} />
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="text-green-500 text-4xl" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-800 mb-2">Appointment Booked!</h2>
          <p className="text-gray-500 mb-6">Your appointment has been confirmed successfully.</p>
          <div className="card text-left space-y-3 mb-6">
            <div className="flex justify-between"><span className="text-sm text-gray-500">Booking ID</span><span className="text-sm font-bold text-primary-600">{bookingId}</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-500">Department</span><span className="text-sm font-semibold">{form.department}</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-500">Date</span><span className="text-sm font-semibold">{form.date}</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-500">Time</span><span className="text-sm font-semibold">{form.time}</span></div>
          </div>
          <p className="text-xs text-gray-400">Show this booking ID at the reception.</p>
        </motion.div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-hospital-bg">
      <Navbar showMenu={false} />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="page-title mb-1">Book Appointment</h1>
          <p className="text-gray-500 text-sm mb-6">Fill in the details to schedule your visit</p>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${step > s ? 'bg-green-500 text-white' : step === s ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {step > s ? '✓' : s}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step === s ? 'text-red-600' : 'text-gray-400'}`}>
                  {s === 1 ? 'Patient Info' : s === 2 ? 'Department' : 'Schedule'}
                </span>
                {s < 3 && <div className={`flex-1 h-1 rounded-full ${step > s ? 'bg-green-400' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          <div className="card">
            {/* Step 1 */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="section-title flex items-center gap-2"><FiUser />Patient Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="label">Full Name *</label><input value={form.patientName} onChange={e => set('patientName', e.target.value)} placeholder="Your name" className="input-field" /></div>
                  <div><label className="label">Age *</label><input type="number" value={form.age} onChange={e => set('age', e.target.value)} placeholder="Age" className="input-field" /></div>
                  <div>
                    <label className="label">Gender *</label>
                    <select value={form.gender} onChange={e => set('gender', e.target.value)} className="select-field">
                      <option value="">Select gender</option>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div><label className="label">Phone *</label><input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="Phone number" className="input-field" /></div>
                </div>
                <div><label className="label">Reason for Visit</label><textarea value={form.reason} onChange={e => set('reason', e.target.value)} rows={3} placeholder="Describe your symptoms..." className="input-field resize-none" /></div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.urgent} onChange={e => set('urgent', e.target.checked)} className="w-4 h-4 accent-red-500" />
                  <span className="text-sm text-red-600 font-medium">Mark as Urgent</span>
                </label>
                <div className="flex justify-end"><button onClick={() => setStep(2)} disabled={!form.patientName || !form.age || !form.gender} className="btn-primary">Next →</button></div>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="section-title flex items-center gap-2"><MdLocalHospital />Select Department</h3>
                <div className="grid grid-cols-2 gap-3">
                  {DEPARTMENTS.map(d => (
                    <button key={d} onClick={() => set('department', d)}
                      className={`p-4 rounded-xl border-2 text-sm font-medium transition-all text-left ${form.department === d ? 'border-red-600 bg-red-50 text-red-700' : 'border-slate-200 hover:border-blue-300 text-gray-600'}`}>
                      {d}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between pt-2">
                  <button onClick={() => setStep(1)} className="btn-secondary">← Back</button>
                  <button onClick={() => setStep(3)} disabled={!form.department} className="btn-primary">Next →</button>
                </div>
              </motion.div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="section-title flex items-center gap-2"><FiCalendar />Schedule</h3>
                <div>
                  <label className="label">Select Date *</label>
                  <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field" />
                </div>
                <div>
                  <label className="label">Select Time Slot *</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {TIME_SLOTS.map(t => (
                      <button key={t} onClick={() => set('time', t)}
                        className={`p-2 rounded-lg text-xs font-medium border transition-all ${form.time === t ? 'bg-red-600 text-white border-red-600' : 'bg-white border-slate-200 hover:border-blue-400 text-gray-600'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-sm space-y-1 border border-blue-100">
                  <p className="font-semibold text-blue-700 mb-2">Appointment Summary</p>
                  <p><span className="text-gray-500">Patient:</span> <strong>{form.patientName}</strong></p>
                  <p><span className="text-gray-500">Department:</span> <strong>{form.department}</strong></p>
                  {form.doctorName && <p><span className="text-gray-500">Doctor:</span> <strong>{form.doctorName}</strong></p>}
                  <p><span className="text-gray-500">Date:</span> <strong>{form.date}</strong></p>
                  <p><span className="text-gray-500">Time:</span> <strong>{form.time}</strong></p>
                  <p className="text-green-700 font-semibold mt-2">✓ Free OPD — No consultation fee</p>
                </div>
                <div className="flex justify-between pt-2">
                  <button onClick={() => setStep(2)} className="btn-secondary">← Back</button>
                  <button onClick={handleSubmit} disabled={!form.date || !form.time || loading}
                    className="btn-danger">
                    {loading ? 'Booking...' : '✓ Confirm Appointment'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
