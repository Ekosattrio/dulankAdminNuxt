import type { DownloadFileItem, DownloadFileFormData } from '#server/types/download-file'

export default defineEventHandler(async (event) => {
  const body = await readBody<DownloadFileFormData & { isFavorite?: boolean; isPinned?: boolean }>(event)

  if (!body || !body.name || !body.category) {
    throw createError({
      statusCode: 400,
      statusMessage: 'File name and category are required'
    })
  }

  const allFiles = await readJSON<DownloadFileItem[]>('download-files.json', [])

  if (body.id) {
    const idx = allFiles.findIndex(item => item.id === body.id)
    if (idx !== -1) {
      const current = allFiles[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'File not found' })
      const updated: DownloadFileItem = {
        ...current,
        name: body.name,
        category: body.category,
        size: body.size || current.size,
        fileType: body.fileType || current.fileType,
        fileUrl: body.fileUrl ?? current.fileUrl,
        uploadedBy: body.uploadedBy || current.uploadedBy,
        ownedBy: body.ownedBy || current.ownedBy || current.uploadedBy,
        membersCount: body.membersCount ?? current.membersCount,
        isFavorite: body.isFavorite ?? current.isFavorite,
        isPinned: body.isPinned ?? current.isPinned
      }
      allFiles[idx] = updated
      await writeJSON('download-files.json', allFiles)
      return createResponse(updated, 'File updated successfully')
    }
  }

  // Detect file type if not explicitly supplied
  let detectedType: DownloadFileItem['fileType'] = body.fileType || 'file'
  if (!body.fileType) {
    const ext = body.name.split('.').pop()?.toLowerCase()
    if (ext === 'pdf') detectedType = 'pdf'
    else if (['xls', 'xlsx', 'csv'].includes(ext || '')) detectedType = 'excel'
    else if (['png', 'jpg', 'jpeg', 'svg', 'webp'].includes(ext || '')) detectedType = 'image'
    else if (['mp4', 'mkv', 'avi', 'mov'].includes(ext || '')) detectedType = 'video'
    else if (['mp3', 'wav', 'ogg'].includes(ext || '')) detectedType = 'audio'
    else if (['doc', 'docx'].includes(ext || '')) detectedType = 'word'
    else if (['zip', 'rar', '7z', 'tar'].includes(ext || '')) detectedType = 'archive'
  }

  const newFile: DownloadFileItem = {
    id: `file-${Date.now()}`,
    name: body.name,
    category: body.category,
    size: body.size || '1.0 MB',
    downloadCount: 0,
    uploadedDate: new Date().toISOString().slice(0, 10),
    lastModified: `Today ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
    fileType: detectedType,
    fileUrl: body.fileUrl || `/downloads/${body.name}`,
    uploadedBy: body.uploadedBy || 'Admin',
    ownedBy: body.ownedBy || body.uploadedBy || 'Admin',
    membersCount: body.membersCount || 1,
    isFavorite: body.isFavorite ?? false,
    isPinned: body.isPinned ?? false
  }

  allFiles.unshift(newFile)
  await writeJSON('download-files.json', allFiles)

  return createResponse(newFile, 'File created successfully')
})
