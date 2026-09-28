'use client'

import { useEffect } from 'react'

import { Container } from '@/components/ui/Container'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container className="py-20 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-2 text-3xl text-ink">We hit an unexpected error</h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted">
        This page could not be loaded. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark"
      >
        Try again
      </button>
    </Container>
  )
}
