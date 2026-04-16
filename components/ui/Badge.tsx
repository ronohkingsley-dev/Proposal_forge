interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral'
  className?: string
}

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  const variants = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    error: 'bg-rose-50 text-rose-700 border-rose-100',
    info: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    neutral: 'bg-slate-50 text-slate-600 border-slate-100'
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
