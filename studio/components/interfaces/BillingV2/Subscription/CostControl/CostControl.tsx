import { useParams } from 'common'
import ShimmeringLoader from 'components/ui/ShimmeringLoader'
import { useProjectSubscriptionV2Query } from 'data/subscriptions/project-subscription-v2-query'
import { BASE_PATH, PRICING_TIER_PRODUCT_IDS } from 'lib/constants'
import Image from 'next/image'
import { useSubscriptionPageStateSnapshot } from 'state/subscription-page'
import { Alert, Button } from 'ui'
import SpendCapSidePanel from './SpendCapSidePanel'

export interface CostControlProps {}

const CostControl = ({}: CostControlProps) => {
  const { ref: projectRef } = useParams()

  const snap = useSubscriptionPageStateSnapshot()
  const { data: subscription, isLoading } = useProjectSubscriptionV2Query({ projectRef })

  const currentTier = subscription?.tier?.supabase_prod_id ?? ''
  const isUsageBillingEnabled = subscription?.usage_billing_enabled ?? false

  const canChangeTier = ![
    PRICING_TIER_PRODUCT_IDS.TEAM,
    PRICING_TIER_PRODUCT_IDS.ENTERPRISE,
  ].includes(currentTier)

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5">
          <div className="sticky top-16">
            <p className="text-base">Cost control</p>
            <p className="text-sm text-scale-1000">Some description text here</p>
          </div>
        </div>
        {isLoading ? (
          <div className="col-span-12 lg:col-span-7 space-y-2">
            <ShimmeringLoader />
            <ShimmeringLoader className="w-3/4" />
            <ShimmeringLoader className="w-1/2" />
          </div>
        ) : (
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <p className="text-sm text-scale-1000">
              You can control whether your project is charged for additional usage beyond the
              included quota of your subscription plan. If you need to go beyond the included quota,
              simply switch off your spend cap to pay for additional usage.
            </p>

            {currentTier === PRICING_TIER_PRODUCT_IDS.FREE && (
              <Alert
                withIcon
                variant="info"
                title="You will need to be on the Pro tier to disable spend caps"
              >
                Spend cap is enabled by default on the Free tier. While your project will not be
                charged any extra for usage, your project will experience downtime if you exceed the
                included quota
              </Alert>
            )}

            {currentTier === PRICING_TIER_PRODUCT_IDS.TEAM && (
              <Alert
                withIcon
                variant="info"
                title="You will be charged for any additional usage on the Team plan"
              >
                Team plan requires you to have spend cap off at all times. Your project will never
                become unresponsive or be paused. Only when your included usage is exceeded will you
                be charged for any additional usage
              </Alert>
            )}

            <div className="flex space-x-6">
              <div>
                <div className="rounded-md w-[160px] h-[96px] shadow">
                  <Image
                    width={160}
                    height={96}
                    src={
                      isUsageBillingEnabled
                        ? `${BASE_PATH}/img/spend-cap-off.svg`
                        : `${BASE_PATH}/img/spend-cap-on.svg`
                    }
                  />
                </div>
              </div>
              <div>
                <p className="mb-1">
                  Spend cap is {isUsageBillingEnabled ? 'disabled' : 'enabled'}
                </p>
                <p className="text-sm text-scale-1000">
                  {isUsageBillingEnabled
                    ? 'You will be charged for any usage above the included quota'
                    : 'You will never be charged any extra for usage. However, your project could become unresponsive, enter read only mode, or be paused if you exceed the included quota'}
                </p>
                {isUsageBillingEnabled && (
                  <p className="text-sm text-scale-1000 mt-1">
                    Your project will never become unresponsive or be paused. Only when your usage
                    reaches the quota limit will you be charged for any excess usage.
                  </p>
                )}
                <Button
                  type="default"
                  className="mt-4"
                  disabled={!canChangeTier}
                  onClick={() => snap.setPanelKey('costControl')}
                >
                  Change spend cap
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <SpendCapSidePanel />
    </>
  )
}

export default CostControl
