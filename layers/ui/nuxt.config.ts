// Shared UI components layer - customizable via CSS variables
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const _layerDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  components: [
    {
      path: '~/app/components',
      pathPrefix: false,
    },
  ],
  css: [join(_layerDir, 'app/assets/css/components.css')],
})
