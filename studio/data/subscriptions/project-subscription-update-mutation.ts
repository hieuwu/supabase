import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import { put } from 'lib/common/fetch'
import { API_URL } from 'lib/constants'
import { subscriptionKeys } from './keys'

export type ProjectSubscriptionUpdateVariables = {
  projectRef: string
  tier: 'tier_free' | 'tier_pro' | 'tier_payg' | 'tier_team'
}

export type ProjectSubscriptionUpdateResponse = {
  error?: any
}

export async function updateSubscriptionTier({
  projectRef,
  tier,
}: ProjectSubscriptionUpdateVariables) {
  if (!projectRef) throw new Error('projectRef is required')
  if (!tier) throw new Error('tier is required')

  const response = (await put(`${API_URL}/projects/${projectRef}/billing/subscription`, {
    tier,
  })) as ProjectSubscriptionUpdateResponse
  if (response.error) throw response.error

  return response
}

type ProjectSubscriptionUpdateData = Awaited<ReturnType<typeof updateSubscriptionTier>>

export const useProjectSubscriptionUpdateMutation = ({
  onSuccess,
  ...options
}: Omit<
  UseMutationOptions<ProjectSubscriptionUpdateData, unknown, ProjectSubscriptionUpdateVariables>,
  'mutationFn'
> = {}) => {
  const queryClient = useQueryClient()

  return useMutation<ProjectSubscriptionUpdateData, unknown, ProjectSubscriptionUpdateVariables>(
    (vars) => updateSubscriptionTier(vars),
    {
      async onSuccess(data, variables, context) {
        const { projectRef } = variables
        await queryClient.invalidateQueries(subscriptionKeys.subscriptionV2(projectRef))
        await onSuccess?.(data, variables, context)
      },
      ...options,
    }
  )
}
