// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
import graphqlLoader from 'vite-plugin-graphql-loader'

export default defineNuxtConfig({
  modules: ['nuxt-monaco-editor'],
  css: ['~/assets/css/app.css'],
  vite: {
    plugins: [graphqlLoader(), tailwindcss()],
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  extends: ['../../layers/base', '../../layers/ui'],
  devServer: {
    port: 3001,
  },
  ssr: false, // SPA
  robots: { robotsTxt: false }, // Host app generates robots; skip for sub-app
  site: {
    name: 'Interview Agent',
    url: process.env.NUXT_SITE_URL || 'https://example.com',
  },
  app: {
    pageTransition: false,
    // Use / when running standalone (localhost:3001); /interview-agent/ when behind nginx
    baseURL: process.env.NUXT_APP_BASE_URL || (process.env.NODE_ENV === 'development' ? '/' : '/interview-agent/'),
    head: {
      titleTemplate: '%s | Interview Agent',
      title: 'Interview Agent',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Interview Agent - Microfrontend app' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/interview-agent/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
        },
      ],
    },
  },
  runtimeConfig: {
    apiSecret: process.env.NUXT_API_SECRET,
    graphqlEndpoint: process.env.NUXT_GRAPHQL_ENDPOINT,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      authApiBase: process.env.NUXT_PUBLIC_AUTH_API_BASE || 'http://localhost:8001',
      graphqlEndpoint: process.env.NUXT_PUBLIC_GRAPHQL_ENDPOINT,
      sampleApiBase: process.env.NUXT_PUBLIC_SAMPLE_API_BASE,
      appName: 'Interview Agent',
      /** Override Piston API URL - e.g. your own Piston instance. Public emkc.org is whitelist-only since 2/2026. */
      pistonUrl: process.env.NUXT_PUBLIC_PISTON_URL || 'https://emkc.org/api/v2/piston',
    },
  },
  nitro: {
    preset: 'node-server',
  },
})