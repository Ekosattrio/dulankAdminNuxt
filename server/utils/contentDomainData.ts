import type { BannerItem, BannerFormData } from '#server/types/banner'
import type { ClientItem, ClientFormData } from '#server/types/client'
import type { DownloadFileItem, DownloadFileFormData } from '#server/types/download-file'
import type { FooterLinkItem, FooterLinkFormData, FooterConfig } from '#server/types/footer'
import { readJSON, writeJSON } from './data'

// ----------------- Banners -----------------

export async function getBanners(query?: { search?: string; type?: string; status?: string }): Promise<BannerItem[]> {
  const allBanners = await readJSON<BannerItem[]>('banners.json', [])
  let filtered = allBanners

  const search = (query?.search || '').toLowerCase().trim()
  const type = query?.type || ''
  const status = query?.status || ''

  if (search) {
    filtered = filtered.filter(item =>
      (item.title && item.title.toLowerCase().includes(search)) ||
      (item.position && item.position.toLowerCase().includes(search)) ||
      (item.description && item.description.toLowerCase().includes(search))
    )
  }

  if (type && type !== 'all') {
    filtered = filtered.filter(item => item.type === type)
  }

  if (status && status !== 'all') {
    filtered = filtered.filter(item => Boolean(item.status && item.status.toLowerCase() === status.toLowerCase()))
  }

  return filtered.sort((a, b) => (a.order || 0) - (b.order || 0))
}

export async function saveBanner(body: BannerFormData): Promise<BannerItem> {
  if (!body) {
    throw createError({ statusCode: 400, statusMessage: 'Payload is required' })
  }

  const title = body.title || 'Untitled Banner'
  const img = body.imageUrl || body.src || 'https://percetakan-dulank.netlify.app/images/brosur.jpg'
  const type = body.type || (body.position?.toLowerCase().includes('product') ? 'product' : 'main')
  const position = body.position || (type === 'product' ? 'Product Promo' : 'Main Slider')
  const desc = body.description || body.desc || ''
  const start = body.start || body.startDate || new Date().toISOString()
  const end = body.end || body.endDate || new Date(Date.now() + 30 * 86400000).toISOString()

  const allBanners = await readJSON<BannerItem[]>('banners.json', [])

  if (body.id) {
    const idx = allBanners.findIndex(item => item.id === body.id)
    if (idx !== -1) {
      const current = allBanners[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Banner not found' })
      const updated: BannerItem = {
        ...current,
        title,
        imageUrl: img,
        src: img,
        type,
        position,
        description: desc,
        desc,
        start,
        end,
        startDate: start.slice(0, 10),
        endDate: end.slice(0, 10),
        status: body.status || current.status || 'Inactive',
        order: body.order !== undefined ? Number(body.order) : current.order,
        redirectUrl: body.redirectUrl ?? current.redirectUrl ?? '#',
      }
      allBanners[idx] = updated
      await writeJSON('banners.json', allBanners)
      return updated
    }
  }

  const nextOrder = allBanners.length > 0 ? Math.max(...allBanners.map(b => b.order || 0)) + 1 : 1
  const newBanner: BannerItem = {
    id: body.id || (type === 'main' ? `m${Date.now()}` : `p${Date.now()}`),
    title,
    imageUrl: img,
    src: img,
    type,
    position,
    description: desc,
    desc,
    start,
    end,
    startDate: start.slice(0, 10),
    endDate: end.slice(0, 10),
    status: body.status || 'Inactive',
    order: body.order !== undefined ? Number(body.order) : nextOrder,
    redirectUrl: body.redirectUrl || '#',
  }

  allBanners.push(newBanner)
  await writeJSON('banners.json', allBanners)
  return newBanner
}

export async function deleteBanner(id: string): Promise<{ id: string }> {
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Banner ID is required' })

  const allBanners = await readJSON<BannerItem[]>('banners.json', [])
  const newBanners = allBanners.filter(b => b.id !== id)

  if (allBanners.length === newBanners.length) {
    throw createError({ statusCode: 404, statusMessage: 'Banner not found' })
  }

  await writeJSON('banners.json', newBanners)
  return { id }
}

// ----------------- Clients -----------------

export async function getClients(query?: { search?: string; status?: string; category?: string }): Promise<ClientItem[]> {
  const allClients = await readJSON<ClientItem[]>('clients.json', [])
  let filtered = allClients

  const search = (query?.search || '').toLowerCase().trim()
  const status = query?.status || ''
  const category = query?.category || ''

  if (search) {
    filtered = filtered.filter(item => item.name.toLowerCase().includes(search))
  }

  if (status && status !== 'all') {
    filtered = filtered.filter(item => item.status.toLowerCase() === status.toLowerCase())
  }

  if (category && category !== 'all') {
    filtered = filtered.filter(item => (item.category || '').toLowerCase() === category.toLowerCase())
  }

  return filtered.sort((a, b) => (a.order || 0) - (b.order || 0))
}

export async function saveClient(body: ClientFormData): Promise<ClientItem> {
  if (!body || !body.name || !body.logoUrl) {
    throw createError({ statusCode: 400, statusMessage: 'Client name and logo URL are required' })
  }

  const allClients = await readJSON<ClientItem[]>('clients.json', [])

  if (body.id) {
    const idx = allClients.findIndex(item => item.id === body.id)
    if (idx !== -1) {
      const current = allClients[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Client not found' })
      const updated: ClientItem = {
        ...current,
        name: body.name.trim(),
        logoUrl: body.logoUrl.trim(),
        website: body.website ?? current.website,
        category: body.category || current.category || 'General',
        status: body.status || current.status || 'Active',
        order: body.order !== undefined ? Number(body.order) : current.order,
      }
      allClients[idx] = updated
      await writeJSON('clients.json', allClients)
      return updated
    }
  }

  const nextOrder = allClients.length > 0 ? Math.max(...allClients.map(c => c.order || 0)) + 1 : 1
  const newClient: ClientItem = {
    id: `cli-${Date.now()}`,
    name: body.name.trim(),
    logoUrl: body.logoUrl.trim(),
    website: body.website || '',
    category: body.category || 'General',
    status: body.status || 'Active',
    order: body.order !== undefined ? Number(body.order) : nextOrder,
    createdDate: new Date().toISOString().slice(0, 10),
  }

  allClients.push(newClient)
  await writeJSON('clients.json', allClients)
  return newClient
}

export async function reorderClients(orderIds: string[]): Promise<ClientItem[]> {
  if (!orderIds || !Array.isArray(orderIds)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid order list' })
  }

  const allClients = await readJSON<ClientItem[]>('clients.json', [])
  const clientMap = new Map(allClients.map(c => [c.id, c]))

  const reordered: ClientItem[] = []
  orderIds.forEach((id, idx) => {
    const item = clientMap.get(id)
    if (item) {
      item.order = idx + 1
      reordered.push(item)
      clientMap.delete(id)
    }
  })

  clientMap.forEach(item => {
    item.order = reordered.length + 1
    reordered.push(item)
  })

  await writeJSON('clients.json', reordered)
  return reordered
}

export async function deleteClient(id: string): Promise<{ id: string }> {
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Client ID is required' })

  const allClients = await readJSON<ClientItem[]>('clients.json', [])
  const newClients = allClients.filter(c => c.id !== id)

  if (allClients.length === newClients.length) {
    throw createError({ statusCode: 404, statusMessage: 'Client not found' })
  }

  await writeJSON('clients.json', newClients)
  return { id }
}

// ----------------- Download Files -----------------

export async function getDownloadFiles(query?: { search?: string; category?: string; fileType?: string }): Promise<DownloadFileItem[]> {
  const allFiles = await readJSON<DownloadFileItem[]>('download-files.json', [])
  let filtered = allFiles

  const search = (query?.search || '').toLowerCase().trim()
  const category = query?.category || ''
  const fileType = query?.fileType || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      (item.uploadedBy && item.uploadedBy.toLowerCase().includes(search))
    )
  }

  if (category && category !== 'All') {
    filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase())
  }

  if (fileType && fileType !== 'All') {
    filtered = filtered.filter(item => item.fileType === fileType)
  }

  return filtered
}

export async function saveDownloadFile(body: DownloadFileFormData & { isFavorite?: boolean; isPinned?: boolean }): Promise<DownloadFileItem> {
  if (!body || !body.name || !body.category) {
    throw createError({ statusCode: 400, statusMessage: 'File name and category are required' })
  }

  const allFiles = await readJSON<DownloadFileItem[]>('download-files.json', [])

  if (body.id) {
    const idx = allFiles.findIndex(item => item.id === body.id)
    if (idx !== -1) {
      const current = allFiles[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'File not found' })
      const updated: DownloadFileItem = {
        ...current,
        name: body.name.trim(),
        category: body.category,
        size: body.size || current.size,
        fileType: body.fileType || current.fileType,
        fileUrl: body.fileUrl ?? current.fileUrl,
        uploadedBy: body.uploadedBy || current.uploadedBy,
        ownedBy: body.ownedBy || current.ownedBy || current.uploadedBy,
        membersCount: body.membersCount ?? current.membersCount,
        isFavorite: body.isFavorite ?? current.isFavorite,
        isPinned: body.isPinned ?? current.isPinned,
      }
      allFiles[idx] = updated
      await writeJSON('download-files.json', allFiles)
      return updated
    }
  }

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
    name: body.name.trim(),
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
    isPinned: body.isPinned ?? false,
  }

  allFiles.unshift(newFile)
  await writeJSON('download-files.json', allFiles)
  return newFile
}

export async function deleteDownloadFile(id: string): Promise<{ id: string }> {
  if (!id) throw createError({ statusCode: 400, statusMessage: 'File ID is required' })

  const allFiles = await readJSON<DownloadFileItem[]>('download-files.json', [])
  const newFiles = allFiles.filter(f => f.id !== id)

  if (allFiles.length === newFiles.length) {
    throw createError({ statusCode: 404, statusMessage: 'File not found' })
  }

  await writeJSON('download-files.json', newFiles)
  return { id }
}

// ----------------- Footers & Footer Config -----------------

export async function getFooters(query?: { section?: string; status?: string }): Promise<FooterLinkItem[]> {
  const allFooters = await readJSON<FooterLinkItem[]>('footers.json', [])
  let filtered = allFooters

  const section = query?.section || ''
  const status = query?.status || ''

  if (section && section !== 'all') {
    filtered = filtered.filter(item => item.sectionName === section)
  }

  if (status && status !== 'all') {
    filtered = filtered.filter(item => item.status.toLowerCase() === status.toLowerCase())
  }

  return filtered.sort((a, b) => (a.order || 0) - (b.order || 0))
}

export async function saveFooterLink(body: FooterLinkFormData): Promise<FooterLinkItem> {
  if (!body || !body.sectionName || !body.linkTitle || !body.url) {
    throw createError({ statusCode: 400, statusMessage: 'Section name, link title, and URL are required' })
  }

  const allFooters = await readJSON<FooterLinkItem[]>('footers.json', [])

  if (body.id) {
    const idx = allFooters.findIndex(item => item.id === body.id)
    if (idx !== -1) {
      const current = allFooters[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Footer link not found' })
      const updated: FooterLinkItem = {
        ...current,
        sectionName: body.sectionName,
        linkTitle: body.linkTitle.trim(),
        url: body.url.trim(),
        order: body.order !== undefined ? Number(body.order) : current.order,
        status: body.status || current.status || 'Active',
        target: body.target || current.target || '_self',
      }
      allFooters[idx] = updated
      await writeJSON('footers.json', allFooters)
      return updated
    }
  }

  const nextOrder = allFooters.length > 0 ? Math.max(...allFooters.map(f => f.order || 0)) + 1 : 1
  const newFooter: FooterLinkItem = {
    id: `foot-${Date.now()}`,
    sectionName: body.sectionName,
    linkTitle: body.linkTitle.trim(),
    url: body.url.trim(),
    order: body.order !== undefined ? Number(body.order) : nextOrder,
    status: body.status || 'Active',
    target: body.target || '_self',
  }

  allFooters.push(newFooter)
  await writeJSON('footers.json', allFooters)
  return newFooter
}

export async function deleteFooterLink(id: string): Promise<{ id: string }> {
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Footer link ID is required' })

  const allFooters = await readJSON<FooterLinkItem[]>('footers.json', [])
  const newFooters = allFooters.filter(f => f.id !== id)

  if (allFooters.length === newFooters.length) {
    throw createError({ statusCode: 404, statusMessage: 'Footer link not found' })
  }

  await writeJSON('footers.json', newFooters)
  return { id }
}

export async function getFooterConfig(): Promise<FooterConfig> {
  const config = await readJSON<FooterConfig>('footer-config.json', {
    judul: 'PT. Dulank Semesta Cida',
    desc: 'Solusi percetakan offset dan digital printing profesional terpercaya...',
    copyright: '© 2026 PT. Dulank Semesta Cida — Semua hak dilindungi',
    infoKami: [
      { text: 'Kebijakan Privasi', href: '/privacy' },
      { text: 'Blog Edukasi Cetak', href: '/all-blog' },
      { text: 'Syarat dan Ketentuan', href: '/terms' },
    ],
    panduan: [
      { text: 'Cara Pembelian', href: '/faq' },
    ],
    alamat: 'Jl. Percetakan Negara No. 88, Jakarta Pusat',
    telepon: '+62 21 4256 7890',
    email: 'info@dulanksemesta.com',
    socials: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: '',
    },
  })

  return config
}

export async function saveFooterConfig(body: FooterConfig): Promise<FooterConfig> {
  if (!body) throw createError({ statusCode: 400, statusMessage: 'Payload configuration is required' })

  await writeJSON('footer-config.json', body)
  return body
}
