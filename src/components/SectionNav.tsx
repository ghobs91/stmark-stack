'use client'

import { useEffect, useState } from 'react'

export type SectionNavItem = {
  id: string
  label: string
}

export function SectionNav({ items }: { items: SectionNavItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? '')

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]?.target.id) setActive(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [items])

  return (
    <nav
      aria-label="On this page"
      className="fixed left-3 top-1/2 z-30 hidden w-44 -translate-y-1/2 min-[1440px]:block"
    >
      <p className="eyebrow mb-3 pl-4">On this page</p>
      <ul className="relative border-l border-hair">
        {items.map((item) => {
          const isActive = item.id === active
          return (
            <li key={item.id} className="relative">
              <a
                href={`#${item.id}`}
                aria-current={isActive ? 'true' : undefined}
                className={`group flex items-center py-1.5 pl-4 text-sm transition ${
                  isActive ? 'font-medium text-ink' : 'text-subtle hover:text-ink'
                }`}
              >
                <span
                  className={`absolute -left-[5px] h-2 w-2 rounded-full transition ${
                    isActive ? 'scale-125 bg-gold' : 'bg-hair group-hover:bg-gold/60'
                  }`}
                />
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
