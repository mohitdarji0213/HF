import { FiDownload, FiFileText } from 'react-icons/fi'
import { exportToExcel } from '../../utils/exportExcel'
import { exportPDF } from '../../utils/exportPDF'

/**
 * Reusable export buttons (Excel + PDF).
 * Props:
 *   data       - array of row objects
 *   filename   - base name for the file (no extension)
 *   title      - report title shown in PDF header
 *   cols       - (optional) ordered list of keys to include
 *   colLabels  - (optional) { key: 'Display Label' } map
 */
export default function ExportButtons({ data, filename, title, cols, colLabels }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => exportToExcel(data, filename)}
        className="btn-secondary text-sm py-2 flex items-center gap-1.5"
        title="Export as Excel"
      >
        <FiDownload size={14} />
        Excel
      </button>
      <button
        onClick={() => exportPDF(data, filename, title, cols, colLabels)}
        className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl border-2 border-red-500 text-red-600 hover:bg-red-50 transition-colors"
        title="Export as PDF"
      >
        <FiFileText size={14} />
        PDF
      </button>
    </div>
  )
}
