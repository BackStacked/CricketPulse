import type { LucideIcon } from 'lucide-react'
import { SectionLabel } from './SectionLabel'

interface StatCardProps {
  label: string
  value: string
  icon?: LucideIcon
  accentClass?: string
}

export function StatCard({ label, value, icon: Icon, accentClass }: StatCardProps) {
  return (
    <div
      className={[
        'bg-background-surface border border-background-border rounded-lg p-4',
        accentClass ? `border-l-2 ${accentClass}` : '',
      ].join(' ')}
    >
      <SectionLabel icon={Icon}>{label}</SectionLabel>
      <p className="font-mono text-3xl font-bold text-text-primary tabular-nums leading-none">
        {value}
      </p>
    </div>
  )
}
