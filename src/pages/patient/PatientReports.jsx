import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiDownload, FiFileText, FiClock, FiUser, FiEye } from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import Navbar from '../../components/common/Navbar'
import { reportAPI } from '../../services/api'

const MOCK_REPORT = {
  parchiNo: 'P2024-001234',
  patientName: 'Ramesh Kumar',
  age: 45, gender: 'Male',
  doctorName: 'Dr. Rajesh Sharma',
  department: 'Orthopedics',
  date: '2024-11-15',
  diagnosis: 'Knee Ligament Tear - Grade II',
  reports: [
    { id: 'r1', name: 'X-Ray Report', type: 'pdf', uploadedAt: '2024-11-15 10:30 AM', size: '2.4 MB', uploadedBy: 'Lab Assistant' },
    { id: 'r2', name: 'MRI Scan', type: 'pdf', uploadedAt: '2024-11-15 02:15 PM', size: '8.1 MB', uploadedBy: 'Lab Assistant' },
    { id: 'r3', name: 'Blood Test Report', type: 'pdf', uploadedAt: '2024-11-15 11:00 AM', size: '1.2 MB', uploadedBy: 'Lab Assistant' },
  ]
}

export default function PatientReports() {
  const [parchiNo, setParchiNo] = useState('')
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!parchiNo.trim()) return
    setLoading(true); setError(''); setReport(null)
    try {
      const res = await reportAPI.getByParchi(parchiNo.trim())
      setReport(res)
    } catch {
      // demo mock
      if (parchiNo.toUpperCase().includes('P')) {
        setReport(MOCK_REPORT)
      } else {
        setError('No report found for this Parchi number. Please check and try again.')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-hospital-bg">
      <Navbar showMenu={false} />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="page-title mb-1">My Reports</h1>
          <p className="text-gray-500 text-sm mb-6">Enter your Parchi (Prescription) number to access your reports</p>

          {/* Search */}
          <div className="card border border-slate-200 mb-6">
            <label className="label text-base font-semibold text-gray-800 mb-3 block">Enter Parchi Number</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <FiFileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500" />
                <input value={parchiNo} onChange={e => setParchiNo(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="e.g. P2024-001234"
                  className="input-field pl-10 font-mono tracking-wide border-slate-300 focus:border-blue-500" />
              </div>
              <button onClick={handleSearch} disabled={loading || !parchiNo}
                className="btn-primary px-6">
                <FiSearch /> {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Your Parchi number is printed on your prescription slip</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-4">
              {error}
            </motion.div>
          )}

          {/* Report Results */}
          <AnimatePresence>
            {report && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Patient Info */}
                <div className="card">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">
                        {report.patientName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-display font-bold text-gray-800">{report.patientName}</h3>
                          <MdVerified className="text-green-500" />
                        </div>
                        <p className="text-sm text-gray-500">{report.age} yrs · {report.gender}</p>
                      </div>
                    </div>
                    <span className="badge-blue text-xs">{report.parchiNo}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-500">Doctor</span><p className="font-semibold text-gray-800">{report.doctorName}</p></div>
                    <div><span className="text-gray-500">Department</span><p className="font-semibold text-gray-800">{report.department}</p></div>
                    <div><span className="text-gray-500">Date</span><p className="font-semibold text-gray-800">{report.date}</p></div>
                    <div><span className="text-gray-500">Diagnosis</span><p className="font-semibold text-gray-800">{report.diagnosis}</p></div>
                  </div>
                </div>

                {/* Report Files */}
                <div className="card">
                  <h3 className="section-title mb-4 flex items-center gap-2">
                    <FiFileText className="text-primary-500" /> Available Reports ({report.reports?.length})
                  </h3>
                  <div className="space-y-3">
                    {report.reports?.map((r) => (
                      <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-primary-50 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 font-bold text-xs">
                            {r.type.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{r.name}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-2">
                              <FiClock size={10} /> {r.uploadedAt} · {r.size}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-100 rounded-lg transition-colors">
                            <FiEye size={15} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <FiDownload size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
