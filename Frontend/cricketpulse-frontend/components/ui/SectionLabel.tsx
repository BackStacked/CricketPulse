import type { LucideIcon } from 'lucide-react'

interface SectionLabelProps {
  children: React.ReactNode
  icon?: LucideIcon
}

export function SectionLabel({ children, icon: Icon }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-1.5 mb-3">
      {Icon && <Icon size={14} className="text-text-muted" aria-hidden="true" />}
      <span className="text-xs font-medium uppercase tracking-widest text-text-muted">
        {children}
      </span>
    </div>
  )
}
