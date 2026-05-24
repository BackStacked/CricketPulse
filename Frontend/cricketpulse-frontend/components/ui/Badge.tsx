type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'muted'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-accent-primary/10 border-accent-primary/30 text-accent-primary',
  success: 'bg-accent-green/10 border-accent-green/30 text-accent-green',
  warning: 'bg-accent-amber/10 border-accent-amber/30 text-accent-amber',
  danger:  'bg-accent-red/10 border-accent-red/30 text-accent-red',
  purple:  'bg-accent-purple/10 border-accent-purple/30 text-accent-purple',
  muted:   'bg-background-raised border-background-border text-text-muted',
}

export function Badge({ children, variant = 'muted' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border',
        variantClasses[variant],
      ].join(' ')}
    >
      {children}
    </span>
  )
}
