/**
 * Sinkronisasi ref data dengan mock server (in-memory) — pola CRUD mock.
 *
 * watch dalam pada array; setiap mutasi (push/splice/filter/edit-in-place)
 * di-debounce 400ms lalu di-PUT batch ke `/api/<resource>` sehingga state
 * mock server mengikuti state halaman (bertahan selama proses dev/server).
 *
 * @example
 * const { data: unitData } = await useFetch<UnitItem[]>('/api/unit')
 * const units = ref<UnitItem[]>(unitData.value ?? [])
 * useMockSync('unit', units)
 */
export const useMockSync = <T extends unknown[]>(resource: string, items: Ref<T>) => {
  if (import.meta.server) return

  let timer: ReturnType<typeof setTimeout> | undefined

  watch(items, () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      // JSON round-trip: pastikan payload murni serializable
      const payload = JSON.parse(JSON.stringify(items.value)) as unknown[]
      // API boundary typed bersama (menghindari union route Nitro yang terlalu dalam).
      apiFetch(`/api/${resource}`, { method: 'PUT', body: payload }).catch(() => {
        // mock server: abaikan error sinkronisasi (state lokal tetap jalan)
      })
    }, 400)
  }, { deep: true, flush: 'post' })
}