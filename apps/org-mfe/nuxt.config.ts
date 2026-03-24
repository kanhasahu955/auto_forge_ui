// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  extends: ['../../layers/base', '../../layers/ui'],
  css: ['~/assets/css/app.css'],
  vite: { plugins: [tailwindcss()] },
  devServer: { port: 3003 },
  ssr: false,
  robots: { robotsTxt: false },
  site: {
    name: 'Organizations',
    url: process.env.NUXT_SITE_URL || 'https://example.com',
  },
  app: {
    pageTransition: false,
    baseURL: process.env.NUXT_APP_BASE_URL || '/organizations/',
    head: {
      titleTemplate: '%s | Organizations',
      title: 'Organizations',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000',
      orgApiBase: process.env.NUXT_PUBLIC_ORG_API_BASE || 'http://localhost:8007',
      appName: 'AutoForge Organizations',
    },
  },
  nitro: { preset: 'node-server' },
})
