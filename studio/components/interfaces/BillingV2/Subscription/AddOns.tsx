import Image from 'next/image'
import { useParams } from 'common'
import { getCurrentAddons } from 'components/interfaces/Billing/Billing.utils'
import ShimmeringLoader from 'components/ui/ShimmeringLoader'
import { useStripeProductsQuery } from 'data/stripe/products-query'
import { useProjectSubscriptionQuery } from 'data/subscriptions/project-subscription-query'
import { Button } from 'ui'
import { getActiveAddOns } from './Subscription.utils'
import { BASE_PATH } from 'lib/constants'

export interface AddOnsProps {}

const AddOns = ({}: AddOnsProps) => {
  const { ref: projectRef } = useParams()
  const { data: products } = useStripeProductsQuery()
  const { data: subscription, isLoading } = useProjectSubscriptionQuery({ projectRef })
  const activeAddons = subscription !== undefined ? getActiveAddOns(subscription) : undefined

  // [Joshen] Since we're showing more information about the compute than before, please
  // remember to update on Stripe as well, and follow a fixed format:
  // [CPU] • [Memory] • [Disk IO max burst] • [Baseline Disk IO] • [No. connections]
  const activeComputeAddOnMetadata = (products?.addons ?? []).find(
    (product) => product.id === activeAddons?.computeSize?.prod_id
  )
  const computeSpecs =
    activeComputeAddOnMetadata?.metadata?.features ??
    '2-core ARM (shared) • 1GB memory • 2,606 Mbps • 87 Mbps • 50'
  const [cpu, memory, maxIO, baseIO, connectionLimit] = computeSpecs.split('•').map((x) => x.trim())

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-5">
        <div className="sticky top-16">
          <p className="text-base">Add ons</p>
          <p className="text-sm text-scale-1000">Some description text here</p>
        </div>
      </div>
      {isLoading ? (
        <div className="col-span-7 space-y-2">
          <ShimmeringLoader />
          <ShimmeringLoader className="w-3/4" />
          <ShimmeringLoader className="w-1/2" />
        </div>
      ) : (
        <div className="col-span-7 space-y-6">
          <p className="text-sm text-scale-1000">
            [This needs to be changed] There is a usage quota included and a spend cap turned on by
            default. If you need to go beyond the inclusive limits, simply switch off your spend cap
            to pay for additional usage.
          </p>

          <div className="py-2 space-y-6">
            {/* Compute add on selection */}
            <div className="flex space-x-6">
              <div>
                <div className="rounded-md bg-scale-400 w-[160px] h-[96px] shadow">
                  <Image
                    width={160}
                    height={96}
                    src={
                      activeAddons?.computeSize !== undefined
                        ? `${BASE_PATH}/img/optimized-compute-on.svg`
                        : `${BASE_PATH}/img/optimized-compute-off.svg`
                    }
                  />
                </div>
              </div>
              <div className="flex-grow">
                <p className="text-sm text-scale-1000">Optimized compute</p>
                <p className="">{activeAddons?.computeSize?.name ?? 'Micro'}</p>
                <Button type="default" className="mt-2">
                  Change optimized compute
                </Button>
                <div className="mt-2 w-full flex items-center justify-between border-b py-2">
                  <p className="text-sm text-scale-1000">Memory</p>
                  <p className="text-sm">{memory ?? 'Unknown'}</p>
                </div>
                <div className="w-full flex items-center justify-between border-b py-2">
                  <p className="text-sm text-scale-1000">CPU</p>
                  <p className="text-sm">{cpu ?? 'Unknown'}</p>
                </div>
                <div className="w-full flex items-center justify-between border-b py-2">
                  <p className="text-sm text-scale-1000">No. of connections</p>
                  <p className="text-sm">{connectionLimit ?? 'Unknown'}</p>
                </div>
                <div className="w-full flex items-center justify-between border-b py-2">
                  <p className="text-sm text-scale-1000">Disk IO Bandwidth max burst</p>
                  <p className="text-sm">{maxIO ?? 'Unknown'}</p>
                </div>
                <div className="w-full flex items-center justify-between py-2">
                  <p className="text-sm text-scale-1000">Baseline Disk IO Bandwidth</p>
                  <p className="text-sm">{baseIO ?? 'Unknown'}</p>
                </div>
              </div>
            </div>

            <div className="w-full border-t" />

            {/* PITR selection */}
            <div className="flex space-x-6">
              <div>
                <div className="rounded-md bg-scale-400 w-[160px] h-[96px] shadow">
                  <Image
                    width={160}
                    height={96}
                    src={
                      activeAddons?.pitrDuration !== undefined
                        ? `${BASE_PATH}/img/pitr-on.svg`
                        : `${BASE_PATH}/img/pitr-off.svg`
                    }
                  />
                </div>
              </div>
              <div>
                <p className="text-sm text-scale-1000">Point in time recovery</p>
                <p className="">
                  {activeAddons?.pitrDuration !== undefined
                    ? 'No point in time recovery available'
                    : 'Point in time recovery is enabled'}
                </p>
                {/* No point in time recovery available */}
                <Button type="default" className="mt-2">
                  Change point in time recovery
                </Button>
              </div>
            </div>

            <div className="w-full border-t" />

            {/* Custom domain selection */}
            <div className="flex space-x-6">
              <div>
                <div className="rounded-md bg-scale-400 w-[160px] h-[96px] shadow">
                  <Image
                    width={160}
                    height={96}
                    src={
                      activeAddons?.customDomains !== undefined
                        ? `${BASE_PATH}/img/custom-domain-on.svg`
                        : `${BASE_PATH}/img/custom-domain-off.svg`
                    }
                  />
                </div>
              </div>
              <div>
                <p className="text-sm text-scale-1000">Custom domain</p>
                <p className="">
                  {activeAddons?.customDomains !== undefined
                    ? 'Custom domain is enabled'
                    : 'Custom domain is not enabled'}
                </p>
                <Button type="default" className="mt-2">
                  Change custom domain
                </Button>
              </div>
            </div>
          </div>

          <p className="text-sm text-scale-1000">
            [This needs to be changed] There is a usage quota included and a spend cap turned on by
            default. If you need to go beyond the inclusive limits, simply switch off your spend cap
            to pay for additional usage.
          </p>
        </div>
      )}
    </div>
  )
}

export default AddOns
