import type { Metadata } from 'next'

import { KitchenOrdering } from '@/components/KitchenOrdering'
import { PageHeader } from '@/components/PageHeader'
import { Container } from '@/components/ui/Container'
import { getKitchenSettings } from '@/lib/content'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Kitchen Orders',
  description: 'Order food from the St. Mark church kitchen for pickup after liturgy.',
}

export default async function KitchenPage() {
  const settings = await getKitchenSettings()

  return (
    <div>
      <PageHeader
        eyebrow="Kitchen Service"
        title="Kitchen Orders"
        description="Place your order online, or text the kitchen directly if the form gives you trouble."
      />
      <Container className="py-10 sm:py-12">
        <KitchenOrdering settings={settings} />
      </Container>
    </div>
  )
}
