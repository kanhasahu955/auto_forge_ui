// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  extends: ['../../layers/base', '../../layers/ui'],
  css: ['~/assets/css/app.css'],
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/api/v1/auth': { target: 'http://localhost:8001', changeOrigin: true },
      },
    },
  },
  devServer: { port: 3002 },
  ssr: false,
  robots: { robotsTxt: false },
  site: {
    name: 'Auth',
    url: process.env.NUXT_SITE_URL || 'https://example.com',
  },
  app: {
    pageTransition: false,
    baseURL: process.env.NUXT_APP_BASE_URL || '/auth/',
    head: {
      titleTemplate: '%s | AutoForge Auth',
      title: 'Sign in',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
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
      authApiBase: process.env.NUXT_PUBLIC_AUTH_API_BASE || 'http://localhost:8001', // Direct to auth service (CORS enabled)
      appName: 'AutoForge Auth',
    },
  },
  nitro: { preset: 'node-server' },
})
