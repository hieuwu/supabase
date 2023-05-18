import clsx from 'clsx'
import { useParams } from 'common'
import { useProjectSubscriptionUpdateMutation } from 'data/subscriptions/project-subscription-update-mutation'
import { useProjectSubscriptionV2Query } from 'data/subscriptions/project-subscription-v2-query'
import { useStore } from 'hooks'
import { BASE_PATH, PRICING_TIER_PRODUCT_IDS } from 'lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSubscriptionPageStateSnapshot } from 'state/subscription-page'
import { Alert, Button, IconExternalLink, SidePanel } from 'ui'

const SPEND_CAP_OPTIONS: { name: string; value: 'on' | 'off'; imageUrl: string }[] = [
  {
    name: 'Spend cap enabled',
    value: 'on',
    imageUrl: `${BASE_PATH}/img/spend-cap-on.svg`,
  },
  {
    name: 'Spend cap disabled',
    value: 'off',
    imageUrl: `${BASE_PATH}/img/spend-cap-off.svg`,
  },
]

const SpendCapSidePanel = () => {
  const { ui } = useStore()
  const { ref: projectRef } = useParams()

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<'on' | 'off'>()

  const snap = useSubscriptionPageStateSnapshot()
  const visible = snap.panelKey === 'costControl'
  const onClose = () => snap.setPanelKey(undefined)

  const { data: subscription, isLoading } = useProjectSubscriptionV2Query({ projectRef })
  const { mutateAsync: updateSubscriptionTier } = useProjectSubscriptionUpdateMutation()

  const isFreePlan = subscription?.tier.supabase_prod_id === PRICING_TIER_PRODUCT_IDS.FREE
  const isSpendCapOn = [PRICING_TIER_PRODUCT_IDS.FREE, PRICING_TIER_PRODUCT_IDS.PRO].includes(
    subscription?.tier?.supabase_prod_id ?? ''
  )
  const isTurningOnCap = !isSpendCapOn && selectedOption === 'on'
  const hasChanges = selectedOption !== (isSpendCapOn ? 'on' : 'off')

  useEffect(() => {
    if (visible && subscription !== undefined) {
      setSelectedOption(isSpendCapOn ? 'on' : 'off')
    }
  }, [visible, isLoading])

  const onConfirm = async () => {
    if (!projectRef) return console.error('Project ref is required')

    try {
      const tier = (
        selectedOption === 'on' ? PRICING_TIER_PRODUCT_IDS.PRO : PRICING_TIER_PRODUCT_IDS.PAYG
      ) as 'tier_pro' | 'tier_payg'
      setIsSubmitting(true)
      await updateSubscriptionTier({ projectRef, tier })
      ui.setNotification({
        category: 'success',
        message: `Successfully ${isTurningOnCap ? 'enabled' : 'disabled'} spend cap`,
      })
      onClose()
    } catch (error: any) {
      ui.setNotification({
        error,
        category: 'error',
        message: `Unable to toggle spend cap: ${error.message}`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SidePanel
      size="large"
      loading={isLoading || isSubmitting}
      disabled={isFreePlan || isLoading || !hasChanges || isSubmitting}
      visible={visible}
      onCancel={onClose}
      onConfirm={onConfirm}
      header={
        <div className="flex items-center justify-between">
          <h4>Spend cap</h4>
          <Link href="https://supabase.com/docs/guides/platform/spend-cap">
            <a target="_blank" rel="noreferrer">
              <Button type="default" icon={<IconExternalLink strokeWidth={1.5} />}>
                About spend cap
              </Button>
            </a>
          </Link>
        </div>
      }
    >
      <SidePanel.Content>
        <div className="py-6 space-y-4">
          <p className="text-sm">
            Use the spend cap to manage project usage and costs, and control whether the project can
            exceed the included quota allowance of any billed line item in a billing cycle
          </p>

          {isFreePlan && (
            <Alert
              withIcon
              variant="info"
              title="Toggling of the spend cap is only available on the Pro plan"
              actions={
                <Button type="default" onClick={() => snap.setPanelKey('subscriptionPlan')}>
                  View available plans
                </Button>
              }
            >
              Upgrade your project's plan to disable the spend cap
            </Alert>
          )}

          <div className="!mt-8 pb-4">
            <div className="grid grid-cols-12 gap-3">
              {SPEND_CAP_OPTIONS.map((option) => {
                const isSelected = selectedOption === option.value

                return (
                  <div
                    key={option.value}
                    className={clsx('col-span-4 group space-y-1', isFreePlan && 'opacity-75')}
                    onClick={() => !isFreePlan && setSelectedOption(option.value)}
                  >
                    <div
                      style={{ aspectRatio: ' 160/96' }}
                      className={clsx(
                        'relative rounded-xl transition border',
                        !isFreePlan ? 'group-hover:border-scale-1100 cursor-pointer' : '',
                        isSelected ? 'border-scale-1200' : 'border-transparent'
                      )}
                    >
                      <Image layout="fill" objectFit="contain" src={option.imageUrl} />
                    </div>
                    <p
                      className={clsx(
                        'text-sm transition',
                        !isFreePlan && 'group-hover:text-scale-1200',
                        isSelected ? 'text-scale-1200' : 'text-scale-1000'
                      )}
                    >
                      {option.name}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {selectedOption === 'on' ? (
            <Alert
              withIcon
              variant="warning"
              title="Your project could become unresponsive, enter read only mode, or be paused"
            >
              Exceeding the included quota allowance with spend cap enabled can cause your project
              to become unresponsive, enter read only mode, or be paused if your project is on free
              tier subscription.
            </Alert>
          ) : (
            <Alert
              withIcon
              variant="info"
              title="Charges apply for usage beyond included quota allowance"
            >
              Your project will always remain responsive and active, and charges only apply when
              exceeding the free quota limit.
            </Alert>
          )}

          {hasChanges && (
            <>
              <p className="text-sm">
                {selectedOption === 'on'
                  ? 'Upon clicking confirm, spend cap will be enabled for your project and you will no longer be charged any extra for usage.'
                  : 'Upon clicking confirm, spend cap will be disabled for your project and you will be charged for any usage above the free quota allowance'}
              </p>
            </>
          )}
        </div>
      </SidePanel.Content>
    </SidePanel>
  )
}

export default SpendCapSidePanel
