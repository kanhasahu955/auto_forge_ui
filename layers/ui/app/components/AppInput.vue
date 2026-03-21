<script setup lang="ts">
// @ts-nocheck


const slots = useSlots()
const slotNamesList = Object.keys(slots ?? {})
function slotBind(data) {
  return data && typeof data === 'object' && !Array.isArray(data) ? data : {}
}
// Element Plus el-input wrapper - pass-through, no custom styles
</script>

<template>
  <el-input v-bind="$attrs">
    <template v-for="name in slotNamesList" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotBind(slotData)" />
    </template>
  </el-input>
</template>
