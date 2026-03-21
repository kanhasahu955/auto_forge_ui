<script setup lang="ts">
/**
 * Reusable themed button - wraps Element Plus el-button with app-specific styling.
 * Variants: primary | secondary | success | danger | ghost
 * Sizes: small | default | large
 */
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
    size?: 'small' | 'default' | 'large'
    plain?: boolean
    round?: boolean
    circle?: boolean
    loading?: boolean
    disabled?: boolean
    block?: boolean
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
  props.variant === 'secondary' || props.variant === 'ghost' || props.plain
)

const buttonClass = computed(() => [
  'app-btn',
  `app-btn--${props.variant}`,
  `app-btn--${props.size}`,
  { 'app-btn--block': props.block },
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
