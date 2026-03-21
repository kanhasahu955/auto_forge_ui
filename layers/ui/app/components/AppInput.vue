<script setup lang="ts">
// Element Plus el-input wrapper - pass-through, no custom styles
</script>

<template>
  <el-input v-bind="$attrs">
    <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData || {}" />
    </template>
  </el-input>
</template>
