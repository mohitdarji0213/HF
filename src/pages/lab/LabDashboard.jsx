import { useState } from 'react'
import { motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { FiHome, FiUpload, FiFileText, FiCalendar, FiFilter, FiDownload, FiCheckCircle } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import StatCard from '../../components/common/StatCard'
import { reportAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { exportToExcel } from '../../utils/exportExcel'

const SIDEBAR_LINKS = [
  { to: '/lab', icon: <FiHome />, label: 'Dashboard' },
  { to: '/lab/upload', icon: <FiUpload />, label: 'Upload Report' },
  { to: '/lab/analytics', icon: <FiFileText />, label: 'Report Analytics' },
]

const UPLOAD_HISTORY = [
  { parchi: 'P2024-001234', patient: 'Ramesh Kumar', type: 'X-Ray', date: '2024-11-15 10:30', size: '2.4 MB', status: 'uploaded' },
  { parchi: 'P2024-001235', patient: 'Meena Sharma', type: 'Blood Test', date: '2024-11-15 11:15', size: '1.1 MB', status: 'uploaded' },
  { parchi: 'P2024-001236', patient: 'Asha Devi', type: 'MRI Scan', date: '2024-11-14 03:00', size: '8.6 MB', status: 'uploaded' },
]

const dailyData = [
  { day: 'Mon', uploads: 12 }, { day: 'Tue', uploads: 18 },
  { day: 'Wed', uploads: 25 }, { day: 'Thu', uploads: 15 },
  { day: 'Fri', uploads: 22 }, { day: 'Sat', uploads: 8 },
]

export default function LabDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [file, setFile] = useState(null)
  const [parchi, setParchi] = useState('')
  const [reportType, setReportType] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadDone, setUploadDone] = useState(false)
  const [filterDays, setFilterDays] = useState('7')
  const location = useLocation()
  const isBase = location.pathname === '/lab' || location.pathname === '/lab/'

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !parchi) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('parchiNo', parchi)
    formData.append('reportType', reportType)
    try {
      await reportAPI.upload(formData)
      setUploadDone(true)
      setFile(null); setParchi(''); setReportType('')
      setTimeout(() => setUploadDone(false), 3000)
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Upload failed, try again')
    }
    setUploading(false)
  }

  return (
    <div className="min-h-screen bg-hospital-bg">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex max-w-screen-2xl mx-auto">
        <Sidebar links={SIDEBAR_LINKS} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} title="Lab Assistant" />
        <main className="flex-1 min-w-0 p-5">
          {isBase ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="bg-gradient-to-r from-slate-800 to-blue-900 rounded-2xl p-6 mb-2 text-white">
                <h1 className="text-2xl font-display font-bold text-white">Lab Assistant Dashboard</h1>
                <p className="text-blue-200 text-sm mt-1">Upload and manage patient reports</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<FiUpload />} label="Today's Uploads" value="23" color="blue" />
                <StatCard icon={<FiFileText />} label="This Month" value="342" color="teal" />
                <StatCard icon="📊" label="Pending" value="4" color="orange" />
                <StatCard icon="📥" label="Total Downloaded" value="2,180" color="blue" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Upload Form */}
                <div className="card">
                  <h3 className="section-title mb-4 flex items-center gap-2"><FiUpload className="text-primary-500" />Upload Report</h3>
                  {uploadDone ? (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      className="text-center py-8">
                      <FiCheckCircle className="text-green-500 text-4xl mx-auto mb-2" />
                      <p className="font-semibold text-gray-800">Report Uploaded!</p>
                      <p className="text-sm text-gray-500 mt-1">Patient can now download their report.</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleUpload} className="space-y-4">
                      <div>
                        <label className="label">Parchi Number *</label>
                        <input value={parchi} onChange={e => setParchi(e.target.value)} required placeholder="e.g. P2024-001234" className="input-field font-mono" />
                      </div>
                      <div>
                        <label className="label">Report Type</label>
                        <select value={reportType} onChange={e => setReportType(e.target.value)} className="select-field">
                          <option value="">Select type</option>
                          {['Blood Test', 'X-Ray', 'MRI Scan', 'CT Scan', 'Ultrasound', 'ECG', 'Other'].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="label">Upload File * (PDF / Image)</label>
                        <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${file ? 'border-green-400 bg-green-50' : 'border-blue-400 hover:border-red-400 hover:bg-red-50'}`}
                          onClick={() => document.getElementById('fileInput').click()}>
                          <input id="fileInput" type="file" accept=".pdf,image/*" className="hidden" onChange={e => setFile(e.target.files[0])} />
                          {file ? (
                            <div>
                              <FiCheckCircle className="text-green-500 text-2xl mx-auto mb-1" />
                              <p className="text-sm font-semibold text-green-700">{file.name}</p>
                              <p className="text-xs text-green-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          ) : (
                            <div>
                              <FiUpload className="text-gray-400 text-2xl mx-auto mb-2" />
                              <p className="text-sm text-gray-600 font-medium">Click to upload PDF or Image</p>
                              <p className="text-xs text-gray-400 mt-1">Max 20MB</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <button type="submit" disabled={!file || !parchi || uploading} className="w-full btn-primary justify-center py-3">
                        <FiUpload /> {uploading ? 'Uploading...' : 'Upload Report'}
                      </button>
                    </form>
                  )}
                </div>

                {/* Chart */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="section-title">Upload Activity</h3>
                    <select value={filterDays} onChange={e => setFilterDays(e.target.value)} className="select-field w-auto text-xs py-1.5">
                      <option value="7">Last 7 days</option>
                      <option value="30">Last 30 days</option>
                    </select>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={dailyData} barSize={20}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="uploads" fill="#3b82f6" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Upload History */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="section-title">Recent Uploads</h3>
                  <button onClick={() => exportToExcel(UPLOAD_HISTORY, 'Lab_Upload_History')} className="btn-secondary text-xs py-1.5">
                    <FiDownload size={13} /> Export
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="table-header">
                      <th className="text-left p-3">Parchi No</th>
                      <th className="p-3">Patient</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Uploaded</th>
                      <th className="p-3">Size</th>
                      <th className="p-3">Status</th>
                    </tr></thead>
                    <tbody>
                      {UPLOAD_HISTORY.map((r, i) => (
                        <tr key={i} className="table-row">
                          <td className="p-3 font-mono text-xs text-primary-600">{r.parchi}</td>
                          <td className="p-3 font-medium text-gray-800">{r.patient}</td>
                          <td className="p-3 text-center text-gray-600">{r.type}</td>
                          <td className="p-3 text-center text-xs text-gray-500">{r.date}</td>
                          <td className="p-3 text-center text-xs text-gray-500">{r.size}</td>
                          <td className="p-3 text-center"><span className="badge-green">✓ Uploaded</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : <Outlet />}
        </main>
      </div>
    </div>
  )
}
