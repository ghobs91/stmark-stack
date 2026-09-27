export const DONATION_FUNDS = [
  { value: 'general', label: 'General Operating Fund' },
  { value: 'building', label: 'Building Fund' },
  { value: 'kitchen', label: 'Kitchen & Charity Services' },
] as const

export type DonationFund = (typeof DONATION_FUNDS)[number]['value']

export const isDonationFund = (value: unknown): value is DonationFund =>
  typeof value === 'string' && DONATION_FUNDS.some((fund) => fund.value === value)

export const MIN_DONATION_AMOUNT = 1
export const MAX_DONATION_AMOUNT = 25_000
