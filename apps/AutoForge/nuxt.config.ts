// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['nuxt-monaco-editor'],
  css: ['~/assets/css/app.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  extends: ['../../layers/base', '../../layers/ui'],
  devServer: {
    port: 3000,
  },
  ssr: false,
  app: {
    baseURL: '/',
    pageTransition: false,
    head: {
      titleTemplate: '%s | AutoForge',
      title: 'AutoForge',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'AutoForge - Technical interviews, DSA practice, resume building' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
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
      graphqlEndpoint: process.env.NUXT_PUBLIC_GRAPHQL_ENDPOINT,
      sampleApiBase: process.env.NUXT_PUBLIC_SAMPLE_API_BASE,
      appName: 'AutoForge',
      pistonUrl: process.env.NUXT_PUBLIC_PISTON_URL || 'https://emkc.org/api/v2/piston',
    },
  },
  nitro: {
    preset: 'node-server',
  },
})
