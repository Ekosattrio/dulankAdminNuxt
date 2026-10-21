<script setup lang="ts">
import { ACTION_TOAST_EVENT, type ActionToastNotice } from '~/utils/actionToast'
const notice = ref<ActionToastNotice | null>(null)
let timer: ReturnType<typeof setTimeout> | undefined
let receivedAt = 0
function dismiss() { notice.value = null; if (timer) clearTimeout(timer) }
function receive(event: Event) {
  const next = (event as CustomEvent<ActionToastNotice>).detail
  const now = Date.now()
  // A page's precise feedback replaces the generic request notification.
  if (notice.value?.source === 'page' && next.source === 'request' && next.tone === notice.value.tone && now - receivedAt < 900) return
  notice.value = next
  receivedAt = now
  if (timer) clearTimeout(timer)
  timer = setTimeout(dismiss, next.tone === 'error' ? 7000 : 4500)
}
onMounted(() => window.addEventListener(ACTION_TOAST_EVENT, receive))
onBeforeUnmount(() => { window.removeEventListener(ACTION_TOAST_EVENT, receive); if (timer) clearTimeout(timer) })
</script>
<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-200" enter-from-class="translate-y-2 opacity-0" leave-active-class="transition duration-150" leave-to-class="translate-y-2 opacity-0">
      <div v-if="notice" :role="notice.tone === 'error' ? 'alert' : 'status'" :aria-live="notice.tone === 'error' ? 'assertive' : 'polite'" class="fixed right-5 top-5 z-[10000] flex w-fit max-w-[calc(100%-2.5rem)] items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-xl print:hidden" :class="notice.tone === 'error' ? 'bg-rose-600' : notice.tone === 'success' ? 'bg-emerald-600' : 'bg-blue-600'">
        <FeatherIcon :name="notice.tone === 'error' ? 'alert-circle' : notice.tone === 'success' ? 'check-circle' : 'info'" :size="16" class="shrink-0" />
        <p class="min-w-0 flex-1 break-words">{{ notice.message }}</p>
        <button type="button" aria-label="Tutup notifikasi" class="shrink-0 rounded p-1 hover:bg-white/15" @click="dismiss"><FeatherIcon name="x" :size="16" /></button>
      </div>
    </Transition>
  </Teleport>
</template>
