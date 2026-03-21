<script setup lang="ts">
// @ts-nocheck


const slots = useSlots()
const slotNamesList = Object.keys(slots ?? {})
function slotBind(data) {
  return data && typeof data === 'object' && !Array.isArray(data) ? data : {}
}
</script>
<template>
  <el-tooltip v-bind="$attrs">
    <template v-for="name in slotNamesList" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotBind(slotData)" />
    </template>
  </el-tooltip>
</template>
