interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export function Input({ label, error, helperText, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block">
          {label}
        </label>
      )}
      <input 
        className={`w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all placeholder:text-slate-500 shadow-inner ${error ? 'border-rose-500 ring-rose-500/10' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs font-bold text-rose-500">{error}</p>}
      {helperText && !error && <p className="text-xs font-medium text-slate-400">{helperText}</p>}
    </div>
  )
}

export function Select({ label, error, children, className = '', ...props }: any) {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block">
          {label}
        </label>
      )}
      <select 
        className={`w-full bg-slate-900 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all appearance-none cursor-pointer shadow-inner ${error ? 'border-rose-500' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}
