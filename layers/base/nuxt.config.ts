// https://nuxt.com/docs/api/configuration/nuxt-config
// Shared base layer for all microfrontends - SPA mode
import graphqlLoader from 'vite-plugin-graphql-loader'

export default defineNuxtConfig({
  vite: {
    plugins: [graphqlLoader()],
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false, // SPA mode
  modules: ['@element-plus/nuxt', '@nuxtjs/seo'],
  elementPlus: {
    importStyle: 'css',
  },
  // @nuxtjs/seo - sitemap, robots, meta (SPA-friendly)
  ogImage: { enabled: false }, // Requires SSR; disable for SPA
  site: {
    url: process.env.NUXT_SITE_URL || 'https://example.com',
    name: process.env.NUXT_SITE_NAME || 'Nuxt MFE Platform',
    description: process.env.NUXT_SITE_DESCRIPTION || 'Production-ready Nuxt microfrontend platform',
  },
  nitro: {
    preset: 'node-server',
  },
  runtimeConfig: {
    apiSecret: '',
    apiBase: '',
    graphqlEndpoint: '',
    sampleApiBase: '',
    public: {
      apiBase: '',
      graphqlEndpoint: '',
      sampleApiBase: '',
      appName: 'App',
    },
  },
})
