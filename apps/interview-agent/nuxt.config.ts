// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  extends: ['../../layers/base', '../../layers/ui'],
  devServer: {
    port: 3001,
  },
  ssr: false, // SPA
  robots: { robotsTxt: false }, // Host app generates robots; skip for sub-app
  app: {
    baseURL: '/interview-agent/',
    head: {
      title: 'Interview Agent',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Interview Agent - Microfrontend app' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/interview-agent/favicon.ico' }],
    },
  },
  runtimeConfig: {
    apiSecret: process.env.NUXT_API_SECRET,
    graphqlEndpoint: process.env.NUXT_GRAPHQL_ENDPOINT,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      graphqlEndpoint: process.env.NUXT_PUBLIC_GRAPHQL_ENDPOINT,
      sampleApiBase: process.env.NUXT_PUBLIC_SAMPLE_API_BASE,
      appName: 'Interview Agent',
    },
  },
  nitro: {
    preset: 'node-server'
  }
})