<script setup lang="ts">
// Wraps el-tag with app-consistent styling
defineOptions({ inheritAttrs: false })
</script>
<template>
  <el-tag v-bind="$attrs">
    <slot />
  </el-tag>
</template>
