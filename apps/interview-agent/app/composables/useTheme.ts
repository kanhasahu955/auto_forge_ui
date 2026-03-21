import { useDark, useToggle } from '@vueuse/core'

/**
 * Dark/light theme toggle - uses VueUse useDark
 */
export function useTheme() {
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
    storageKey: 'interview-agent-theme',
  })
  const toggleDark = useToggle(isDark)

  return { isDark, toggleDark }
}
