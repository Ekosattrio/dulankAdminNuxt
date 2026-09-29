// Contoh endpoint server (Nitro). Struktur server/ satu level dengan app/.
// Catatan: pada Nuxt 4.6+ gunakan `import { defineEventHandler } from 'nuxt/server'`;
// pada 4.5.x helper berikut ter-auto-import dari h3.
export default defineEventHandler(() => {
  return {
    status: 'ok',
    app: 'dulank-admin-nuxt',
    nuxt: '4.x',
    time: new Date().toISOString(),
  }
})