import type { FetchOptions } from 'ofetch'

type ApiFetch = <T = unknown>(url: string, options?: FetchOptions<'json'>) => Promise<T>

// Nitro's generated route union can exceed TypeScript's instantiation depth in this project.
// Keep the runtime $fetch implementation while typing responses at each domain boundary.
export const apiFetch = $fetch as unknown as ApiFetch
