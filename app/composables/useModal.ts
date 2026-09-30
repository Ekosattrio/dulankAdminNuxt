/**
 * State modal seragam (pola baru untuk semua modal di aplikasi).
 *
 * Sebelumnya ada 3 pola berbeda (inline `class="modal"` + v-if, prop di
 * BaseModal/ConfirmModal, dan variabel ad-hoc seperti `isAddModalOpen`).
 * Gunakan composable ini di halaman/komponen baru; migrasi bertahap
 * mengikuti backlog REVIEW.md.
 *
 * @example
 * const { isOpen, open, close } = useModal()
 * // template: <CommonBaseModal :open="isOpen" @close="close" ... />
 */
export const useModal = (initialOpen = false) => {
  const isOpen = ref(initialOpen)

  const open = () => {
    isOpen.value = true
  }
  const close = () => {
    isOpen.value = false
  }
  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  return { isOpen, open, close, toggle }
}