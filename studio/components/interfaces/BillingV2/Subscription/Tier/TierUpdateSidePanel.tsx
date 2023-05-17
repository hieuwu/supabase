import clsx from 'clsx'
import { useParams } from 'common'
import { useProjectSubscriptionV2Query } from 'data/subscriptions/project-subscription-v2-query'
import { useFlag } from 'hooks'
import { PRICING_TIER_PRODUCT_IDS } from 'lib/constants'
import { Button, IconCheck, SidePanel } from 'ui'
import EnterpriseCard from './EnterpriseCard'
import { PRICING_META } from './Tier.constants'

export interface TierUpdateSidePanelProps {
  visible: boolean
  onClose: () => void
}

const TierUpdateSidePanel = ({ visible, onClose }: TierUpdateSidePanelProps) => {
  const { ref: projectRef } = useParams()
  const { data: subscription, isLoading } = useProjectSubscriptionV2Query({ projectRef })

  const userIsOnTeamTier = subscription?.tier?.supabase_prod_id === PRICING_TIER_PRODUCT_IDS.TEAM
  const teamTierEnabled = useFlag('teamTier') || userIsOnTeamTier

  return (
    <SidePanel
      hideFooter
      size="xxlarge"
      visible={visible}
      onCancel={onClose}
      header="Change subscription plan"
    >
      <SidePanel.Content>
        <div className="py-6 grid grid-cols-12 gap-3">
          {Object.values(PRICING_META).map((plan) => {
            const isCurrentPlan =
              subscription?.tier.supabase_prod_id === plan.id ||
              (subscription?.tier.supabase_prod_id === PRICING_TIER_PRODUCT_IDS.PAYG &&
                plan.id === PRICING_TIER_PRODUCT_IDS.PRO)

            if (plan.id === 'tier_team' && !teamTierEnabled) return null
            if (plan.id === 'tier_enterprise') {
              return (
                <EnterpriseCard
                  key={plan.id}
                  plan={plan}
                  isCurrentPlan={isCurrentPlan}
                  isTeamTierEnabled={teamTierEnabled}
                />
              )
            }

            return (
              <div
                key={plan.id}
                className={clsx(
                  'border rounded-md px-4 py-4 flex flex-col items-start justify-between',
                  teamTierEnabled && plan.id === 'tier_enterprise' ? 'col-span-12' : 'col-span-4',
                  plan.id === 'tier_enterprise' ? 'bg-scale-200' : 'bg-scale-300'
                )}
              >
                <div className="w-full">
                  <div className="flex items-center space-x-2">
                    <p className={clsx('text-brand-900 text-sm uppercase')}>{plan.name}</p>
                    {isCurrentPlan ? (
                      <div className="text-xs bg-scale-500 text-scale-1000 rounded px-2 py-0.5">
                        Current plan
                      </div>
                    ) : plan.new ? (
                      <div className="text-xs bg-brand-400 text-brand-900 rounded px-2 py-0.5">
                        New
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="mt-4 flex items-center space-x-1">
                    {(plan.price ?? 0) > 0 && <p className="text-scale-1000 text-sm">From</p>}
                    <p className="text-scale-1200 text-lg">${plan.price}</p>
                    <p className="text-scale-1000 text-sm">per month</p>
                  </div>
                  <div
                    className={clsx(
                      'flex mt-1 mb-4',
                      plan.id !== PRICING_TIER_PRODUCT_IDS.TEAM && 'opacity-0'
                    )}
                  >
                    <div className="text-xs bg-brand-400 text-brand-900 rounded px-2 py-0.5">
                      Usage based plan
                    </div>
                  </div>
                  {isCurrentPlan ? (
                    <Button block disabled type="default">
                      Current plan
                    </Button>
                  ) : (
                    <Button block type="primary" loading={isLoading} disabled={isLoading}>
                      {subscription?.tier.supabase_prod_id !== PRICING_TIER_PRODUCT_IDS.FREE &&
                      plan.id === PRICING_TIER_PRODUCT_IDS.FREE
                        ? 'Downgrade'
                        : 'Upgrade'}{' '}
                      to {plan.name}
                    </Button>
                  )}

                  <div className="border-t my-6" />

                  <ul role="list">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex py-2">
                        <div className="w-[12px]">
                          <IconCheck
                            className="h-3 w-3 text-brand-900 translate-y-[2.5px]"
                            aria-hidden="true"
                            strokeWidth={3}
                          />
                        </div>
                        <p className="ml-3 text-xs text-scale-1100">{feature}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.footer && (
                  <div className="border-t pt-4 mt-4">
                    <p className="text-scale-1000 text-xs">{plan.footer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </SidePanel.Content>
    </SidePanel>
  )
}

export default TierUpdateSidePanel
