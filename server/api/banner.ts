import { mainBanners, productBanners } from '../data/banner'

// GET /api/banner — data mock: mainBanners, productBanners
export default defineEventHandler(() => {
  return { mainBanners, productBanners }
})
