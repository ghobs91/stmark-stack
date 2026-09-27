import { notFound } from 'next/navigation'

/**
 * Catches any unmatched top-level URL so it renders the frontend `not-found`
 * page (with the site chrome) instead of Next's bare default 404.
 */
export default function CatchAllNotFound() {
  notFound()
}
