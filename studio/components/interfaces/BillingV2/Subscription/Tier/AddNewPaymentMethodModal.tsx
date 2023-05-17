import HCaptcha from '@hcaptcha/react-hcaptcha'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useCallback, useEffect, useState } from 'react'

import { Modal } from 'ui'
import { useStore } from 'hooks'
import { useIsHCaptchaLoaded } from 'stores/hcaptcha-loaded-store'
import { post } from 'lib/common/fetch'
import { API_URL, STRIPE_PUBLIC_KEY } from 'lib/constants'
import AddNewPaymentMethodForm from './AddNewPaymentMethodForm'
import ShimmeringLoader from 'components/ui/ShimmeringLoader'

// [Joshen] Directly brought over from old Billing folder, so we can deprecate that folder easily next time

interface AddNewPaymentMethodModalProps {
  visible: boolean
  returnUrl: string
  onCancel: () => void
  onConfirm: () => void
}

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY)

const AddNewPaymentMethodModal = ({
  visible,
  returnUrl,
  onCancel,
  onConfirm,
}: AddNewPaymentMethodModalProps) => {
  const { ui } = useStore()
  const [intent, setIntent] = useState<any>()

  const captchaLoaded = useIsHCaptchaLoaded()

  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaRef, setCaptchaRef] = useState<HCaptcha | null>(null)

  const captchaRefCallback = useCallback((node) => {
    setCaptchaRef(node)
  }, [])

  useEffect(() => {
    const loadPaymentForm = async () => {
      if (visible && captchaRef && captchaLoaded) {
        let token = captchaToken

        try {
          if (!token) {
            const captchaResponse = await captchaRef.execute({ async: true })
            token = captchaResponse?.response ?? null
          }
        } catch (error) {
          return
        }

        await setupIntent(token ?? undefined)
        resetCaptcha()
      }
    }

    loadPaymentForm()
  }, [visible, captchaRef, captchaLoaded])

  const resetCaptcha = () => {
    setCaptchaToken(null)
    captchaRef?.resetCaptcha()
  }

  const setupIntent = async (hcaptchaToken: string | undefined) => {
    setIntent(undefined)

    const orgSlug = ui.selectedOrganization?.slug ?? ''
    const intent = await post(`${API_URL}/organizations/${orgSlug}/payments/setup-intent`, {
      hcaptchaToken,
    })

    if (intent.error) {
      return ui.setNotification({
        category: 'error',
        message: intent.error.message,
        error: intent.error,
      })
    } else {
      setIntent(intent)
    }
  }

  const options = {
    clientSecret: intent ? intent.client_secret : '',
    appearance: { theme: 'night', labels: 'floating' },
  } as any

  const onLocalCancel = () => {
    setIntent(undefined)
    return onCancel()
  }

  const onLocalConfirm = () => {
    setIntent(undefined)
    return onConfirm()
  }

  return (
    // We cant display the hCaptcha in the modal, as the modal auto-closes when clicking the captcha
    // So we only show the modal if the captcha has been executed successfully (intent loaded)
    <>
      <HCaptcha
        ref={captchaRefCallback}
        sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
        size="invisible"
        onVerify={(token) => {
          setCaptchaToken(token)
        }}
        onClose={onLocalCancel}
        onExpire={() => {
          setCaptchaToken(null)
        }}
      />

      <Modal
        hideFooter
        size="medium"
        visible={visible}
        header="Add new payment method"
        onCancel={onLocalCancel}
        className="PAYMENT"
      >
        <div className="py-4">
          {intent === undefined ? (
            <div className="px-6 space-y-2">
              <ShimmeringLoader className="w-full" />
              <ShimmeringLoader className="w-3/4" />
              <ShimmeringLoader className="w-1/2" />
            </div>
          ) : (
            <Elements stripe={stripePromise} options={options}>
              <AddNewPaymentMethodForm
                returnUrl={returnUrl}
                onCancel={onLocalCancel}
                onConfirm={onLocalConfirm}
              />
            </Elements>
          )}
        </div>
      </Modal>
    </>
  )
}

export default AddNewPaymentMethodModal
