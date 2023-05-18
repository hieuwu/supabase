import { useParams } from 'common'
import { useProjectAddonRemoveMutation } from 'data/subscriptions/project-addon-remove-mutation'
import { useProjectAddonUpdateMutation } from 'data/subscriptions/project-addon-update-mutation'
import { useProjectAddonsQuery } from 'data/subscriptions/project-addons-query'
import { useStore } from 'hooks'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSubscriptionPageStateSnapshot } from 'state/subscription-page'
import { Button, IconExternalLink, Radio, SidePanel } from 'ui'

const CustomDomainSidePanel = () => {
  const { ui } = useStore()
  const { ref: projectRef } = useParams()

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<string>('cd_none')

  const snap = useSubscriptionPageStateSnapshot()
  const visible = snap.panelKey === 'customDomain'
  const onClose = () => snap.setPanelKey(undefined)

  const { data: addons, isLoading } = useProjectAddonsQuery({ projectRef })
  const { mutateAsync: updateAddon } = useProjectAddonUpdateMutation()
  const { mutateAsync: removeAddon } = useProjectAddonRemoveMutation()

  const subscriptionCDOption = (addons?.selected_addons ?? []).find(
    (addon) => addon.type === 'custom_domain'
  )
  const availableOptions =
    (addons?.available_addons ?? []).find((addon) => addon.type === 'custom_domain')?.variants ?? []

  const hasChanges = selectedOption !== (subscriptionCDOption?.variant.identifier ?? 'cd_none')

  useEffect(() => {
    if (visible) {
      if (subscriptionCDOption !== undefined) {
        setSelectedOption(subscriptionCDOption.variant.identifier)
      } else {
        setSelectedOption('cd_none')
      }
    }
  }, [visible, isLoading])

  const onConfirm = async () => {
    if (!projectRef) return console.error('Project ref is required')

    try {
      setIsSubmitting(true)

      if (selectedOption === 'cd_none' && subscriptionCDOption !== undefined) {
        await removeAddon({ projectRef, variant: subscriptionCDOption.variant.identifier })
      } else {
        await updateAddon({ projectRef, type: 'custom_domain', variant: selectedOption })
      }

      ui.setNotification({
        category: 'success',
        message: `Successfully ${
          selectedOption === 'cd_none' ? 'disabled' : 'enabled'
        } custom domain`,
      })
      onClose()
    } catch (error: any) {
      ui.setNotification({
        error,
        category: 'error',
        message: `Unable to update custom domain: ${error.message}`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SidePanel
      size="large"
      visible={visible}
      onCancel={onClose}
      onConfirm={onConfirm}
      loading={isLoading || isSubmitting}
      disabled={isLoading || !hasChanges || isSubmitting}
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
            <Radio.Group
              type="large-cards"
              size="tiny"
              id="custom-domain"
              onChange={(event: any) => setSelectedOption(event.target.value)}
            >
              <Radio
                name="custom-domain"
                checked={selectedOption === 'cd_none'}
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
                  checked={selectedOption === option.identifier}
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

          {hasChanges && (
            <>
              <p className="text-sm">
                {selectedOption === 'cd_none'
                  ? 'Upon clicking confirm, the amount of $XX (pro-rated) will be returned as credits that can be used for subsequent billing cycles'
                  : 'Upon clicking confirm, the amount of $XX will be added to your invoice and your credit card will be charged immediately'}
              </p>
            </>
          )}
        </div>
      </SidePanel.Content>
    </SidePanel>
  )
}

export default CustomDomainSidePanel
