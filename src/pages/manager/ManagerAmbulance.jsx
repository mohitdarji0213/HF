import { motion } from "framer-motion";
import { MdEmergency } from "react-icons/md";
import ExportButtons from "../../components/common/ExportButtons";
import {
  SkeletonStatCard,
  SkeletonTable,
} from "../../components/common/Skeleton";
import { useState, useEffect } from "react";

const DATA = [
  {
    id: 1,
    callId: "AMB-001",
    patient: "Suresh Yadav",
    pickup: "Churu Bus Stand",
    destination: "DBH Hospital",
    date: "2024-11-15",
    time: "08:10 AM",
    status: "completed",
    driver: "Ramji Lal",
  },
  {
    id: 2,
    callId: "AMB-002",
    patient: "Kamla Devi",
    pickup: "Rajgarh Road",
    destination: "DBH Hospital",
    date: "2024-11-15",
    time: "10:45 AM",
    status: "completed",
    driver: "Shyam Sunder",
  },
  {
    id: 3,
    callId: "AMB-003",
    patient: "Unknown",
    pickup: "NH-65 Highway",
    destination: "DBH Hospital",
    date: "2024-11-15",
    time: "01:20 PM",
    status: "in-transit",
    driver: "Ramji Lal",
  },
  {
    id: 4,
    callId: "AMB-004",
    patient: "Gopal Singh",
    pickup: "Taranagar",
    destination: "DBH Hospital",
    date: "2024-11-14",
    time: "09:00 AM",
    status: "completed",
    driver: "Mohan Das",
  },
  {
    id: 5,
    callId: "AMB-005",
    patient: "Radha Bai",
    pickup: "Bidasar",
    destination: "DBH Hospital",
    date: "2024-11-14",
    time: "03:15 PM",
    status: "completed",
    driver: "Shyam Sunder",
  },
];

const STATUS = {
  completed: "badge-green",
  "in-transit": "badge-orange",
  cancelled: "badge-red",
};

export default function ManagerAmbulance() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-display font-bold text-gray-800">
          Ambulance Stats
        </h2>
        <ExportButtons
          data={DATA}
          filename="Ambulance_Stats"
          title="Ambulance Statistics Report"
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Calls",
            value: DATA.length,
            color: "text-blue-700",
            border: "border-l-blue-500",
          },
          {
            label: "Completed",
            value: DATA.filter((d) => d.status === "completed").length,
            color: "text-green-600",
            border: "border-l-green-500",
          },
          {
            label: "In Transit",
            value: DATA.filter((d) => d.status === "in-transit").length,
            color: "text-orange-500",
            border: "border-l-orange-500",
          },
          {
            label: "Today",
            value: DATA.filter((d) => d.date === "2024-11-15").length,
            color: "text-red-600",
            border: "border-l-red-500",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`card text-center border-l-4 ${s.border}`}
          >
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <MdEmergency className="text-red-500" size={18} />
          <h3 className="section-title border-l-4 border-l-red-500 pl-3">
            Ambulance Dispatch Log
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="text-left p-3">Call ID</th>
                <th className="p-3">Patient</th>
                <th className="p-3">Pickup</th>
                <th className="p-3">Driver</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTable rows={5} cols={5} />
              ) : (
                DATA.map((r) => (
                  <tr key={r.id} className="table-row">
                    <td className="p-3 font-mono text-xs text-primary-600 font-bold">
                      {r.callId}
                    </td>
                    <td className="p-3 font-medium text-gray-800">
                      {r.patient}
                    </td>
                    <td className="p-3 text-center text-gray-600 text-xs">
                      {r.pickup}
                    </td>
                    <td className="p-3 text-center text-gray-600 text-xs">
                      {r.driver}
                    </td>
                    <td className="p-3 text-center text-gray-600">{r.date}</td>
                    <td className="p-3 text-center text-gray-600">{r.time}</td>
                    <td className="p-3 text-center">
                      <span className={STATUS[r.status]}>{r.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
