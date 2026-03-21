<script setup lang="ts">
// @ts-nocheck
const slots = useSlots()
const slotNamesList = Object.keys(slots ?? {})
function slotBind(data: unknown) {
  return data && typeof data === 'object' && !Array.isArray(data) ? (data as Record<string, unknown>) : {}
}
</script>
<template>
  <el-button v-bind="$attrs">
    <template v-for="name in slotNamesList" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotBind(slotData)" />
    </template>
  </el-button>
</template>
