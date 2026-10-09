import type { SupportTicket, SupportTicketFilterQuery } from '#server/types/support-ticket'
import type { DateRangeValue } from '~/composables/useDateRange'
import { useSupportTickets } from '~/composables/useSupportTickets'

export function useSupportTicketPage() {
  const searchQuery = ref('')
  const filterPriority = ref('')
  const filterStatus = ref('')
  const filterDateRange = ref<DateRangeValue | null>(null)

  const filterParams = computed<SupportTicketFilterQuery>(() => ({
    search: searchQuery.value || undefined,
    priority: filterPriority.value || undefined,
    status: filterStatus.value || undefined,
    startDate: filterDateRange.value?.start || undefined,
    endDate: filterDateRange.value?.end || undefined
  }))

  const {
    tickets,
    stats,
    pending,
    error,
    refresh,
    createTicket,
    updateTicket,
    deleteTicket
  } = useSupportTickets(filterParams)

  const showAddModal = ref(false)
  const showDetailModal = ref(false)
  const showDeleteConfirm = ref(false)
  const selectedTicket = ref<SupportTicket | null>(null)
  const ticketToDelete = ref<SupportTicket | null>(null)
  const isBusy = ref(false)

  const openDetail = (ticket: SupportTicket) => {
    selectedTicket.value = ticket
    showDetailModal.value = true
  }

  const confirmDelete = (ticket: SupportTicket) => {
    ticketToDelete.value = ticket
    showDeleteConfirm.value = true
  }

  const handleDeleteTicket = async () => {
    if (!ticketToDelete.value) return
    isBusy.value = true
    try {
      await deleteTicket(ticketToDelete.value.id)
      showDeleteConfirm.value = false
      ticketToDelete.value = null
    } catch (err) {
      console.error('Failed to delete ticket', err)
    } finally {
      isBusy.value = false
    }
  }

  const handleAddTicket = async (formData: {
    customerName: string
    email: string
    phone: string
    address: string
    city: string
    country: string
    descriptions: string
  }) => {
    isBusy.value = true
    try {
      await createTicket(formData)
      showAddModal.value = false
    } catch (err) {
      console.error('Failed to create ticket', err)
    } finally {
      isBusy.value = false
    }
  }

  const handleSendReply = async (ticketId: string, message: string) => {
    try {
      const res = await updateTicket(ticketId, { newMessage: message, senderName: 'Admin' })
      if (res.data && selectedTicket.value && selectedTicket.value.id === ticketId) {
        selectedTicket.value = res.data
      }
    } catch (err) {
      console.error('Failed to send reply', err)
    }
  }

  const handleUpdateStatus = async (ticketId: string, newStatus: 'Open' | 'Closed' | 'Pending') => {
    try {
      const res = await updateTicket(ticketId, { status: newStatus })
      if (res.data && selectedTicket.value && selectedTicket.value.id === ticketId) {
        selectedTicket.value = res.data
      }
    } catch (err) {
      console.error('Failed to update ticket status', err)
    }
  }

  return {
    tickets,
    stats,
    pending,
    error,
    refresh,
    searchQuery,
    filterPriority,
    filterStatus,
    filterDateRange,
    showAddModal,
    showDetailModal,
    showDeleteConfirm,
    selectedTicket,
    ticketToDelete,
    isBusy,
    openDetail,
    confirmDelete,
    handleDeleteTicket,
    handleAddTicket,
    handleSendReply,
    handleUpdateStatus
  }
}

