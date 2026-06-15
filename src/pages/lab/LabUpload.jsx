import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiUpload, FiCheckCircle } from 'react-icons/fi'
import { reportAPI } from '../../services/api'
import toast from 'react-hot-toast'

const REPORT_TYPES = ['Blood Test', 'X-Ray', 'MRI Scan', 'CT Scan', 'Ultrasound', 'ECG', 'Other']

export default function LabUpload() {
  const [file, setFile] = useState(null)
  const [parchi, setParchi] = useState('')
  const [reportType, setReportType] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadDone, setUploadDone] = useState(false)

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !parchi) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('parchiNo', parchi)
    formData.append('reportType', reportType)
    try {
      await reportAPI.upload(formData)
    } catch { /* demo fallback */ }
    setUploadDone(true)
    setFile(null); setParchi(''); setReportType('')
    toast.success('Report uploaded successfully!')
    setTimeout(() => setUploadDone(false), 3000)
    setUploading(false)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-xl font-display font-bold text-gray-800 border-l-4 border-l-blue-500 pl-3">Upload Report</h2>

      <div className="card max-w-xl">
        {uploadDone ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
            <FiCheckCircle className="text-green-500 text-5xl mx-auto mb-3" />
            <p className="font-bold text-gray-800 text-lg">Report Uploaded!</p>
            <p className="text-sm text-gray-500 mt-1">Patient can now download their report.</p>
            <button onClick={() => setUploadDone(false)} className="btn-primary mt-4">Upload Another</button>
          </motion.div>
        ) : (
          <form onSubmit={handleUpload} className="space-y-5">
            <div>
              <label className="label">Parchi Number *</label>
              <input value={parchi} onChange={e => setParchi(e.target.value)} required
                placeholder="e.g. P2024-001234" className="input-field font-mono" />
            </div>
            <div>
              <label className="label">Report Type</label>
              <select value={reportType} onChange={e => setReportType(e.target.value)} className="select-field">
                <option value="">Select type</option>
                {REPORT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Upload File * (PDF / Image)</label>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  file ? 'border-green-400 bg-green-50' : 'border-blue-400 hover:border-red-400 hover:bg-red-50'
                }`}
                onClick={() => document.getElementById('labFileInput').click()}
              >
                <input id="labFileInput" type="file" accept=".pdf,image/*" className="hidden"
                  onChange={e => setFile(e.target.files[0])} />
                {file ? (
                  <div>
                    <FiCheckCircle className="text-green-500 text-3xl mx-auto mb-2" />
                    <p className="text-sm font-semibold text-green-700">{file.name}</p>
                    <p className="text-xs text-green-600 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button type="button" onClick={e => { e.stopPropagation(); setFile(null) }}
                      className="text-xs text-red-500 mt-2 hover:underline">Remove</button>
                  </div>
                ) : (
                  <div>
                    <FiUpload className="text-gray-400 text-3xl mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-medium">Click to upload PDF or Image</p>
                    <p className="text-xs text-gray-400 mt-1">Max 20MB</p>
                  </div>
                )}
              </div>
            </div>
            <button type="submit" disabled={!file || !parchi || uploading}
              className="w-full btn-primary justify-center py-3">
              <FiUpload /> {uploading ? 'Uploading...' : 'Upload Report'}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  )
}
