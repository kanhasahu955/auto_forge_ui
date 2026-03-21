/**
 * SEO composable - per-page meta tags (SPA-friendly)
 * Use in pages: usePageSeo({ title: 'My Page', description: '...' })
 * Works with @nuxtjs/seo for sitemap, robots, schema
 */
export function usePageSeo(options: {
  title?: string
  description?: string
  image?: string
  url?: string
  ogType?: 'website' | 'article'
}) {
  const config = useRuntimeConfig()
  const appName = config.public.appName || 'App'

  useSeoMeta({
    title: options.title ?? appName,
    description: options.description,
    ogTitle: options.title ?? appName,
    ogDescription: options.description,
    ogImage: options.image,
    ogUrl: options.url,
    ogType: options.ogType ?? 'website',
  })

  if (options.title) {
    useHead({ title: options.title })
  }
}
