// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['../../layers/base', '../../layers/ui'],
  devtools: { enabled: true },
  ssr: false, // SPA
  app: {
    baseURL: '/',
    head: {
      title: 'AutoForge',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'AutoForge - Host application' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  runtimeConfig: {
    apiBase: process.env.NUXT_API_BASE,
    graphqlEndpoint: process.env.NUXT_GRAPHQL_ENDPOINT,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      graphqlEndpoint: process.env.NUXT_PUBLIC_GRAPHQL_ENDPOINT,
      sampleApiBase: process.env.NUXT_PUBLIC_SAMPLE_API_BASE,
      appName: 'AutoForge',
    },
  },
})
