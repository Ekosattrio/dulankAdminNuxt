import { ref, computed, type Ref } from 'vue'
import type { DownloadFileItem } from '#server/types/download-file'

export function useDownloadFilesFilter(files: Ref<DownloadFileItem[]>) {
  const ownedFilter = ref('Owned By Me')
  const sortBy = ref('Sort by Date')
  const recentFilter = ref('Recent')
  const fileTypeFilter = ref('All File types')
  const searchQuery = ref('')

  const pinnedFiles = computed(() => files.value.filter(f => f.isPinned))

  const tableFiles = computed(() => {
    let list = files.value.filter(f => !f.isPinned)
    if (list.length === 0) {
      list = files.value
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase()
      list = list.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.ownedBy && item.ownedBy.toLowerCase().includes(q))
      )
    }

    if (fileTypeFilter.value !== 'All File types') {
      const ft = fileTypeFilter.value.toLowerCase()
      list = list.filter(item => {
        if (ft === 'folders') return item.fileType === 'folder'
        if (ft === 'pdf') return item.fileType === 'pdf'
        if (ft === 'images') return item.fileType === 'image'
        if (ft === 'videos') return item.fileType === 'video'
        if (ft === 'audios') return item.fileType === 'audio'
        if (ft === 'excel') return item.fileType === 'excel'
        return true
      })
    }

    if (sortBy.value === 'Sort By Size') {
      list = [...list].sort((a, b) => (parseFloat(b.size) || 0) - (parseFloat(a.size) || 0))
    } else if (sortBy.value === 'Order Ascending') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy.value === 'Order Descending') {
      list = [...list].sort((a, b) => b.name.localeCompare(a.name))
    }

    return list
  })

  return {
    ownedFilter,
    sortBy,
    recentFilter,
    fileTypeFilter,
    searchQuery,
    pinnedFiles,
    tableFiles,
  }
}

