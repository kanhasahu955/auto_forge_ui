// Shared UI components layer
// Components in app/components/ must be explicitly registered (layer uses app/ subdir)
export default defineNuxtConfig({
  components: [
    {
      path: '~/app/components',
      pathPrefix: false,
    },
  ],
})
