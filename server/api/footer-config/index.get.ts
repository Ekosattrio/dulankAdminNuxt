import type { FooterConfig } from '#server/types/footer'

export default defineEventHandler(async () => {
  const config = await readJSON<FooterConfig>('footer-config.json', {
    judul: 'PT. Dulank Semesta Cida',
    desc: 'Solusi percetakan offset dan digital printing profesional terpercaya...',
    copyright: '© 2026 PT. Dulank Semesta Cida — Semua hak dilindungi',
    infoKami: [
      { text: 'Kebijakan Privasi', href: '/privacy' },
      { text: 'Blog Edukasi Cetak', href: '/all-blog' },
      { text: 'Syarat dan Ketentuan', href: '/terms' }
    ],
    panduan: [
      { text: 'Cara Pembelian', href: '/faq' }
    ],
    alamat: 'Jl. Percetakan Negara No. 88, Jakarta Pusat',
    telepon: '+62 21 4256 7890',
    email: 'info@dulanksemesta.com',
    socials: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: ''
    }
  })
  return createResponse(config, 'Footer config retrieved successfully')
})
