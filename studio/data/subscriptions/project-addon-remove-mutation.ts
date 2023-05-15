import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import { delete_ } from 'lib/common/fetch'
import { API_URL } from 'lib/constants'
import { subscriptionKeys } from './keys'

export type ProjectAddonRemoveVariables = {
  projectRef: string
  variant: string
}

export type ProjectAddonRemoveResponse = {
  error?: any
}

export async function removeSubscriptionAddon({
  projectRef,
  variant,
}: ProjectAddonRemoveVariables) {
  if (!projectRef) throw new Error('projectRef is required')
  if (!variant) throw new Error('variant is required')

  const response = (await delete_(
    `${API_URL}/projects/${projectRef}/billing/addons/${variant}`
  )) as ProjectAddonRemoveResponse
  if (response.error) throw response.error

  return response
}

type ProjectAddonRemoveData = Awaited<ReturnType<typeof removeSubscriptionAddon>>

export const useProjectAddonRemoveMutation = ({
  onSuccess,
  ...options
}: Omit<
  UseMutationOptions<ProjectAddonRemoveData, unknown, ProjectAddonRemoveVariables>,
  'mutationFn'
> = {}) => {
  const queryClient = useQueryClient()

  return useMutation<ProjectAddonRemoveData, unknown, ProjectAddonRemoveVariables>(
    (vars) => removeSubscriptionAddon(vars),
    {
      async onSuccess(data, variables, context) {
        const { projectRef } = variables
        // [Joshen] To check - do we update add on? or update subscription, or both
        await queryClient.invalidateQueries(subscriptionKeys.addons(projectRef))
        await onSuccess?.(data, variables, context)
      },
      ...options,
    }
  )
}
