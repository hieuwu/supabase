export interface PricingInformation {
  id: string
  new: boolean
  name: string
  preface?: string
  features: string[]
  footer?: string
}

// This only contains the meta information of plans like description and features, prices are from the API
// Also ideally shift this to common folder (e.g packages/data)
export const SUBSCRIPTION_PLANS: PricingInformation[] = [
  {
    id: 'tier_free',
    new: false,
    name: 'Free',
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
    preface: 'For large-scale applications managing serious workloads',
    features: [`Designated Support manager & SLAs`, `SSO/ SAML`, `Custom contracts & invoicing`],
    footer: undefined,
  },
]

export const CANCELLATION_REASONS = [
  'Pricing',
  "My project isn't getting traction",
  'Poor customer service',
  'Missing feature',
  "I didn't see the value",
  "Supabase didn't meet my needs",
  'Dashboard is too complicated',
  'Postgres is too complicated',
  'Problem not solved',
  'Bug issues',
  'I decided to use something else',
  'My work has finished/discontinued',
  'I’m migrating to/starting a new project',
  'None of the above',
]
