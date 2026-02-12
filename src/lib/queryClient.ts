import { QueryClient, QueryCache } from '@tanstack/react-query'
import { ApiError } from './api'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof ApiError && error.status === 401) {
        // 401s are retried via the retry config below;
        // this callback fires after all retries are exhausted.
        // Could add global logout / toast here later.
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: true,
      retry: (failureCount, error) => {
        if (error instanceof ApiError) {
          // No retry on 403 (forbidden) or 404 (not found)
          if (error.status === 403 || error.status === 404) return false
          // Retry once on 401 (token may have just been refreshed)
          if (error.status === 401) return failureCount < 1
        }
        // Default: retry up to 3 times for other errors
        return failureCount < 3
      },
    },
  },
})
