<script setup lang="ts">
defineProps<{
  header?: string
  shadow?: 'always' | 'hover' | 'never'
}>()
</script>

<template>
  <el-card v-bind="$props">
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <slot />
  </el-card>
</template>
