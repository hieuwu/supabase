import { useParams } from 'common'
import { useProjectAddonsQuery } from 'data/subscriptions/project-addons-query'
import Link from 'next/link'
import { useState } from 'react'
import { Button, IconExternalLink, Radio, SidePanel } from 'ui'

export interface CustomDomainSidePanelProps {
  visible: boolean
  onClose: () => void
}

const CustomDomainSidePanel = ({ visible, onClose }: CustomDomainSidePanelProps) => {
  const { ref: projectRef } = useParams()
  const [selectedOption, setSelectedOption] = useState()
  const { data: addons, isLoading } = useProjectAddonsQuery({ projectRef })

  const availableOptions =
    (addons?.available_addons ?? []).find((addon) => addon.type === 'custom_domain')?.variants ?? []

  return (
    <SidePanel
      size="large"
      visible={visible}
      onCancel={onClose}
      header={
        <div className="flex items-center justify-between">
          <h4>Custom domains</h4>
          <Link href="https://supabase.com/docs/guides/platform/custom-domains">
            <a target="_blank" rel="noreferrer">
              <Button type="default" icon={<IconExternalLink strokeWidth={1.5} />}>
                About custom domains
              </Button>
            </a>
          </Link>
        </div>
      }
    >
      <SidePanel.Content>
        <div className="py-6 space-y-4">
          <p className="text-sm">
            Custom domains allow you to present a branded experience to your users. You may set up
            your custom domain in the{' '}
            <Link href={`/project/${projectRef}/settings/general`}>
              <a className="text-brand-900">General Settings</a>
            </Link>{' '}
            page after enabling the add-on.
          </p>

          <p className="text-sm">Your project can be upgraded to enable custom domains.</p>

          <div className="!mt-8 pb-4">
            <Radio.Group type="large-cards" size="tiny" id="custom-domain">
              <Radio
                name="custom-domain"
                className="col-span-4"
                label={<span className="text-sm">No custom domain</span>}
                value="cd_none"
                description={
                  <div className="flex items-center space-x-1">
                    <p className="text-scale-1200 text-sm">$0</p>
                    <p className="text-scale-1000 translate-y-[1px]">/ month</p>
                  </div>
                }
              />
              {availableOptions.map((option) => (
                <Radio
                  className="col-span-4"
                  name="custom-domain"
                  key={option.identifier}
                  label={<span className="text-sm">{option.name}</span>}
                  value={option.identifier}
                  afterLabel={
                    <p className="text-scale-1000">Present a branded experience to your users</p>
                  }
                  description={
                    <div className="flex items-center space-x-1">
                      <p className="text-scale-1200 text-sm">${option.price}</p>
                      <p className="text-scale-1000 translate-y-[1px]"> / month</p>
                    </div>
                  }
                />
              ))}
            </Radio.Group>
          </div>

          <p className="text-sm">
            Upon clicking confirm, the amount of $XX will be added to your invoice and your credit
            card will be charged immediately.
          </p>
        </div>
      </SidePanel.Content>
    </SidePanel>
  )
}

export default CustomDomainSidePanel
