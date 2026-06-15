import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'

// Public home page (from hosp - big beautiful page)
import HomePage from './pages/HomePage'

// Auth
import AuthPage from './pages/AuthPage'

// Patient
import PatientHome from './pages/patient/PatientHome'
import FindDoctor from './pages/patient/FindDoctor'
import HeadDoctors from './pages/patient/HeadDoctors'
import BookAppointment from './pages/patient/BookAppointment'
import AmbulanceBook from './pages/patient/AmbulanceBook'
import PatientReports from './pages/patient/PatientReports'
import SubmitIssue from './pages/patient/SubmitIssue'
import DeveloperPage from './pages/patient/DeveloperPage'

// Admin
import DistrictAdminDashboard from './pages/admin/DistrictAdminDashboard'
import PatientStatistics from './pages/admin/PatientStatistics'
import AdminAppointments from './pages/admin/AdminAppointments'
import AdminAmbulance from './pages/admin/AdminAmbulance'
import AdminReports from './pages/admin/AdminReports'
import AdminDoctors from './pages/admin/AdminDoctors'
import AdminIssues from './pages/admin/AdminIssues'

// Manager
import ManagerDashboard from './pages/manager/ManagerDashboard'
import ManagerAppointments from './pages/manager/ManagerAppointments'
import ManagerAmbulance from './pages/manager/ManagerAmbulance'
import ManagerReports from './pages/manager/ManagerReports'
import ManagerIssues from './pages/manager/ManagerIssues'
import ManagerDoctors from './pages/manager/ManagerDoctors'

// Doctor Head
import DoctorHeadDashboard from './pages/doctorhead/DoctorHeadDashboard'
import DoctorHeadProfile from './pages/doctorhead/DoctorHeadProfile'
import DoctorHeadAppointments from './pages/doctorhead/DoctorHeadAppointments'
import DoctorHeadTeam from './pages/doctorhead/DoctorHeadTeam'
import DoctorHeadReports from './pages/doctorhead/DoctorHeadReports'

// Doctor
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorProfile from './pages/doctor/DoctorProfile'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import DoctorPatients from './pages/doctor/DoctorPatients'

// Lab
import LabDashboard from './pages/lab/LabDashboard'
import LabUpload from './pages/lab/LabUpload'
import LabAnalytics from './pages/lab/LabAnalytics'

// Shared
import EventsPage from './components/common/EventsPage'

const ROLES = {
  PATIENT: 'patient',
  DISTRICT: 'district_admin',
  MANAGER: 'hospital_manager',
  HEAD: 'doctor_head',
  DOCTOR: 'doctor',
  LAB: 'lab_assistant',
}

// Role → dashboard path (non-patient roles go to their dashboard after login)
export const ROLE_DASHBOARD = {
  patient: '/patient',
  district_admin: '/admin',
  hospital_manager: '/manager',
  doctor_head: '/doctor-head',
  doctor: '/doctor',
  lab_assistant: '/lab',
}

// / pe aate hi: logged in → dashboard, warna /home pe bhejo
function RootGuard() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return
    if (user) {
      navigate(ROLE_DASHBOARD[user.role] || '/home', { replace: true })
    } else {
      navigate('/home', { replace: true })
    }
  }, [user, loading, navigate])

  return null
}

function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-hospital-bg">
      <div className="text-center">
        <p className="text-6xl mb-4">🔒</p>
        <h2 className="text-2xl font-display font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-500 mb-4">You don't have permission to access this page.</p>
        <a href="/home" className="btn-primary inline-flex">Go Home</a>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Toaster position="top-right" toastOptions={{
          className: 'text-sm font-medium',
          style: { borderRadius: '12px', border: '1px solid #bfdbfe' },
          success: { iconTheme: { primary: '#22c55e', secondary: 'white' } },
        }} />
        <Routes>
          {/* / → logged in to dashboard, warna /home */}
          <Route path="/" element={<RootGuard />} />

          {/* Public homepage — sabke liye accessible */}
          <Route path="/home" element={<HomePage />} />

          {/* Auth */}
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />

          {/* Public pages */}
          <Route path="/events" element={<div className="p-6 max-w-5xl mx-auto"><EventsPage /></div>} />
          <Route path="/developer" element={<DeveloperPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Patient — public (no login needed), reports page login required */}
          <Route path="/patient" element={<PatientHome />} />
          <Route path="/patient/find-doctor" element={<FindDoctor />} />
          <Route path="/patient/head-doctors" element={<HeadDoctors />} />
          <Route path="/patient/book-appointment" element={<BookAppointment />} />
          <Route path="/patient/ambulance" element={<AmbulanceBook />} />
          <Route path="/patient/reports" element={<ProtectedRoute roles={[ROLES.PATIENT]}><PatientReports /></ProtectedRoute>} />
          <Route path="/patient/submit-issue" element={<SubmitIssue />} />

          {/* District Admin */}
          <Route path="/admin" element={<ProtectedRoute roles={[ROLES.DISTRICT]}><DistrictAdminDashboard /></ProtectedRoute>}>
            <Route path="patients" element={<PatientStatistics />} />
            <Route path="events" element={<EventsPage canUpload />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="ambulance" element={<AdminAmbulance />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="doctors" element={<AdminDoctors />} />
            <Route path="issues" element={<AdminIssues />} />
          </Route>

          {/* Hospital Manager */}
          <Route path="/manager" element={<ProtectedRoute roles={[ROLES.MANAGER]}><ManagerDashboard /></ProtectedRoute>}>
            <Route path="events" element={<EventsPage canUpload />} />
            <Route path="patients" element={<PatientStatistics />} />
            <Route path="appointments" element={<ManagerAppointments />} />
            <Route path="ambulance" element={<ManagerAmbulance />} />
            <Route path="reports" element={<ManagerReports />} />
            <Route path="issues" element={<ManagerIssues />} />
            <Route path="doctors" element={<ManagerDoctors />} />
          </Route>

          {/* Doctor Head */}
          <Route path="/doctor-head" element={<ProtectedRoute roles={[ROLES.HEAD]}><DoctorHeadDashboard /></ProtectedRoute>}>
            <Route path="profile" element={<DoctorHeadProfile />} />
            <Route path="my-appointments" element={<DoctorHeadAppointments />} />
            <Route path="team" element={<DoctorHeadTeam />} />
            <Route path="department-reports" element={<DoctorHeadReports />} />
          </Route>

          {/* Doctor */}
          <Route path="/doctor" element={<ProtectedRoute roles={[ROLES.DOCTOR]}><DoctorDashboard /></ProtectedRoute>}>
            <Route path="profile" element={<DoctorProfile />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="patients" element={<DoctorPatients />} />
          </Route>

          {/* Lab */}
          <Route path="/lab" element={<ProtectedRoute roles={[ROLES.LAB]}><LabDashboard /></ProtectedRoute>}>
            <Route path="upload" element={<LabUpload />} />
            <Route path="analytics" element={<LabAnalytics />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
