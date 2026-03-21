<script setup lang="ts">
import type { ButtonType, ButtonSize } from 'element-plus'

defineProps<{
  type?: ButtonType
  size?: ButtonSize
  plain?: boolean
  round?: boolean
  circle?: boolean
  disabled?: boolean
  loading?: boolean
}>()
</script>

<template>
  <el-button v-bind="$props">
    <slot />
  </el-button>
</template>
