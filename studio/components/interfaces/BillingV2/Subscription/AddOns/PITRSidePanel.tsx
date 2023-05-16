import { useParams } from 'common'
import { useProjectAddonRemoveMutation } from 'data/subscriptions/project-addon-remove-mutation'
import { useProjectAddonUpdateMutation } from 'data/subscriptions/project-addon-update-mutation'
import { useProjectAddonsQuery } from 'data/subscriptions/project-addons-query'
import { useStore } from 'hooks'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Alert, Button, IconExternalLink, Radio, SidePanel } from 'ui'

export interface PITRSidePanelProps {
  visible: boolean
  onClose: () => void
}

const PITRSidePanel = ({ visible, onClose }: PITRSidePanelProps) => {
  const { ui } = useStore()
  const { ref: projectRef } = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string>('pitr_0')
  const { data: addons, isLoading } = useProjectAddonsQuery({ projectRef })
  const { mutateAsync: updateAddon } = useProjectAddonUpdateMutation()
  const { mutateAsync: removeAddon } = useProjectAddonRemoveMutation()

  const selectedAddons = addons?.selected_addons ?? []
  const availableAddons = addons?.available_addons ?? []

  const subscriptionCompute = selectedAddons.find((addon) => addon.type === 'compute_instance')
  const subscriptionPitr = selectedAddons.find((addon) => addon.type === 'pitr')
  const availableOptions = availableAddons.find((addon) => addon.type === 'pitr')?.variants ?? []

  const hasChanges = selectedOption !== (subscriptionPitr?.variant.identifier ?? 'pitr_0')
  const selectedPitr = availableOptions.find((option) => option.identifier === selectedOption)

  useEffect(() => {
    if (visible) {
      if (subscriptionPitr !== undefined) {
        setSelectedOption(subscriptionPitr.variant.identifier)
      } else {
        setSelectedOption('pitr_0')
      }
    }
  }, [visible, isLoading])

  const onConfirm = async () => {
    if (!projectRef) return console.error('Project ref is required')

    try {
      setIsSubmitting(true)

      if (selectedOption === 'pitr_0' && subscriptionPitr !== undefined) {
        await removeAddon({ projectRef, variant: subscriptionPitr.variant.identifier })
      } else {
        await updateAddon({ projectRef, type: 'pitr', variant: selectedOption })
      }

      ui.setNotification({
        category: 'success',
        message: `Successfully ${
          selectedOption === 'pitr_0' ? 'disabled' : 'updated'
        } point in time recovery duration`,
      })
      onClose()
    } catch (error: any) {
      ui.setNotification({
        error,
        category: 'error',
        message: `Unable to update PITR: ${error.message}`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SidePanel
      size="xxlarge"
      visible={visible}
      onCancel={onClose}
      onConfirm={onConfirm}
      loading={isLoading || isSubmitting}
      disabled={isLoading || !hasChanges || isSubmitting}
      header={
        <div className="flex items-center justify-between">
          <h4>Point in Time Recovery</h4>
          <Link href="https://supabase.com/docs/guides/platform/backups#point-in-time-recovery">
            <a target="_blank" rel="noreferrer">
              <Button type="default" icon={<IconExternalLink strokeWidth={1.5} />}>
                About point in time recovery
              </Button>
            </a>
          </Link>
        </div>
      }
    >
      <SidePanel.Content>
        <div className="py-6 space-y-4">
          <p className="text-sm">
            Point-in-Time Recovery (PITR) allows a project to be backed up at much shorter
            intervals. This provides users an option to restore to any chosen point of up to seconds
            in granularity.
          </p>

          {subscriptionCompute === undefined ? (
            <Alert
              withIcon
              variant="warning"
              title="Your project is required to minimally be on a Small Add-on to enable PITR"
            >
              This is to ensure that your project has enough resources to execute PITR successfully
            </Alert>
          ) : (
            <p className="text-sm">
              Your project can be upgraded to use point in time recovery for the following different
              durations.
            </p>
          )}

          <div className="!mt-8 pb-4">
            <Radio.Group
              type="large-cards"
              size="tiny"
              id="pitr"
              label="Choose the duration for point in time recovery that you want"
              onChange={(event: any) => setSelectedOption(event.target.value)}
            >
              <Radio
                disabled={subscriptionCompute === undefined}
                name="pitr"
                className="col-span-3"
                checked={selectedOption === 'pitr_0'}
                label={<span className="text-sm">No point in time recovery</span>}
                value="pitr_0"
                description={
                  <div className="flex items-center space-x-1">
                    <p className="text-scale-1200 text-sm">$0</p>
                    <p className="text-scale-1000 translate-y-[1px]">/ month</p>
                  </div>
                }
              />
              {availableOptions.map((option) => (
                <Radio
                  disabled={subscriptionCompute === undefined}
                  className="col-span-3"
                  name="pitr"
                  key={option.identifier}
                  checked={selectedOption === option.identifier}
                  label={<span className="text-sm">{option.name}</span>}
                  value={option.identifier}
                  afterLabel={
                    <p className="text-scale-1000">
                      Allow database restorations to any time up to{' '}
                      {option.identifier.split('_')[1]} days ago
                    </p>
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
                {selectedOption === 'pitr_0' ||
                (selectedPitr?.price ?? 0) < (subscriptionPitr?.variant.price ?? 0)
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

export default PITRSidePanel
