import type { AsyncData } from '#app'
import type { FetchError } from 'ofetch'

type ApiAsyncData<T> = AsyncData<T | undefined, FetchError | undefined>
type ApiUseFetch = <T>(url: string, options?: Record<string, unknown>) => ApiAsyncData<T>

// Keep Nuxt's SSR-aware useFetch runtime without repeatedly expanding Nitro's
// generated union of every internal route in this large application.
export const useApiFetch = useFetch as unknown as ApiUseFetch
