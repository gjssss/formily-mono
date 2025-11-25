<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'Space',
  inheritAttrs: false,
})

const props = defineProps<{
  direction?: 'horizontal' | 'vertical'
  size?: number
}>()

const style = computed(() => {
  const { direction, size } = props
  if (direction === 'vertical') {
    return {
      width: '100%',
      height: `${size || 8}px`,
    }
  }
  return {
    width: `${size || 8}px`,
    height: '100%',
  }
})
</script>

<template>
  <div :style />
</template>
