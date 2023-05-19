import * as Tooltip from '@radix-ui/react-tooltip'
import { PermissionAction } from '@supabase/shared-types/out/constants'
import { useParams } from 'common'
import { useOrganizationPaymentMethodsQuery } from 'data/organizations/organization-payment-methods-query'
import { checkPermissions, useStore } from 'hooks'
import { BASE_PATH } from 'lib/constants'
import { getURL } from 'lib/helpers'
import { useSubscriptionPageStateSnapshot } from 'state/subscription-page'
import { Button, IconAlertCircle, IconCreditCard, IconLoader, IconPlus, Listbox } from 'ui'
import AddNewPaymentMethodModal from './AddNewPaymentMethodModal'
import { useState } from 'react'

// [Joshen] This could potentially be shifted to components/ui as it could be shared between this page and org page
// likewise for AddNewPaymentMethodModal.tsx and AddNewPaymentMethodForm.tsx (these 2 are tightly coupled)
// Actually sorry, now that i think about it only the add new payment method modal is applicable
// Okay might not be able to reuse because of this odd quirk between the hcaptcha component and our overlay components

export interface PaymentMethodSelectionProps {
  selectedPaymentMethod: string
  onSelectPaymentMethod: (id: string) => void
}

const PaymentMethodSelection = ({
  selectedPaymentMethod,
  onSelectPaymentMethod,
}: PaymentMethodSelectionProps) => {
  const { ui } = useStore()
  const { ref: projectRef } = useParams()
  const snap = useSubscriptionPageStateSnapshot()
  const [showAddNewPaymentMethodModal, setShowAddNewPaymentMethodModal] = useState(false)
  const slug = ui.selectedOrganization?.slug

  const {
    data,
    isLoading,
    refetch: refetchPaymentMethods,
  } = useOrganizationPaymentMethodsQuery({ slug })
  const paymentMethods = data ?? []

  const canUpdatePaymentMethods = checkPermissions(
    PermissionAction.BILLING_WRITE,
    'stripe.payment_methods'
  )

  return (
    <>
      <div className="space-y-2">
        <p className="text-sm">Select payment method</p>
        {isLoading ? (
          <div className="flex items-center px-4 py-2 space-x-4 border rounded-md border-scale-700 bg-scale-400">
            <IconLoader className="animate-spin" size={14} />
            <p className="text-sm text-scale-1100">Retrieving payment methods</p>
          </div>
        ) : paymentMethods.length === 0 ? (
          <div className="flex items-center justify-between px-4 py-2 border border-dashed rounded-md bg-scale-100">
            <div className="flex items-center space-x-4 text-scale-1100">
              <IconAlertCircle size={16} strokeWidth={1.5} />
              <p className="text-sm">No saved payment methods</p>
            </div>

            <Tooltip.Root delayDuration={0}>
              <Tooltip.Trigger>
                <Button
                  type="default"
                  disabled={!canUpdatePaymentMethods}
                  icon={<IconCreditCard />}
                  onClick={() => setShowAddNewPaymentMethodModal(true)}
                >
                  Add new
                </Button>
              </Tooltip.Trigger>
              {!canUpdatePaymentMethods && (
                <Tooltip.Portal>
                  <Tooltip.Content side="bottom">
                    <Tooltip.Arrow className="radix-tooltip-arrow" />
                    <div
                      className={[
                        'rounded bg-scale-100 py-1 px-2 leading-none shadow', // background
                        'w-48 border border-scale-200 text-center', //border
                      ].join(' ')}
                    >
                      <span className="text-xs text-scale-1200">
                        You need additional permissions to add new payment methods to this
                        organization
                      </span>
                    </div>
                  </Tooltip.Content>
                </Tooltip.Portal>
              )}
            </Tooltip.Root>
          </div>
        ) : (
          <Listbox value={selectedPaymentMethod} onChange={onSelectPaymentMethod}>
            {paymentMethods.map((method: any) => {
              const label = `•••• •••• •••• ${method.card.last4}`
              return (
                <Listbox.Option
                  key={method.id}
                  label={label}
                  value={method.id}
                  addOnBefore={() => {
                    return (
                      <img
                        src={`${BASE_PATH}/img/payment-methods/${method.card.brand
                          .replace(' ', '-')
                          .toLowerCase()}.png`}
                        width="32"
                      />
                    )
                  }}
                >
                  <div>{label}</div>
                </Listbox.Option>
              )
            })}
            <div
              className="flex items-center px-3 py-2 space-x-2 transition cursor-pointer group hover:bg-scale-500"
              onClick={() => setShowAddNewPaymentMethodModal(true)}
            >
              <IconPlus size={16} />
              <p className="transition text-scale-1000 group-hover:text-scale-1200">
                Add new payment method
              </p>
            </div>
          </Listbox>
        )}
      </div>

      <AddNewPaymentMethodModal
        visible={showAddNewPaymentMethodModal}
        returnUrl={`${getURL()}/project/${projectRef}/settings/billing/update/pro`}
        onCancel={() => setShowAddNewPaymentMethodModal(false)}
        onConfirm={async () => {
          setShowAddNewPaymentMethodModal(false)
          ui.setNotification({
            category: 'success',
            message: 'Successfully added new payment method',
          })
          await refetchPaymentMethods()
        }}
      />
    </>
  )
}

export default PaymentMethodSelection
