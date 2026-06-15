import { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext(null)

export const ROLES = {
  PATIENT: 'patient',
  DISTRICT_ADMIN: 'district_admin',
  HOSPITAL_MANAGER: 'hospital_manager',
  DOCTOR_HEAD: 'doctor_head',
  DOCTOR: 'doctor',
  LAB_ASSISTANT: 'lab_assistant',
}

export const ROLE_LABELS = {
  patient: 'Patient',
  district_admin: 'District Admin',
  hospital_manager: 'Hospital Manager',
  doctor_head: 'Department Head Doctor',
  doctor: 'Doctor',
  lab_assistant: 'Lab Assistant',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('hms_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token)
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded)
        } else {
          logout()
        }
      } catch { logout() }
    }
    setLoading(false)
  }, [token])

  const login = (tokenData) => {
    localStorage.setItem('hms_token', tokenData)
    setToken(tokenData)
    const decoded = jwtDecode(tokenData)
    setUser(decoded)
  }

  const logout = () => {
    localStorage.removeItem('hms_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, ROLES }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
