<script setup lang="ts">
/**
 * Reusable tag/badge - forwards all Element Plus el-tag props.
 * Use type, size, effect, etc. for theming.
 * Customize via :root CSS variables or el-tag's built-in props.
 */
defineOptions({ inheritAttrs: false })
</script>
<template>
  <el-tag v-bind="$attrs">
    <slot />
  </el-tag>
</template>
