// Reusable shimmer skeleton components
// Use these wherever backend data is expected but not yet loaded

function Shimmer({ className }) {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
}

// Doctor card skeleton (FindDoctor page)
export function SkeletonDoctorCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 overflow-hidden">
      <div className="flex items-center gap-3 mb-4">
        <Shimmer className="w-16 h-16 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-4 w-3/4" />
          <Shimmer className="h-3 w-1/2" />
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => <Shimmer key={i} className="w-3 h-3 rounded-full" />)}
          </div>
        </div>
      </div>
      <Shimmer className="h-9 w-full rounded-xl mb-3" />
      <div className="space-y-1.5">
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-4/5" />
      </div>
      <Shimmer className="h-9 w-full rounded-xl mt-4" />
    </div>
  )
}

// Head doctor card skeleton (HeadDoctors page)
export function SkeletonHeadDoctorCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex gap-4">
        <Shimmer className="w-16 h-16 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5 flex-1">
              <Shimmer className="h-4 w-3/4" />
              <Shimmer className="h-3 w-1/2" />
              <Shimmer className="h-3 w-2/3" />
            </div>
            <Shimmer className="h-7 w-12 rounded-lg ml-3" />
          </div>
          <div className="flex gap-3 pt-1">
            <Shimmer className="h-3 w-20" />
            <Shimmer className="h-3 w-16" />
            <Shimmer className="h-3 w-16 ml-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Stat card skeleton (admin/manager pages)
export function SkeletonStatCard({ accent = 'border-l-slate-300' }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 border-l-4 ${accent} p-5 text-center`}>
      <Shimmer className="h-8 w-16 mx-auto mb-2 rounded-lg" />
      <Shimmer className="h-3 w-20 mx-auto" />
    </div>
  )
}

// Table row skeleton
const ROW_WIDTHS = ['w-3/4', 'w-2/3', 'w-1/2', 'w-3/5', 'w-1/3', 'w-2/5']
export function SkeletonTableRow({ cols = 5 }) {
  return (
    <tr className="border-b border-slate-100">
      {[...Array(cols)].map((_, i) => (
        <td key={i} className="p-3">
          <Shimmer className={`h-4 ${ROW_WIDTHS[i % ROW_WIDTHS.length]}`} />
        </td>
      ))}
    </tr>
  )
}

// Report / parchi card skeleton
export function SkeletonReportCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Shimmer className="h-5 w-28" />
        <Shimmer className="h-6 w-20 rounded-full" />
      </div>
      <Shimmer className="h-3 w-40" />
      <Shimmer className="h-3 w-52" />
      <div className="flex gap-2 pt-1">
        <Shimmer className="h-8 w-24 rounded-xl" />
        <Shimmer className="h-8 w-24 rounded-xl" />
      </div>
    </div>
  )
}

// Generic text line skeletons
export function SkeletonText({ lines = 3 }) {
  const widths = ['w-full', 'w-5/6', 'w-4/6']
  return (
    <div className="space-y-2">
      {[...Array(lines)].map((_, i) => (
        <Shimmer key={i} className={`h-3 ${widths[i % widths.length]}`} />
      ))}
    </div>
  )
}

// Full table skeleton (header + rows)
export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-slate-100">
          {[...Array(cols)].map((_, i) => (
            <th key={i} className="p-3 text-left">
              <Shimmer className="h-3 w-16" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(rows)].map((_, i) => (
          <SkeletonTableRow key={i} cols={cols} />
        ))}
      </tbody>
    </table>
  )
}
