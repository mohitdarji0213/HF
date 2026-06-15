import * as XLSX from 'xlsx'

export const exportToExcel = (data, filename, sheetName = 'Data') => {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  
  // Auto column widths
  const colWidths = Object.keys(data[0] || {}).map(key => ({
    wch: Math.max(key.length, ...data.map(row => String(row[key] || '').length)) + 2
  }))
  ws['!cols'] = colWidths

  XLSX.writeFile(wb, `${filename}_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.xlsx`)
}

export const exportMultiSheet = (sheets, filename) => {
  const wb = XLSX.utils.book_new()
  sheets.forEach(({ data, name }) => {
    const ws = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(wb, ws, name)
  })
  XLSX.writeFile(wb, `${filename}_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.xlsx`)
}
