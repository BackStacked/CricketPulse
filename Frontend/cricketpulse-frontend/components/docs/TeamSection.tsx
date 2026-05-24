import { MapPin, Globe, Mail } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Badge } from '@/components/ui/Badge'
import { DEVELOPER_INFO, PROJECT_INFO } from '@/lib/constants'

export function TeamSection() {
  return (
    <section aria-labelledby="team-title" className="space-y-6">
      <div>
        <SectionLabel>Builder</SectionLabel>
        <h2 id="team-title" className="text-2xl font-semibold tracking-tight text-text-primary">
          About the Developer
        </h2>
      </div>

      <div className="bg-background-surface border border-background-border rounded-lg p-6">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-full bg-accent-primary/20 border-2 border-accent-primary flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <span className="text-accent-primary text-xl font-bold font-mono">
              {DEVELOPER_INFO.initials}
            </span>
          </div>

          {/* Info */}
          <div className="min-w-0">
            <h3 className="text-2xl font-semibold text-text-primary tracking-tight">
              {DEVELOPER_INFO.name}
            </h3>
            <p className="text-sm text-text-secondary mt-0.5">{DEVELOPER_INFO.title}</p>

            <div className="flex items-center gap-1.5 mt-2">
              <MapPin size={12} className="text-text-muted" aria-hidden="true" />
              <span className="text-xs text-text-muted">{DEVELOPER_INFO.college}</span>
            </div>

            <div className="mt-2">
              <Badge variant="primary">{PROJECT_INFO.event} 2026</Badge>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-5 flex flex-wrap gap-1.5" aria-label="Skills">
          {DEVELOPER_INFO.skills.map((skill) => (
            <span
              key={skill}
              className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-background-raised border border-background-border text-text-secondary"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="mt-4 flex flex-wrap gap-4">
          <a
            href={DEVELOPER_INFO.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors duration-150 focus-visible:outline focus-visible:outline-accent-primary rounded"
          >
            <Globe size={14} aria-hidden="true" />
            <span>{DEVELOPER_INFO.github}</span>
          </a>
          <a
            href={`mailto:${DEVELOPER_INFO.email}`}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors duration-150 focus-visible:outline focus-visible:outline-accent-primary rounded"
          >
            <Mail size={14} aria-hidden="true" />
            <span>{DEVELOPER_INFO.email}</span>
          </a>
        </div>

        {/* Specialty callout */}
        <div className="mt-5 bg-background-base border border-background-border rounded-lg p-4">
          <p className="text-sm leading-7 text-text-secondary">
            {DEVELOPER_INFO.specialty}
          </p>
        </div>
      </div>
    </section>
  )
}
