import type { Metadata } from 'next'

import { BulletinsList } from '@/components/BulletinsList'
import { PageHeader } from '@/components/PageHeader'
import { Container } from '@/components/ui/Container'
import { getLatestBulletins } from '@/lib/content'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'News & Bulletins',
  description: 'Weekly bulletins, announcements, and feast day news.',
}

export default async function BulletinsPage() {
  const bulletins = await getLatestBulletins(50)

  return (
    <div>
      <PageHeader
        eyebrow="News"
        title="News & Bulletins"
        description="Weekly bulletins, condolences, and general announcements."
      />
      <Container className="py-10 sm:py-12">
        <BulletinsList bulletins={bulletins} />
      </Container>
    </div>
  )
}
