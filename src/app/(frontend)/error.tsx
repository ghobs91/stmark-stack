'use client'

import { useEffect } from 'react'

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
    <div className="mx-auto max-w-md py-16 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
      <p className="mt-3 text-sm text-slate-600">
        We hit an unexpected error loading this page. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
      >
        Try again
      </button>
    </div>
  )
}
