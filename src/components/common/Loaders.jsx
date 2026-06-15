export function Spinner({ size = 'md' }) {
  const sizes = { sm: 'w-5 h-5 border-2', md: 'w-8 h-8 border-3', lg: 'w-12 h-12 border-4' }
  return (
    <div className={`${sizes[size]} border-primary-200 border-t-primary-500 rounded-full animate-spin`} />
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-hospital-bg flex flex-col items-center justify-center gap-4">
      <div className="w-14 h-14 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      <p className="text-sm text-gray-500 font-medium">Loading...</p>
    </div>
  )
}

export function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-16">
      <Spinner size="lg" />
    </div>
  )
}
