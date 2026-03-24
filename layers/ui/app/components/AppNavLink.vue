<template>
  <NuxtLink
    v-if="!external"
    :to="to"
    class="nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all"
    :exact-active-class="exact ? 'nav-link-active bg-[var(--app-accent)]/10' : undefined"
    :active-class="exact ? undefined : 'nav-link-active bg-[var(--app-accent)]/10'"
  >
    <slot />
  </NuxtLink>
  <a
    v-else
    :href="to"
    class="nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all"
    :class="activeClass"
  >
    <slot />
  </a>
</template>

<script setup lang="ts">
type Props = {
  to: string
  exact?: boolean
  external?: boolean
  /** For external links, optional active class when current path matches */
  activeClass?: string
}

withDefaults(defineProps<Props>(), {
  exact: false,
  external: false,
  activeClass: '',
})
</script>
