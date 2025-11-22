<script setup lang="ts">
defineOptions({
  name: 'Grid',
  inheritAttrs: false,
})

const props = defineProps<{
  columns?: number
  rows?: string | number
  columnGap?: number
  rowGap?: number
}>()
</script>

<template>
  <div
    class="formily-grid"
    :style="{
      display: 'grid',
      gridTemplateColumns: `repeat(${props.columns || 3}, 1fr)`,
      gridTemplateRows: props.rows === 'auto' ? 'auto' : `repeat(${props.rows || 'auto'}, 1fr)`,
      columnGap: `${props.columnGap || 16}px`,
      rowGap: `${props.rowGap || 16}px`,
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.formily-grid {
  width: 100%;
}
</style>
