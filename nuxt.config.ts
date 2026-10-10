import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/4.x/api/nuxt-config
export default defineNuxtConfig({
  // Frontend uses Nuxt 4's app/ directory; backend and public assets stay at root.
  serverDir: './server',
  compatibilityDate: '2025-01-01',
  debug: false,
  nitro: {
    timing: false
  },
  devtools: { enabled: false },
  modules: [
    '@pinia/nuxt'
  ],
  alias: {
    '#server': fileURLToPath(new URL('./server', import.meta.url)),
    '~/server': fileURLToPath(new URL('./server', import.meta.url)),
    '@/server': fileURLToPath(new URL('./server', import.meta.url)),
    '~/types': fileURLToPath(new URL('./server/types', import.meta.url)),
    '@/types': fileURLToPath(new URL('./server/types', import.meta.url))
  },
  vite: {
    plugins: [tailwindcss()]
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
      // Compatibility files remain importable by path but must not collide with newer page components.
      ignore: [
        'Address/AddressViewModal.vue',
        'Customers/CustomerViewModal.vue',
        'Department/DepartmentModal.vue',
        'Department/DepartmentTable.vue',
        'MyIncentive/**',
        'MyJob/**',
        'Payslip/PayslipModal.vue',
        'Payslip/PayslipTable.vue',
        // App/Layout components are consumed through explicit imports; keep them out of
        // auto-registration to avoid duplicate basename collisions with Layout/.
        'App/**'
      ]
    }
  ],
  app: {
    head: {
      title: 'Kacetak System',
      htmlAttrs: {
        lang: 'en',
        dir: 'ltr'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=0' },
        { name: 'description', content: 'POS & Printing Management System - Kacetak System' }
      ],
      link: [
        { rel: 'icon', type: 'image/jpeg', href: '/assets/img/kacetak.jpeg' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap'
        }
      ]
    }
  },
  css: [
    '~/assets/css/main.css'
  ],
  hooks: {
    'pages:extend'(pages) {
      // Compatibility for legacy .html URLs
      const aliasPages: typeof pages = []
      for (const page of pages) {
        if (page.path && page.path !== '/' && !page.path.endsWith('.html')) {
          aliasPages.push({
            name: `${page.name}-html-alias`,
            path: `${page.path}.html`,
            file: page.file
          })
        }
      }
      pages.push(...aliasPages)
    }
  }
})
