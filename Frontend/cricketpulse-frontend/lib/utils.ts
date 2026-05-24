export function formatOver(over: number, ball: number): string {
  return `${over}.${ball}`
}

export function formatRR(rr: number): string {
  return rr.toFixed(1)
}

export function clsx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export function getAnimationDuration(event: string): number {
  const durations: Record<string, number> = {
    wicket: 3500,
    six: 2500,
    four: 2000,
    fifty: 3000,
    century: 4000,
  }
  return durations[event] ?? 2000
}
