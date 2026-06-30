export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false'

export const DEMO_REPORT_HISTORY = [
  { _id: 'd1', parchiNo: 'P2024-001234', patientName: 'Ramesh Kumar', files: [{ fileType: 'X-Ray', name: 'X-Ray Report', size: '2.4 MB', uploadedAt: '2024-11-15T10:30:00Z' }], createdAt: '2024-11-15T10:30:00Z' },
  { _id: 'd2', parchiNo: 'P2024-001235', patientName: 'Meena Sharma', files: [{ fileType: 'Blood Test', name: 'Blood Test Report', size: '1.1 MB', uploadedAt: '2024-11-15T11:15:00Z' }], createdAt: '2024-11-15T11:15:00Z' },
  { _id: 'd3', parchiNo: 'P2024-001236', patientName: 'Asha Devi', files: [{ fileType: 'MRI Scan', name: 'MRI Scan', size: '8.6 MB', uploadedAt: '2024-11-14T03:00:00Z' }], createdAt: '2024-11-14T03:00:00Z' },
  { _id: 'd4', parchiNo: 'P2024-001237', patientName: 'Govind Lal', files: [{ fileType: 'CT Scan', name: 'CT Scan', size: '12.1 MB', uploadedAt: '2024-11-13T09:45:00Z' }], createdAt: '2024-11-13T09:45:00Z' },
]

export const DEMO_ANALYTICS = {
  totalParchi: 342,
  totalFiles: 423,
  totalDownloads: 2180,
}

export const DEMO_WEEK_DATA = [
  { day: 'Mon', uploads: 12 }, { day: 'Tue', uploads: 18 },
  { day: 'Wed', uploads: 25 }, { day: 'Thu', uploads: 15 },
  { day: 'Fri', uploads: 22 }, { day: 'Sat', uploads: 8 },
]

export const DEMO_EVENTS = [
  { _id: 'e1', title: 'Free Health Camp', date: '2024-12-01', dept: 'General Medicine', image: null, desc: 'Free checkup for all residents. Blood pressure, diabetes screening included.', uploadedByName: 'Manager' },
  { _id: 'e2', title: 'Blood Donation Drive', date: '2024-11-25', dept: 'All Departments', image: null, desc: 'Annual blood donation camp. All blood groups needed. Refreshments provided.', uploadedByName: 'District Admin' },
  { _id: 'e3', title: "Children's Health Week", date: '2024-12-10', dept: 'Pediatrics', image: null, desc: 'Free pediatric consultations and vaccination drive for children aged 0-12.', uploadedByName: 'Manager' },
]

export const DEMO_ISSUES = [
  { _id: 'i1', senderName: 'Patient', department: 'Orthopedics', issueType: 'Waiting Time', urgency: 'high', status: 'open', createdAt: '2024-11-14' },
  { _id: 'i2', senderName: 'Patient', department: 'Cardiology', issueType: 'Staff Behavior', urgency: 'medium', status: 'in-progress', createdAt: '2024-11-13' },
  { _id: 'i3', senderName: 'Doctor Head', department: 'Pediatrics', issueType: 'Facility Issue', urgency: 'medium', status: 'open', createdAt: '2024-11-12' },
]

export const DEMO_MANAGER_STATS = {
  appointments: 47, ambulance: 8, reports: 23, issues: 3,
}

export const DEMO_WEEK_ACTIVITY = [
  { day: 'Mon', appointments: 42, reports: 18 },
  { day: 'Tue', appointments: 38, reports: 22 },
  { day: 'Wed', appointments: 55, reports: 31 },
  { day: 'Thu', appointments: 47, reports: 25 },
  { day: 'Fri', appointments: 60, reports: 35 },
  { day: 'Sat', appointments: 35, reports: 14 },
]

export const DEMO_PARCHI_REPORT = {
  parchiNo: 'P2024-001234',
  patientName: 'Ramesh Kumar',
  age: 45, gender: 'Male',
  doctorName: 'Dr. Rajesh Sharma',
  department: 'Orthopedics',
  createdAt: '2024-11-15T10:30:00Z',
  diagnosis: 'Knee Ligament Tear - Grade II',
  files: [
    { _id: 'f1', name: 'X-Ray Report', fileType: 'X-Ray', url: null, uploadedAt: '2024-11-15T10:30:00Z', size: '2.4 MB' },
    { _id: 'f2', name: 'MRI Scan', fileType: 'MRI', url: null, uploadedAt: '2024-11-15T14:15:00Z', size: '8.1 MB' },
    { _id: 'f3', name: 'Blood Test Report', fileType: 'Blood', url: null, uploadedAt: '2024-11-15T11:00:00Z', size: '1.2 MB' },
  ],
}
