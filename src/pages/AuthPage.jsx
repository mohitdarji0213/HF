import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import {
  FiEye,
  FiEyeOff,
  FiUser,
  FiLock,
  FiMail,
  FiPhone,
  FiChevronDown,
  FiHome,
  FiAlertCircle,
} from "react-icons/fi";
import { MdLocalHospital } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

const ROLES = [
  {
    value: "patient",
    label: "🏥 Patient",
    desc: "Book appointments, access reports",
  },
  {
    value: "doctor",
    label: "👨‍⚕️ Doctor",
    desc: "Manage patients & appointments",
  },
  {
    value: "doctor_head",
    label: "⭐ Department Head Doctor",
    desc: "Manage department team",
  },
  {
    value: "hospital_manager",
    label: "🏢 Hospital Manager",
    desc: "Hospital operations",
  },
  {
    value: "district_admin",
    label: "🏛️ District Admin",
    desc: "District level oversight",
  },
  {
    value: "lab_assistant",
    label: "🧪 Lab Assistant",
    desc: "Upload patient reports",
  },
];

const ROLE_REDIRECT = {
  patient: "/patient",
  district_admin: "/admin",
  hospital_manager: "/manager",
  doctor_head: "/doctor-head",
  doctor: "/doctor",
  lab_assistant: "/lab",
};

function makeFakeToken(user) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({ ...user, exp: Math.floor(Date.now() / 1000) + 86400 * 7 }),
  );
  return `${header}.${payload}.fakesig`;
}

export default function AuthPage({ mode = "login" }) {
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "patient",
    department: "",
    qualification: "",
    experience: "",
  });
  const set = (k, v) => {
    setError("");
    setForm((p) => ({ ...p, [k]: v }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend validation
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const res = await authAPI.login({
          email: form.email,
          password: form.password,
        });
        login(res.token);
        toast.success("Welcome back!");
        // Role comes from JWT, not form
        const decoded = jwtDecode(res.token);
        navigate(ROLE_REDIRECT[decoded.role] || "/home");
      } else {
        const res = await authAPI.register(form);
        login(res.token);
        toast.success("Account created successfully!");
        navigate(ROLE_REDIRECT[form.role] || "/home");
      }
    } catch (err) {
      const msg = err?.message || "";
      // Agar network error hai (backend nahi chala) toh demo mode
      if (!msg || msg === "Network error") {
        const fakeUser = {
          id: Date.now(),
          name: form.name || "Demo User",
          email: form.email,
          role: form.role,
          department: form.department,
        };
        login(makeFakeToken(fakeUser));
        toast.success("Logged in (demo mode — backend offline)");
        navigate(ROLE_REDIRECT[form.role] || "/home");
      } else {
        // Real server error — dikhao
        setError(msg);
      }
    }
    setLoading(false);
  };

  const showDoctorFields =
    form.role === "doctor" || form.role === "doctor_head";
  const DEPARTMENTS = [
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Pediatrics",
    "Gynecology",
    "General Medicine",
    "Dermatology",
    "ENT",
    "Ophthalmology",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center p-4">
      <Link
        to="/home"
        className="fixed top-4 left-4 flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold transition-colors no-underline bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-2 rounded-xl"
      >
        <FiHome size={16} /> Home
      </Link>

      <div className="w-full max-w-md">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur">
            <MdLocalHospital className="text-white text-3xl" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white">
            {" "}
            Bhartiya Hospital
          </h1>
          <p className="text-blue-200 text-sm">Hospital Management System</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-2xl p-6"
        >
          {/* Tab toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {["Login", "Register"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setIsLogin(tab === "Login");
                  setError("");
                }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${(tab === "Login") === isLogin ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Error box */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4"
            >
              <FiAlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role — only for registration */}
            {!isLogin && (
              <div>
                <label className="label">Your Role *</label>
                <div className="relative">
                  <select
                    value={form.role}
                    onChange={(e) => set("role", e.target.value)}
                    className="select-field pr-10 font-medium"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {ROLES.find((r) => r.value === form.role)?.desc}
                </p>
              </div>
            )}

            {/* Name — only register */}
            {!isLogin && (
              <div>
                <label className="label">Full Name *</label>
                <div className="relative">
                  <FiUser
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={15}
                  />
                  <input
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Your full name"
                    className="input-field pl-9"
                  />
                </div>
              </div>
            )}

            {/* Phone — only register */}
            {!isLogin && (
              <div>
                <label className="label">Phone</label>
                <div className="relative">
                  <FiPhone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={15}
                  />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="10-digit mobile"
                    className="input-field pl-9"
                  />
                </div>
              </div>
            )}

            {/* Doctor-specific — only register */}
            {!isLogin && showDoctorFields && (
              <>
                <div>
                  <label className="label">Department *</label>
                  <select
                    value={form.department}
                    onChange={(e) => set("department", e.target.value)}
                    className="select-field"
                  >
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Qualification</label>
                    <input
                      value={form.qualification}
                      onChange={(e) => set("qualification", e.target.value)}
                      placeholder="MBBS, MD..."
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label">Experience (yrs)</label>
                    <input
                      type="number"
                      min="0"
                      value={form.experience}
                      onChange={(e) => set("experience", e.target.value)}
                      placeholder="Years"
                      className="input-field"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="label">Email *</label>
              <div className="relative">
                <FiMail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={15}
                />
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="your@email.com"
                  className="input-field pl-9"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label">Password *</label>
              <div className="relative">
                <FiLock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={15}
                />
                <input
                  required
                  type={showPass ? "text" : "password"}
                  minLength={8}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="Min 8 characters"
                  className="input-field pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-400 mt-1">
                  Minimum 8 characters required
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3 text-base font-semibold mt-2"
            >
              {loading
                ? "Please wait..."
                : isLogin
                  ? "Login →"
                  : "Create Account →"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            By continuing, you agree to our Terms of Service &amp; Privacy
            Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}
