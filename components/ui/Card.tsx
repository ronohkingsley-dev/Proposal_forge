import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  noPadding?: boolean
}

export function Card({ children, className = '', noPadding = false }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${className}`}>
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  )
}

export function CardHeader({ title, subtitle, className = '' }: { title: string, subtitle?: string, className?: string }) {
  return (
    <div className={`p-6 border-b border-slate-50 ${className}`}>
      <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
      {subtitle && <p className="text-sm text-slate-500 font-medium mt-1">{subtitle}</p>}
    </div>
  )
}
