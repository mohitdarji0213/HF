import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import ExportButtons from '../../components/common/ExportButtons'
import { SkeletonStatCard, SkeletonTable } from '../../components/common/Skeleton'

const DOCTORS = [
  { id: 1, name: 'Dr. Rajendra Kumar Sharma', dept: 'General Medicine', rating: 4.9, reviews: 312, patients: 8400, available: true, isHead: true },
  { id: 2, name: 'Dr. Vikram Singh', dept: 'Cardiology', rating: 4.8, reviews: 176, patients: 4900, available: true, isHead: true },
  { id: 3, name: 'Dr. Suresh Agarwal', dept: 'Orthopedics', rating: 4.7, reviews: 198, patients: 5800, available: true, isHead: true },
  { id: 4, name: 'Dr. Anita Joshi', dept: 'Pediatrics', rating: 4.9, reviews: 280, patients: 7100, available: true, isHead: false },
  { id: 5, name: 'Dr. Priya Mehta', dept: 'Gynecology', rating: 4.8, reviews: 245, patients: 6200, available: true, isHead: false },
  { id: 6, name: 'Dr. Meena Gupta', dept: 'Neurology', rating: 4.7, reviews: 142, patients: 3600, available: false, isHead: false },
  { id: 7, name: 'Dr. Ramesh Bohra', dept: 'ENT', rating: 4.6, reviews: 118, patients: 3100, available: true, isHead: false },
]

const ratingData = DOCTORS.map(d => ({ name: d.name.split(' ')[2] || d.name.split(' ')[1], rating: d.rating }))

export default function AdminDoctors() {
  const [loading, setLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1000); return () => clearTimeout(t) }, [])
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-display font-bold text-gray-800">Doctor Ratings — District</h2>
        <ExportButtons data={DOCTORS} filename="Doctor_Ratings" title="Doctor Ratings Report" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Doctors', value: DOCTORS.length, color: 'text-blue-700', border: 'border-l-blue-500' },
          { label: 'Active Today', value: DOCTORS.filter(d => d.available).length, color: 'text-green-600', border: 'border-l-green-500' },
          { label: 'Avg Rating', value: (DOCTORS.reduce((s, d) => s + d.rating, 0) / DOCTORS.length).toFixed(1), color: 'text-amber-600', border: 'border-l-amber-500' },
          { label: 'Total Reviews', value: DOCTORS.reduce((s, d) => s + d.reviews, 0), color: 'text-blue-600', border: 'border-l-blue-400' },
        ].map(s => (
          <div key={s.label} className={`card text-center border-l-4 ${s.border}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 className="section-title mb-4">Doctor Rating Comparison</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={ratingData} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis domain={[4, 5]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="rating" fill="#3b82f6" radius={4} name="Rating" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3 className="section-title mb-4">All Doctors</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="table-header">
              <th className="text-left p-3">Doctor</th>
              <th className="p-3">Department</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Reviews</th>
              <th className="p-3">Patients</th>
              <th className="p-3">Status</th>
            </tr></thead>
            <tbody>
              {loading ? <SkeletonTable rows={5} cols={6} /> : DOCTORS.map(d => (
                <tr key={d.id} className="table-row">
                  <td className="p-3">
                    <p className="font-medium text-gray-800">{d.name}</p>
                    {d.isHead && <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded-full font-semibold">Dept Head</span>}
                  </td>
                  <td className="p-3 text-center text-gray-600">{d.dept}</td>
                  <td className="p-3 text-center">
                    <span className="flex items-center justify-center gap-1">
                      <FiStar className="text-amber-500 fill-amber-400" size={11} />
                      <span className="font-bold text-gray-800">{d.rating}</span>
                    </span>
                  </td>
                  <td className="p-3 text-center text-gray-600">{d.reviews}</td>
                  <td className="p-3 text-center text-gray-700 font-medium">{d.patients.toLocaleString()}+</td>
                  <td className="p-3 text-center"><span className={d.available ? 'badge-green' : 'badge-red'}>{d.available ? 'Active' : 'Leave'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
