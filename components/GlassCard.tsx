import React from 'react'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  noPadding?: boolean
  style?: React.CSSProperties
}

export function GlassCard({ children, className = '', noPadding = false, style }: GlassCardProps) {
  return (
    <div className={`bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-indigo-500/10 ${noPadding ? '' : 'p-6 sm:p-8'} ${className}`} style={style}>
      {children}
    </div>
  )
}
