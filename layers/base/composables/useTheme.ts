import { useDark, useToggle } from '@vueuse/core'

/**
 * Dark/light theme toggle - uses VueUse useDark.
 * Shared across all MFE apps. Storage key is shared so theme persists across apps.
 */
export function useTheme() {
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
    storageKey: 'mfe-theme',
  })
  const toggleDark = useToggle(isDark)

  return { isDark, toggleDark }
}
