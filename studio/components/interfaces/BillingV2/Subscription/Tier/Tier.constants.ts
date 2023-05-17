// Brought over from Plans.Constants.ts but ideally put in common folder (packages/data)

import { STRIPE_PRODUCT_IDS } from 'lib/constants'

export interface PricingInformation {
  id: string
  new: boolean
  name: string
  price?: number
  preface?: string
  features: string[]
  footer?: string
}

export const PRICING_META = [
  {
    id: 'tier_free',
    new: false,
    name: 'Free',
    price: 0,
    preface: undefined,
    features: [
      'Unlimited API requests',
      '500MB database size',
      '1GB file storage size',
      '2GB bandwidth',
      '50MB storage uploads',
      'Social auth Providers',
      '50K MAUs',
      '500K edge function invocations',
      '1 day log retention',
      'Community support',
    ],
    footer: undefined,
  },
  {
    id: 'tier_pro',
    new: false,
    name: 'Pro',
    price: 25,
    preface: undefined,
    features: [
      'Unlimited API requests',
      '8GB database size included',
      '100GB file storage size included',
      '50GB bandwidth included',
      '5GB storage uploads included',
      'Social auth Providers',
      '100K MAUs included',
      '2M edge function invocations',
      'Daily backups',
      '7 day log retention',
      'No project pausing',
      'Email support',
    ],
    footer:
      'Your cost control settings determine if you wish to pay for anything more than the above.',
  },
  {
    id: 'tier_team',
    new: true,
    name: 'Team',
    price: 599,
    preface: 'Everything in Pro, plus:',
    features: [
      'Read only member role',
      'Billing only member role',
      'Standardised security questionnaire',
      'SOC2',
      'HIPAA (Coming soon)',
      'SSO for Supabase Dashboard',
      'Priority email support & SLAs',
      '14 day daily backups',
      '28 day log retention',
    ],
    footer:
      'Your cost control settings determine if you wish to pay for anything more than the above.',
  },
  {
    id: 'tier_enterprise',
    new: false,
    name: 'Enterprise',
    price: undefined,
    preface: 'For large-scale applications managing serious workloads',
    features: [`Designated Support manager & SLAs`, `SSO/ SAML`, `Custom contracts & invoicing`],
    footer: undefined,
  },
]
