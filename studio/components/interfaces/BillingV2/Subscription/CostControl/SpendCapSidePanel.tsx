import clsx from 'clsx'
import { useParams } from 'common'
import { BASE_PATH, PRICING_TIER_PRODUCT_IDS } from 'lib/constants'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Alert, Button, IconExternalLink, SidePanel } from 'ui'
import { useProjectSubscriptionV2Query } from 'data/subscriptions/project-subscription-v2-query'

export interface SpendCapSidePanelProps {
  visible: boolean
  onClose: () => void
}

const SPEND_CAP_OPTIONS: { name: string; value: 'on' | 'off'; imageUrl: string }[] = [
  {
    name: 'Spend cap on',
    value: 'on',
    imageUrl: `${BASE_PATH}/img/spend-cap-on.svg`,
  },
  {
    name: 'Spend cap off',
    value: 'off',
    imageUrl: `${BASE_PATH}/img/spend-cap-off.svg`,
  },
]

const SpendCapSidePanel = ({ visible, onClose }: SpendCapSidePanelProps) => {
  const { ref: projectRef } = useParams()
  const [selectedOption, setSelectedOption] = useState<'on' | 'off'>()
  const { data: subscription, isLoading } = useProjectSubscriptionV2Query({ projectRef })

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

  return (
    <SidePanel
      size="large"
      disabled={!hasChanges}
      visible={visible}
      onCancel={onClose}
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
            Supabase offers a "Spend Cap" on each project to manage your usage and costs, which
            determines whether your project can exceed the free quota allowance of any line item in
            a given billing cycle.
          </p>

          <p className="text-sm">
            If you exceed the free quota allowance of a line item, and the Spend Cap is "off", then
            you will be billed for any additional usage on that line item.
          </p>

          <div className="!mt-8 pb-4">
            <div className="grid grid-cols-12 gap-3">
              {SPEND_CAP_OPTIONS.map((option) => {
                const isSelected = selectedOption === option.value

                return (
                  <div
                    key={option.value}
                    className="col-span-4 group space-y-1"
                    onClick={() => setSelectedOption(option.value)}
                  >
                    <div
                      style={{ aspectRatio: ' 160/96' }}
                      className={clsx(
                        'relative cursor-pointer rounded-xl transition border  group-hover:border-scale-1100',
                        isSelected ? 'border-scale-1200' : 'border-transparent'
                      )}
                    >
                      <Image layout="fill" objectFit="contain" src={option.imageUrl} />
                    </div>
                    <p
                      className={clsx(
                        'text-sm group-hover:text-scale-1200 transition',
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

          {isTurningOnCap && (
            <Alert
              withIcon
              variant="warning"
              title="Your project could become unresponsive, enter read only mode, or be paused"
            >
              If you exceed the free quota allowance set out for your subscription tier, then your
              project could become unresponsive
            </Alert>
          )}
        </div>
      </SidePanel.Content>
    </SidePanel>
  )
}

export default SpendCapSidePanel
