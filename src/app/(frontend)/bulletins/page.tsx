import type { Metadata } from 'next'

import { BulletinsList } from '@/components/BulletinsList'
import { getLatestBulletins } from '@/lib/content'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'News & Bulletins',
  description: 'Weekly bulletins, announcements, and feast day news.',
}

export default async function BulletinsPage() {
  const bulletins = await getLatestBulletins(50)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">News &amp; Bulletins</h1>
        <p className="mt-1 text-sm text-slate-500">
          Weekly bulletins, condolences, and general announcements.
        </p>
      </div>

      <BulletinsList bulletins={bulletins} />
    </div>
  )
}
