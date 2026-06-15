import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiUpload, FiCalendar, FiPlus, FiTrash2 } from 'react-icons/fi'
import { MdEvent } from 'react-icons/md'
import { eventAPI } from '../../services/api'

const MOCK_EVENTS = [
  { _id: '1', title: 'Free Health Camp', date: '2024-12-01', dept: 'General Medicine', image: null, desc: 'Free checkup for all residents of the district. Blood pressure, diabetes screening included.', uploadedBy: 'Manager' },
  { _id: '2', title: 'Blood Donation Drive', date: '2024-11-25', dept: 'All Departments', image: null, desc: 'Annual blood donation camp. All blood groups needed. Refreshments provided to donors.', uploadedBy: 'District Admin' },
  { _id: '3', title: "Children's Health Week", date: '2024-12-10', dept: 'Pediatrics', image: null, desc: 'Free pediatric consultations and vaccination drive for children aged 0-12.', uploadedBy: 'Manager' },
]

export default function EventsPage({ canUpload = false }) {
  const [events, setEvents] = useState(MOCK_EVENTS)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', date: '', dept: '', desc: '' })
  const [imageFile, setImageFile] = useState(null)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleUpload = async (e) => {
    e.preventDefault()
    const newEvent = { _id: Date.now().toString(), ...form, image: null, uploadedBy: 'You' }
    setEvents(p => [newEvent, ...p])
    setForm({ title: '', date: '', dept: '', desc: '' })
    setImageFile(null)
    setShowForm(false)
  }

  const handleDelete = (id) => setEvents(p => p.filter(e => e._id !== id))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="page-title flex items-center gap-2"><MdEvent className="text-primary-500" />Hospital Events</h2>
        {canUpload && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
            <FiPlus /> New Event
          </button>
        )}
      </div>

      {/* Upload Form */}
      {canUpload && showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card border-2 border-primary-200">
          <h3 className="section-title mb-4">Upload New Event</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="label">Event Title *</label><input required value={form.title} onChange={e => set('title', e.target.value)} className="input-field" placeholder="Event name..." /></div>
              <div><label className="label">Date *</label><input required type="date" value={form.date} onChange={e => set('date', e.target.value)} className="input-field" min={new Date().toISOString().split('T')[0]} /></div>
              <div><label className="label">Department</label><input value={form.dept} onChange={e => set('dept', e.target.value)} className="input-field" placeholder="e.g. All / Pediatrics" /></div>
              <div>
                <label className="label">Banner Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 text-center cursor-pointer hover:border-primary-400 transition-colors"
                  onClick={() => document.getElementById('eventImg').click()}>
                  <input id="eventImg" type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files[0])} />
                  <p className="text-xs text-gray-500">{imageFile ? imageFile.name : 'Click to upload image (optional)'}</p>
                </div>
              </div>
            </div>
            <div><label className="label">Description *</label><textarea required value={form.desc} onChange={e => set('desc', e.target.value)} rows={3} className="input-field resize-none" placeholder="Event details..." /></div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary"><FiUpload /> Upload Event</button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event, i) => (
          <motion.div key={event._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="card hover:shadow-hover transition-all">
            <div className="w-full h-32 bg-gradient-to-br from-primary-100 to-sky-light rounded-xl mb-3 flex items-center justify-center">
              {event.image ? <img src={event.image} className="w-full h-full object-cover rounded-xl" /> :
                <MdEvent className="text-primary-300 text-5xl" />}
            </div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display font-semibold text-gray-800">{event.title}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <FiCalendar className="text-primary-500" size={12} />
                  <span className="text-xs text-gray-500">{event.date}</span>
                  {event.dept && <span className="badge-blue ml-1">{event.dept}</span>}
                </div>
              </div>
              {canUpload && (
                <button onClick={() => handleDelete(event._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                  <FiTrash2 size={14} />
                </button>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">{event.desc}</p>
            <p className="text-[10px] text-gray-400 mt-2">Posted by: {event.uploadedBy}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
