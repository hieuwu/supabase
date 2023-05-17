import clsx from 'clsx'
import { useParams } from 'common'
import { useProjectAddonRemoveMutation } from 'data/subscriptions/project-addon-remove-mutation'
import { useProjectAddonUpdateMutation } from 'data/subscriptions/project-addon-update-mutation'
import { useProjectAddonsQuery } from 'data/subscriptions/project-addons-query'
import { useStore } from 'hooks'
import { BASE_PATH, PROJECT_STATUS } from 'lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Alert, Button, IconExternalLink, Modal, Radio, SidePanel } from 'ui'

export interface ComputeInstanceSidePanelProps {
  visible: boolean
  onClose: () => void
}

const COMPUTE_CATEGORY_OPTIONS: { id: 'micro' | 'optimized'; name: string; imageUrl: string }[] = [
  { id: 'micro', name: 'Micro Compute', imageUrl: `${BASE_PATH}/img/optimized-compute-off.svg` },
  {
    id: 'optimized',
    name: 'Optimized Compute',
    imageUrl: `${BASE_PATH}/img/optimized-compute-on.svg`,
  },
]

const ComputeInstanceSidePanel = ({ visible, onClose }: ComputeInstanceSidePanelProps) => {
  const { ui, app } = useStore()
  const router = useRouter()
  const { ref: projectRef } = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<'micro' | 'optimized'>('micro')
  const [selectedOption, setSelectedOption] = useState<string>('ci_micro')
  const { data: addons, isLoading } = useProjectAddonsQuery({ projectRef })
  const { mutateAsync: updateAddon } = useProjectAddonUpdateMutation()
  const { mutateAsync: removeAddon } = useProjectAddonRemoveMutation()

  const projectId = ui.selectedProject?.id
  const selectedAddons = addons?.selected_addons ?? []
  const availableAddons = addons?.available_addons ?? []

  const subscriptionCompute = selectedAddons.find((addon) => addon.type === 'compute_instance')
  const availableOptions =
    availableAddons.find((addon) => addon.type === 'compute_instance')?.variants ?? []
  const selectedCompute = availableOptions.find((option) => option.identifier === selectedOption)
  const hasChanges = selectedOption !== (subscriptionCompute?.variant.identifier ?? 'ci_micro')

  useEffect(() => {
    if (visible) {
      if (subscriptionCompute !== undefined) {
        setSelectedCategory('optimized')
        setSelectedOption(subscriptionCompute.variant.identifier)
      } else {
        setSelectedCategory('micro')
        setSelectedOption('ci_micro')
      }
    }
  }, [visible, isLoading])

  const onConfirmUpdateComputeInstance = async () => {
    if (!projectRef) return console.error('Project ref is required')
    if (!projectId) return console.error('Project ID is required')

    try {
      setIsSubmitting(true)

      if (selectedOption === 'ci_micro' && subscriptionCompute !== undefined) {
        await removeAddon({ projectRef, variant: subscriptionCompute.variant.identifier })
      } else {
        await updateAddon({ projectRef, type: 'compute_instance', variant: selectedOption })
      }

      ui.setNotification({
        duration: 8000,
        category: 'success',
        message: `Successfully updated compute instance to ${selectedCompute?.name}. Your project is currently being restarted to update its instance`,
      })
      app.onProjectStatusUpdated(projectId, PROJECT_STATUS.RESTORING)
      router.push(`/project/${projectRef}`)
    } catch (error: any) {
      ui.setNotification({
        error,
        category: 'error',
        message: `Unable to update compute instance: ${error.message}`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <SidePanel
        size="xxlarge"
        visible={visible}
        onCancel={onClose}
        onConfirm={() => setShowConfirmationModal(true)}
        loading={isLoading}
        disabled={isLoading || !hasChanges}
        header={
          <div className="flex items-center justify-between">
            <h4>Change project compute size</h4>
            <Link href="https://supabase.com/docs/guides/platform/compute-add-ons">
              <a target="_blank" rel="noreferrer">
                <Button type="default" icon={<IconExternalLink strokeWidth={1.5} />}>
                  About compute sizes
                </Button>
              </a>
            </Link>
          </div>
        }
      >
        <SidePanel.Content>
          <div className="py-6 space-y-4">
            <p className="text-sm">
              For the database, compute size refers to the amount of CPU and memory allocated to the
              database instance.
            </p>

            <Alert
              withIcon
              variant="info"
              title="Your project will need to be restarted when changing it's compute size"
            >
              It will take up to 2 minutes for changes to take place, in which your project will be
              unavailable during that time.
            </Alert>

            <div className="!mt-8 pb-4">
              <div className="grid grid-cols-12 gap-3">
                {COMPUTE_CATEGORY_OPTIONS.map((option) => {
                  const isSelected = selectedCategory === option.id
                  return (
                    <div
                      key={option.id}
                      className="col-span-3 group space-y-1"
                      onClick={() => {
                        setSelectedCategory(option.id)
                        if (option.id === 'micro') setSelectedOption('ci_micro')
                      }}
                    >
                      <div
                        style={{ aspectRatio: ' 160/96' }}
                        className={clsx(
                          'relative cursor-pointer rounded-xl transition border',
                          isSelected
                            ? 'border-scale-1200'
                            : 'border-transparent opacity-50 group-hover:opacity-100 group-hover:border-scale-1000'
                        )}
                      >
                        <Image layout="fill" objectFit="contain" src={option.imageUrl} />
                      </div>
                      <p
                        className={clsx(
                          'text-sm transition',
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

            {selectedCategory === 'optimized' && (
              <div className="pb-4">
                <Radio.Group
                  type="large-cards"
                  size="tiny"
                  id="compute-instance"
                  label={<p className="text-sm">Choose the compute size you want to use</p>}
                  onChange={(event: any) => setSelectedOption(event.target.value)}
                >
                  {availableOptions.map((option) => (
                    <Radio
                      className="col-span-3 !p-0"
                      name="compute-instance"
                      key={option.identifier}
                      checked={selectedOption === option.identifier}
                      label={option.name}
                      value={option.identifier}
                    >
                      <div className="w-full group">
                        <div className="border-b border-scale-500 px-4 py-2 group-hover:border-scale-600">
                          {/* [JOSHEN TODO] Remove this */}
                          <p className="text-sm">{option.name.split('Compute Instance')[0]}</p>
                        </div>
                        <div className="px-4 py-2">
                          <p className="text-scale-1000">{option.meta?.memory_gb ?? 0} GB</p>
                          <p className="text-scale-1000">
                            {option.meta?.cpu_cores ?? 0}-core ARM CPU (
                            {option.meta?.cpu_dedicated ? 'Dedicated' : 'Shared'})
                          </p>
                          <div className="flex items-center space-x-1 mt-2">
                            <p className="text-scale-1200 text-sm">
                              ${option.price.toLocaleString()}
                            </p>
                            <p className="text-scale-1000 translate-y-[1px]"> / month</p>
                          </div>
                        </div>
                      </div>
                    </Radio>
                  ))}
                </Radio.Group>
              </div>
            )}

            {selectedCategory === 'micro' && (
              <p className="text-sm text-scale-1100">
                Your database will use the standard Micro size instance of 1-core ARM CPU (Shared)
                with 500MB of memory.
              </p>
            )}

            {hasChanges && (
              <p className="text-sm text-scale-1100">
                Upon clicking confirm, the amount of{' '}
                <span className="text-scale-1200">${selectedCompute?.price.toLocaleString()}</span>{' '}
                will be added to your invoice and your credit card will be charged immediately.
              </p>
            )}
          </div>
        </SidePanel.Content>
      </SidePanel>

      <Modal
        size="medium"
        alignFooter="right"
        visible={showConfirmationModal}
        loading={isSubmitting}
        onCancel={() => setShowConfirmationModal(false)}
        onConfirm={() => onConfirmUpdateComputeInstance()}
        header="Confirm to upgrade compute instance now"
      >
        <Modal.Content>
          <div className="py-6">
            <Alert
              withIcon
              variant="warning"
              title="Your project will need to be restarted when changing it's compute size"
            >
              It will take up to 2 minutes for changes to take place, in which your project will be
              unavailable during that time.
            </Alert>
          </div>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default ComputeInstanceSidePanel
