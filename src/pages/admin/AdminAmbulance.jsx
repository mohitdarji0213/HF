import { motion } from 'framer-motion'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import ExportButtons from '../../components/common/ExportButtons'
import { SkeletonStatCard, SkeletonTable } from '../../components/common/Skeleton'

const DATA = [
  { id: 1, callId: 'AMB-001', patient: 'Suresh Yadav', district: 'Churu', date: '2024-11-15', status: 'completed' },
  { id: 2, callId: 'AMB-002', patient: 'Kamla Devi', district: 'Churu', date: '2024-11-15', status: 'completed' },
  { id: 3, callId: 'AMB-003', patient: 'Unknown', district: 'Churu', date: '2024-11-15', status: 'in-transit' },
  { id: 4, callId: 'AMB-004', patient: 'Gopal Singh', district: 'Sujangarh', date: '2024-11-14', status: 'completed' },
  { id: 5, callId: 'AMB-005', patient: 'Radha Bai', district: 'Rajgarh', date: '2024-11-14', status: 'completed' },
  { id: 6, callId: 'AMB-006', patient: 'Amar Singh', district: 'Bidasar', date: '2024-11-13', status: 'completed' },
]

const monthData = [
  { month: 'Jun', calls: 45 }, { month: 'Jul', calls: 62 }, { month: 'Aug', calls: 51 },
  { month: 'Sep', calls: 70 }, { month: 'Oct', calls: 83 }, { month: 'Nov', calls: 76 },
]

const STATUS = { completed: 'badge-green', 'in-transit': 'badge-orange', cancelled: 'badge-red' }

export default function AdminAmbulance() {
  const [loading, setLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1000); return () => clearTimeout(t) }, [])
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-display font-bold text-gray-800">Ambulance — District View</h2>
        <ExportButtons data={DATA} filename="Ambulance" title="Ambulance Statistics Report" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Calls', value: DATA.length, color: 'text-blue-700', border: 'border-l-blue-500' },
          { label: 'Completed', value: DATA.filter(d => d.status === 'completed').length, color: 'text-green-600', border: 'border-l-green-500' },
          { label: 'In Transit', value: DATA.filter(d => d.status === 'in-transit').length, color: 'text-orange-500', border: 'border-l-orange-500' },
          { label: 'This Month', value: 76, color: 'text-red-600', border: 'border-l-red-500' },
        ].map(s => (
          <div key={s.label} className={`card text-center border-l-4 ${s.border}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 className="section-title mb-4">Monthly Ambulance Calls</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={monthData} barSize={22}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="calls" fill="#e11d48" radius={4} name="Calls" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3 className="section-title mb-4">Dispatch Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="table-header">
              <th className="text-left p-3">Call ID</th>
              <th className="p-3">Patient</th>
              <th className="p-3">District</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr></thead>
            <tbody>{loading ? <SkeletonTable rows={5} cols={5} /> : DATA.map(r => (
                <tr key={r.id} className="table-row">
                  <td className="p-3 font-mono text-xs text-primary-600 font-bold">{r.callId}</td>
                  <td className="p-3 font-medium text-gray-800">{r.patient}</td>
                  <td className="p-3 text-center text-gray-600">{r.district}</td>
                  <td className="p-3 text-center text-gray-600">{r.date}</td>
                  <td className="p-3 text-center"><span className={STATUS[r.status]}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
