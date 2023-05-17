import { ProjectSelectedAddon } from 'data/subscriptions/project-addons-query'
import { ProjectSubscriptionResponse } from 'data/subscriptions/project-subscription-v2-query'

export const getAddons = (selectedAddons: ProjectSelectedAddon[]) => {
  const computeInstance = selectedAddons.find((addon) => addon.type === 'compute_instance')
  const pitr = selectedAddons.find((addon) => addon.type === 'pitr')
  const customDomain = selectedAddons.find((addon) => addon.type === 'custom_domain')
  return { computeInstance, pitr, customDomain }
}

export const calculateTotalCost = (
  subscription: ProjectSubscriptionResponse,
  selectedAddons: ProjectSelectedAddon[]
) => {
  const tierCost = (subscription?.tier.price ?? 0) / 100
  const addOnsCost =
    selectedAddons !== undefined
      ? selectedAddons.map((addon) => addon.variant.price ?? 0).reduce((a, b) => a + b, 0)
      : 0
  return tierCost + addOnsCost
}
