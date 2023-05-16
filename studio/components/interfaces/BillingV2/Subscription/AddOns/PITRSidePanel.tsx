import { useParams } from 'common'
import { useProjectAddonsQuery } from 'data/subscriptions/project-addons-query'
import Link from 'next/link'
import { useState } from 'react'
import { Alert, Button, IconExternalLink, Radio, SidePanel } from 'ui'

export interface PITRSidePanelProps {
  visible: boolean
  onClose: () => void
}

const PITRSidePanel = ({ visible, onClose }: PITRSidePanelProps) => {
  const { ref: projectRef } = useParams()
  const [selectedOption, setSelectedOption] = useState()
  const { data: addons, isLoading } = useProjectAddonsQuery({ projectRef })

  const selectedCompute = (addons?.selected_addons ?? []).find(
    (addon) => addon.type === 'compute_instance'
  )
  const availableOptions =
    (addons?.available_addons ?? []).find((addon) => addon.type === 'pitr')?.variants ?? []

  return (
    <SidePanel
      size="xxlarge"
      visible={visible}
      onCancel={onClose}
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

          {selectedCompute === undefined ? (
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
            >
              <Radio
                disabled={selectedCompute === undefined}
                name="pitr"
                className="col-span-3"
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
                  disabled={selectedCompute === undefined}
                  className="col-span-3"
                  name="pitr"
                  key={option.identifier}
                  label={<span className="text-sm">{option.name}</span>}
                  value={option.identifier}
                  afterLabel={
                    <div>
                      <p className="text-scale-1000">
                        Allow database restorations to any time up to{' '}
                        {option.identifier.split('_')[1]} days ago
                      </p>
                    </div>
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

export default PITRSidePanel
