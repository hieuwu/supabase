import { useParams } from 'common'
import { BASE_PATH } from 'lib/constants'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Button, IconExternalLink, Radio, SidePanel } from 'ui'

export interface SpendCapSidePanelProps {
  visible: boolean
  onClose: () => void
}

const SpendCapSidePanel = ({ visible, onClose }: SpendCapSidePanelProps) => {
  const { ref: projectRef } = useParams()
  const [selectedOption, setSelectedOption] = useState()

  return (
    <SidePanel
      size="large"
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
              <div className="col-span-4 group space-y-1">
                <div
                  className="relative cursor-pointer rounded-xl transition border border-transparent group-hover:border-scale-1100"
                  style={{ aspectRatio: ' 160/96' }}
                >
                  <Image
                    layout="fill"
                    objectFit="contain"
                    src={`${BASE_PATH}/img/spend-cap-on.svg`}
                  />
                </div>
                <p className="text-sm text-scale-1000 group-hover:text-scale-1200 transition">
                  Spend cap on
                </p>
              </div>
              <div className="col-span-4 group space-y-1">
                <div
                  className="relative cursor-pointer rounded-xl transition border border-transparent group-hover:border-scale-1100"
                  style={{ aspectRatio: ' 160/96' }}
                >
                  <Image
                    layout="fill"
                    objectFit="contain"
                    src={`${BASE_PATH}/img/spend-cap-off.svg`}
                  />
                </div>
                <p className="text-sm text-scale-1000 group-hover:text-scale-1200 transition">
                  Spend cap off
                </p>
              </div>
            </div>
          </div>
        </div>
      </SidePanel.Content>
    </SidePanel>
  )
}

export default SpendCapSidePanel
