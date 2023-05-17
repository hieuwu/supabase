import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { get } from 'lib/common/fetch'
import { API_URL } from 'lib/constants'
import { useCallback } from 'react'
import { subscriptionKeys } from './keys'

// [Joshen TODO] To replace endpoint with new preview endpoint once its ready on the BE

export type ProjectSubscriptionPreviewVariables = {
  projectRef?: string
}

export type ProjectSubscriptionPreviewResponse = {}

export async function getProjectSubscriptionPreview(
  { projectRef }: ProjectSubscriptionPreviewVariables,
  signal?: AbortSignal
) {
  if (!projectRef) throw new Error('projectRef is required')
  const response = await get(`${API_URL}/projects/${projectRef}/subscription/preview`, { signal })
  if (response.error) throw response.error

  return response as ProjectSubscriptionPreviewResponse
}

export type ProjectSubscriptionPreviewData = Awaited<
  ReturnType<typeof getProjectSubscriptionPreview>
>
export type ProjectSubscriptionPreviewError = unknown

export const useProjectSubscriptionPreviewQuery = <TData = ProjectSubscriptionPreviewData>(
  { projectRef }: ProjectSubscriptionPreviewVariables,
  {
    enabled = true,
    ...options
  }: UseQueryOptions<ProjectSubscriptionPreviewData, ProjectSubscriptionPreviewError, TData> = {}
) =>
  useQuery<ProjectSubscriptionPreviewData, ProjectSubscriptionPreviewError, TData>(
    subscriptionKeys.preview(projectRef),
    ({ signal }) => getProjectSubscriptionPreview({ projectRef }, signal),
    {
      enabled: enabled && typeof projectRef !== 'undefined',
      ...options,
    }
  )

export const useProjectSubscriptionPreviewPrefetch = ({
  projectRef,
}: ProjectSubscriptionPreviewVariables) => {
  const client = useQueryClient()

  return useCallback(() => {
    if (projectRef) {
      client.prefetchQuery(subscriptionKeys.preview(projectRef), ({ signal }) =>
        getProjectSubscriptionPreview({ projectRef }, signal)
      )
    }
  }, [projectRef])
}
