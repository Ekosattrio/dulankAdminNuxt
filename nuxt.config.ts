// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
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

