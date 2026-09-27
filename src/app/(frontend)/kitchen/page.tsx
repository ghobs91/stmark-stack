import type { Metadata } from 'next'

import { KitchenOrdering } from '@/components/KitchenOrdering'
import { getKitchenSettings } from '@/lib/content'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Kitchen Orders',
  description: 'Order food from the St. Mark church kitchen for pickup after liturgy.',
}

export default async function KitchenPage() {
  const settings = await getKitchenSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Kitchen Orders</h1>
        <p className="mt-1 text-sm text-slate-500">
          Place your order online, or text the kitchen directly if the form gives you trouble.
        </p>
      </div>

      <KitchenOrdering settings={settings} />
    </div>
  )
}
