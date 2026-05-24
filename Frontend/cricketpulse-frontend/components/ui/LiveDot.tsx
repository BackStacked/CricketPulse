'use client'

interface LiveDotProps {
  status: 'connecting' | 'live' | 'disconnected'
}

export function LiveDot({ status }: LiveDotProps) {
  return (
    <div className="flex items-center gap-2" role="status" aria-live="polite">
      <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
        {status === 'live' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75" />
        )}
        <span
          className={[
            'relative inline-flex rounded-full h-2.5 w-2.5',
            status === 'live' ? 'bg-accent-green' : '',
            status === 'connecting' ? 'bg-accent-amber' : '',
            status === 'disconnected' ? 'bg-accent-red' : '',
          ].join(' ')}
        />
      </span>
      <span
        className={[
          'font-mono text-xs font-medium uppercase tracking-widest',
          status === 'live' ? 'text-accent-green' : '',
          status === 'connecting' ? 'text-accent-amber' : '',
          status === 'disconnected' ? 'text-accent-red' : '',
        ].join(' ')}
      >
        {status === 'live' ? 'Live' : status === 'connecting' ? 'Connecting' : 'Offline'}
      </span>
    </div>
  )
}
