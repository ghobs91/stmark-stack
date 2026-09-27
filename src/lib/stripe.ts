import Stripe from 'stripe'

export { DONATION_FUNDS, isDonationFund } from './donation-funds'
export type { DonationFund } from './donation-funds'

let stripeClient: Stripe | null = null

/** Returns a configured Stripe client, or null when no secret key is present. */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  if (!stripeClient) {
    stripeClient = new Stripe(key)
  }
  return stripeClient
}
