import { fileList } from '../data/download-files'

// GET /api/download-files — data mock fileList
export default defineEventHandler(() => {
  return fileList
})
