import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { FiHome, FiUpload, FiFileText, FiDownload, FiCheckCircle } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import { reportAPI } from '../../services/api'
import { SkeletonStatCard, SkeletonTableRow } from '../../components/common/Skeleton'
import toast from 'react-hot-toast'
import { exportToExcel } from '../../utils/exportExcel'
import { DEMO_MODE, DEMO_ANALYTICS, DEMO_WEEK_DATA, DEMO_REPORT_HISTORY } from '../../utils/demo'

const SIDEBAR_LINKS = [
  { to: '/lab', icon: <FiHome />, label: 'Dashboard' },
  { to: '/lab/upload', icon: <FiUpload />, label: 'Upload Report' },
  { to: '/lab/analytics', icon: <FiFileText />, label: 'Report Analytics' },
]

export default function LabDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [file, setFile] = useState(null)
  const [parchi, setParchi] = useState('')
  const [reportType, setReportType] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadDone, setUploadDone] = useState(false)
  const [filterDays, setFilterDays] = useState('7')
  const [analytics, setAnalytics] = useState(null)
  const [history, setHistory] = useState([])
  const [statsLoading, setStatsLoading] = useState(true)
  const location = useLocation()
  const isBase = location.pathname === '/lab' || location.pathname === '/lab/'

  useEffect(() => {
    if (!isBase) return
    const load = async () => {
      try {
        const [analyticsRes, reportsRes] = await Promise.all([
          reportAPI.getAnalytics(),
          reportAPI.getAll(),
        ])
        setAnalytics(analyticsRes)
        const flat = (Array.isArray(reportsRes) ? reportsRes : []).flatMap(r =>
          r.files?.map(f => ({
            parchi: r.parchiNo,
            patient: r.patientName || '—',
            type: f.fileType || f.type || '—',
            date: f.uploadedAt ? new Date(f.uploadedAt).toLocaleString() : '—',
            size: f.size || '—',
            status: 'uploaded',
          })) || []
        )
        setHistory(flat)
      } catch {
        if (DEMO_MODE) {
          setAnalytics(DEMO_ANALYTICS)
          setHistory(DEMO_REPORT_HISTORY.flatMap(r => r.files.map(f => ({
            parchi: r.parchiNo, patient: r.patientName,
            type: f.fileType, date: new Date(f.uploadedAt).toLocaleString(),
            size: f.size, status: 'uploaded',
          }))))
        }
      } finally {
        setStatsLoading(false)
      }
    }
    load()
  }, [isBase])

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
                {statsLoading ? [...Array(4)].map((_, i) => <SkeletonStatCard key={i} />) : (<>
                  <div className="card text-center border-l-4 border-l-blue-500">
                    <p className="text-2xl font-bold text-blue-700">{analytics?.totalFiles ?? 0}</p>
                    <p className="text-sm text-gray-500 mt-1">Total Files</p>
                  </div>
                  <div className="card text-center border-l-4 border-l-teal-500">
                    <p className="text-2xl font-bold text-teal-700">{analytics?.totalParchi ?? 0}</p>
                    <p className="text-sm text-gray-500 mt-1">Total Parchi</p>
                  </div>
                  <div className="card text-center border-l-4 border-l-orange-500">
                    <p className="text-2xl font-bold text-orange-600">{history.length}</p>
                    <p className="text-sm text-gray-500 mt-1">Uploads</p>
                  </div>
                  <div className="card text-center border-l-4 border-l-green-500">
                    <p className="text-2xl font-bold text-green-600">{analytics?.totalDownloads ?? 0}</p>
                    <p className="text-sm text-gray-500 mt-1">Downloads</p>
                  </div>
                </>)}
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
                  {statsLoading ? (
                    <div className="h-[200px] bg-slate-100 animate-pulse rounded-xl" />
                  ) : (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={DEMO_WEEK_DATA} barSize={20}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="uploads" fill="#3b82f6" radius={4} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Upload History */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="section-title">Recent Uploads</h3>
                  {!statsLoading && history.length > 0 && (
                    <button onClick={() => exportToExcel(history, 'Lab_Upload_History')} className="btn-secondary text-xs py-1.5">
                      <FiDownload size={13} /> Export
                    </button>
                  )}
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
                      {statsLoading
                        ? [...Array(3)].map((_, i) => <SkeletonTableRow key={i} cols={6} />)
                        : history.length === 0
                          ? <tr><td colSpan={6} className="text-center text-gray-400 py-8 text-sm">No uploads yet</td></tr>
                          : history.slice(0, 10).map((r, i) => (
                            <tr key={i} className="table-row">
                              <td className="p-3 font-mono text-xs text-primary-600">{r.parchi}</td>
                              <td className="p-3 font-medium text-gray-800">{r.patient}</td>
                              <td className="p-3 text-center text-gray-600">{r.type}</td>
                              <td className="p-3 text-center text-xs text-gray-500">{r.date}</td>
                              <td className="p-3 text-center text-xs text-gray-500">{r.size}</td>
                              <td className="p-3 text-center"><span className="badge-green">✓ Uploaded</span></td>
                            </tr>
                          ))
                      }
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
