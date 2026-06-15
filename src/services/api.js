import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://bhartiya-hospital-backend.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('hms_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

API.interceptors.response.use(
  (res) => res.data,
  (err) => {
    // Auth endpoints pe 401 aaye toh redirect mat karo — wahan khud handle hoga
    const isAuthEndpoint = err.config?.url?.includes('/auth/')
    if (err.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('hms_token')
      window.location.href = '/login'
    }
    return Promise.reject(err.response?.data || { message: 'Network error' })
  }
)

// ─── Auth ───────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
}

// ─── Appointments ───────────────────────────────────────
export const appointmentAPI = {
  book: (data) => API.post('/appointments', data),
  getMyAppointments: () => API.get('/appointments/my'),
  getAll: (params) => API.get('/appointments', { params }),
  update: (id, data) => API.put(`/appointments/${id}`, data),
  cancel: (id) => API.delete(`/appointments/${id}`),
  getAnalytics: (params) => API.get('/appointments/analytics', { params }),
}

// ─── Ambulance ──────────────────────────────────────────
export const ambulanceAPI = {
  book: (data) => API.post('/ambulance', data),
  getAll: (params) => API.get('/ambulance', { params }),
  update: (id, data) => API.put(`/ambulance/${id}`, data),
  getAnalytics: () => API.get('/ambulance/analytics'),
}

// ─── Reports / Parchi ───────────────────────────────────
export const reportAPI = {
  upload: (data) => API.post('/reports', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getByParchi: (parchiNo) => API.get(`/reports/parchi/${parchiNo}`),
  getAll: (params) => API.get('/reports', { params }),
  getAnalytics: (params) => API.get('/reports/analytics', { params }),
  download: (id) => API.get(`/reports/${id}/download`),
}

// ─── Doctors ────────────────────────────────────────────
export const doctorAPI = {
  getAll: (params) => API.get('/doctors', { params }),
  getById: (id) => API.get(`/doctors/${id}`),
  update: (id, data) => API.put(`/doctors/${id}`, data),
  rate: (id, data) => API.post(`/doctors/${id}/rate`, data),
  getDepartmentStats: (headId) => API.get(`/doctors/department-stats/${headId}`),
}

// ─── Issues ─────────────────────────────────────────────
export const issueAPI = {
  submit: (data) => API.post('/issues', data),
  getMy: () => API.get('/issues/my'),
  getAll: (params) => API.get('/issues', { params }),
  update: (id, data) => API.put(`/issues/${id}`, data),
}

// ─── Events ─────────────────────────────────────────────
export const eventAPI = {
  getAll: () => API.get('/events'),
  create: (data) => API.post('/events', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/events/${id}`),
}

// ─── Dashboard Stats ────────────────────────────────────
export const statsAPI = {
  district: () => API.get('/stats/district'),
  manager: () => API.get('/stats/manager'),
  doctorHead: () => API.get('/stats/doctor-head'),
  doctor: () => API.get('/stats/doctor'),
}

export default API
