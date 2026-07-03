import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiFileText } from 'react-icons/fi'
import { SkeletonStatCard, SkeletonTable } from '../../components/common/Skeleton'
import { reportAPI } from '../../services/api'

export default function DoctorHeadReports() {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState(null)
  const [reports, setReports] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    Promise.all([reportAPI.getAnalytics(), reportAPI.getAll()])
      .then(([analyticsRes, reportsRes]) => {
        setAnalytics(analyticsRes)
        setReports(Array.isArray(reportsRes) ? reportsRes : [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const tableData = reports.flatMap(r =>
    r.files?.map(f => ({
      _id: f._id || r._id,
      patient: r.patientName || '—',
      type: f.fileType || f.type || '—',
      date: f.uploadedAt ? new Date(f.uploadedAt).toLocaleDateString() : new Date(r.createdAt).toLocaleDateString(),
      parchi: r.parchiNo,
      url: f.url,
    })) || []
  )

  const filtered = tableData.filter(r =>
    r.patient.toLowerCase().includes(search.toLowerCase()) ||
    r.type.toLowerCase().includes(search.toLowerCase()) ||
    (r.parchi || '').includes(search)
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-display font-bold text-gray-800">Patient Reports</h2>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reports..." className="input-field pl-9 py-2 text-sm w-56" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {loading ? [...Array(3)].map((_, i) => <SkeletonStatCard key={i} />) : (<>
          <div className="card text-center border-l-4 border-l-blue-500">
            <p className="text-2xl font-bold text-blue-700">{analytics?.totalFiles ?? tableData.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total Reports</p>
          </div>
          <div className="card text-center border-l-4 border-l-green-500">
            <p className="text-2xl font-bold text-green-600">{analytics?.totalDownloads ?? '—'}</p>
            <p className="text-sm text-gray-500 mt-1">Downloaded</p>
          </div>
          <div className="card text-center border-l-4 border-l-teal-500">
            <p className="text-2xl font-bold text-teal-600">{analytics?.totalParchi ?? reports.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total Parchi</p>
          </div>
        </>)}
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          {loading ? <SkeletonTable rows={5} cols={5} /> : filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">No reports found</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header">
                  <th className="text-left p-3">Patient</th>
                  <th className="p-3">Parchi No.</th>
                  <th className="p-3">Report Type</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">View</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={i} className="table-row">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                          <FiFileText size={13} />
                        </div>
                        <p className="font-medium text-gray-800">{r.patient}</p>
                      </div>
                    </td>
                    <td className="p-3 text-center font-mono text-xs text-primary-600">{r.parchi}</td>
                    <td className="p-3 text-center">
                      <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-lg">{r.type}</span>
                    </td>
                    <td className="p-3 text-center text-gray-600">{r.date}</td>
                    <td className="p-3 text-center">
                      {r.url ? (
                        <button onClick={() => window.open(r.url, '_blank')} className="badge-green text-xs cursor-pointer">
                          View
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </motion.div>
  )
}
