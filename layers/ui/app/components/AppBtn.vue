<script setup lang="ts">
/**
 * Reusable themed button - customizable via props and CSS variables.
 *
 * Variants: primary | secondary | success | danger | ghost | outline
 * Sizes: small | default | large
 *
 * Theming: Set --app-accent, --app-accent-hover in :root to customize.
 * Add class="app-root" to your root element for styles to apply.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline'
    size?: 'small' | 'default' | 'large'
    plain?: boolean
    round?: boolean
    circle?: boolean
    loading?: boolean
    disabled?: boolean
    block?: boolean
    /** Custom class for app-specific overrides */
    customClass?: string
  }>(),
  {
    variant: 'primary',
    size: 'default',
    plain: false,
    round: false,
    circle: false,
    loading: false,
    disabled: false,
    block: false,
  }
)

const elType = computed(() => {
  if (props.variant === 'primary') return 'primary'
  if (props.variant === 'success') return 'success'
  if (props.variant === 'danger') return 'danger'
  return 'default'
})

const isPlain = computed(() =>
  props.variant === 'secondary' || props.variant === 'ghost' || props.variant === 'outline' || props.plain
)

const resolvedVariant = computed(() =>
  props.variant === 'outline' ? 'secondary' : props.variant
)

const buttonClass = computed(() => [
  'app-btn',
  `app-btn--${resolvedVariant}`,
  `app-btn--${props.size}`,
  { 'app-btn--block': props.block },
  props.customClass,
])
</script>

<template>
  <el-button
    v-bind="$attrs"
    :type="elType"
    :plain="isPlain"
    :size="size"
    :round="round"
    :circle="circle"
    :loading="loading"
    :disabled="disabled"
    :class="buttonClass"
  >
    <slot />
  </el-button>
</template>
