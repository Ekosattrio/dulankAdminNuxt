import type { AsyncData } from '#app'
import type { FetchError } from 'ofetch'
import { apiFetch } from '~/utils/apiFetch'

type ApiAsyncData<T> = AsyncData<T | undefined, FetchError | undefined>
type ApiUseFetch = <T>(url: string, options?: Record<string, unknown>) => ApiAsyncData<T>

// Salah satu dari 2 jalur: custom fetcher di `$fetch` mengganti `$fetch` bawaan
// Nuxt untuk `useFetch` — seluruh data read memakai `apiFetch` (baseURL +
// Authorization Bearer + penanganan 401), konsisten dengan request tulis.
const rawUseFetch = useFetch as unknown as ApiUseFetch

export function useApiFetch<T>(url: string, options: Record<string, unknown> = {}): ApiAsyncData<T> {
  return rawUseFetch(url, {
    ...options,
    $fetch: apiFetch,
  }) as ApiAsyncData<T>
}