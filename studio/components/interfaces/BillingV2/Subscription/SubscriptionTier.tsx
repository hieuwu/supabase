import { useParams } from 'common'
import ShimmeringLoader from 'components/ui/ShimmeringLoader'
import SparkBar from 'components/ui/SparkBar'
import { useProjectSubscriptionV2Query } from 'data/subscriptions/project-subscription-v2-query'
import dayjs from 'dayjs'
import { PRICING_TIER_PRODUCT_IDS } from 'lib/constants'
import Link from 'next/link'
import { Button, IconAlertCircle } from 'ui'

export interface SubscriptionTierProps {}

const SubscriptionTier = ({}: SubscriptionTierProps) => {
  const { ref: projectRef } = useParams()
  const { data: subscription, isLoading } = useProjectSubscriptionV2Query({ projectRef })

  const currentTier = subscription?.tier?.supabase_prod_id ?? ''
  const tierName =
    currentTier === PRICING_TIER_PRODUCT_IDS.FREE
      ? 'Free'
      : currentTier === PRICING_TIER_PRODUCT_IDS.PRO
      ? 'Pro'
      : currentTier === PRICING_TIER_PRODUCT_IDS.PAYG
      ? 'Pro'
      : currentTier === PRICING_TIER_PRODUCT_IDS.TEAM
      ? 'Team'
      : currentTier === PRICING_TIER_PRODUCT_IDS.ENTERPRISE
      ? 'Enterprise'
      : 'Unknown'

  const billingCycleStart = dayjs.unix(subscription?.current_period_start ?? 0).utc()
  const billingCycleEnd = dayjs.unix(subscription?.current_period_end ?? 0).utc()
  const daysToCycleEnd = billingCycleEnd.diff(dayjs(), 'days')
  const daysWithinCycle = billingCycleEnd.diff(billingCycleStart, 'days')

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-5">
        <p className="text-base sticky top-16">Subscription tier</p>
      </div>
      {isLoading ? (
        <div className="col-span-7 space-y-2">
          <ShimmeringLoader />
          <ShimmeringLoader className="w-3/4" />
          <ShimmeringLoader className="w-1/2" />
        </div>
      ) : (
        <div className="col-span-7 space-y-6">
          <div>
            <p className="text-sm">This project is currently on the tier:</p>
            <p className="text-2xl text-brand-900 uppercase">{tierName}</p>
          </div>
          <div>
            <Link href={`/project/${projectRef}/settings/billing/update`}>
              <a>
                <Button type="default">Change subscription plan</Button>
              </a>
            </Link>
          </div>
          {[PRICING_TIER_PRODUCT_IDS.FREE, PRICING_TIER_PRODUCT_IDS.PRO].includes(currentTier) && (
            <div className="w-full bg-scale-100 px-6 py-4 rounded-md flex space-x-4">
              <div>
                <IconAlertCircle strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm">This project is limited by the included usage</p>
                <p className="text-sm text-scale-1000">
                  When this project exceeds its included usage quotas, it may become unresponsive.
                  {currentTier === PRICING_TIER_PRODUCT_IDS.FREE
                    ? 'If you wish to exceed the included usage, it is advised you upgrade to a paid plan.'
                    : 'You can change the Cost Control settings if you plan on exceeding the included usage quotas.'}
                </p>
              </div>
            </div>
          )}
          <SparkBar
            type="horizontal"
            value={daysWithinCycle - daysToCycleEnd}
            max={daysWithinCycle}
            barClass="bg-scale-1100"
            labelBottom={`Current billing cycle (${billingCycleStart.format(
              'MMM DD'
            )} - ${billingCycleEnd.format('MMM DD')})`}
            labelBottomClass="!text-scale-1000 pb-1"
            labelTop={`${daysToCycleEnd} Days left`}
          />
        </div>
      )}
    </div>
  )
}

export default SubscriptionTier
