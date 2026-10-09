/** Shared editing state; each route supplies its existing domain API. */
export function useSalesListActions<T extends { id: string }, F>(
  save: (form: F) => Promise<unknown>,
  remove: (id: string) => Promise<unknown>,
) {
  const isModalOpen = ref(false)
  const editData = ref<T | null>(null) as Ref<T | null>
  const isEdit = computed(() => editData.value !== null)
  const deleting = ref<T | null>(null) as Ref<T | null>
  const busy = ref(false)
  const actionError = ref('')
  const toastMessage = ref('')

  function handleAdd() {
    actionError.value = ''
    editData.value = null
    isModalOpen.value = true
  }
  function handleEdit(item: T) {
    actionError.value = ''
    editData.value = item
    isModalOpen.value = true
  }
  async function handleSubmit(form: F) {
    if (busy.value) return
    busy.value = true
    actionError.value = ''
    try {
      await save(form)
      isModalOpen.value = false
      toastMessage.value = 'Changes saved successfully.'
    } catch (error) {
      actionError.value = salesErrorMessage(error)
    } finally {
      busy.value = false
    }
  }
  async function confirmDelete() {
    if (!deleting.value || busy.value) return
    busy.value = true
    actionError.value = ''
    try {
      await remove(deleting.value.id)
      deleting.value = null
      toastMessage.value = 'Record deleted successfully.'
    } catch (error) {
      actionError.value = salesErrorMessage(error)
    } finally {
      busy.value = false
    }
  }
  return {
    isModalOpen,
    editData,
    isEdit,
    deleting,
    busy,
    actionError,
    toastMessage,
    handleAdd,
    handleEdit,
    handleSubmit,
    confirmDelete,
  }
}
