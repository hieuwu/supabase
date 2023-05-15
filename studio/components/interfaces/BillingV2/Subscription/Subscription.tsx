import AddOns from './AddOns/AddOns'
import BillingBreakdown from './BillingBreakdown'
import CostControl from './CostControl/CostControl'
import SubscriptionTier from './Tier/SubscriptionTier'

export interface SubscriptionProps {}

const Subscription = ({}: SubscriptionProps) => {
  return (
    <>
      <div className="border-b">
        <div className="1xl:px-28 mx-auto flex flex-col gap-10 px-5 lg:px-16 2xl:px-32 py-6">
          <h3 className="text-scale-1200 text-xl">Subscription</h3>
        </div>
      </div>
      <div className="border-b">
        <div className="1xl:px-28 mx-auto flex flex-col gap-10 px-5 lg:px-16 2xl:px-32 py-16">
          <SubscriptionTier />
        </div>
      </div>
      <div className="border-b">
        <div className="1xl:px-28 mx-auto flex flex-col gap-10 px-5 lg:px-16 2xl:px-32 py-16">
          <CostControl />
        </div>
      </div>
      <div className="border-b">
        <div className="1xl:px-28 mx-auto flex flex-col gap-10 px-5 lg:px-16 2xl:px-32 py-16">
          <AddOns />
        </div>
      </div>
      <div className="border-b">
        <div className="1xl:px-28 mx-auto flex flex-col gap-10 px-5 lg:px-16 2xl:px-32 py-16">
          <BillingBreakdown />
        </div>
      </div>
    </>
  )
}

export default Subscription
