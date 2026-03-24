// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'
import tailwindcss from '@tailwindcss/vite'

const _root = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  alias: {
    '#base': join(_root, '../../layers/base'),
  },
  modules: ['nuxt-monaco-editor'],
  css: ['~/assets/css/app.css'],
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/auth': { target: 'http://localhost:3002', changeOrigin: true },
        '/api/v1/auth': { target: 'http://localhost:8001', changeOrigin: true },
      },
    },
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
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000',
      authApiBase: process.env.NUXT_PUBLIC_AUTH_API_BASE || 'http://localhost:8001',
      orgApiBase: process.env.NUXT_PUBLIC_ORG_API_BASE || 'http://localhost:8007',
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
