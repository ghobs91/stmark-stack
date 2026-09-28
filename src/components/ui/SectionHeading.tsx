import type { ReactNode } from 'react'

export function SectionHeading({
  eyebrow,
  title,
  action,
  invert = false,
}: {
  eyebrow?: string
  title?: string
  action?: ReactNode
  invert?: boolean
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow ? <p className={`eyebrow ${invert ? 'text-gold-soft' : ''}`}>{eyebrow}</p> : null}
        {title ? (
          <h2 className={`mt-1 text-2xl sm:text-3xl ${invert ? 'text-white' : 'text-ink'}`}>
            {title}
          </h2>
        ) : null}
      </div>
      {action}
    </div>
  )
}
