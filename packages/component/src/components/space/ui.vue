<script setup lang="ts">
defineOptions({
  name: 'Space',
  inheritAttrs: false,
})

const props = defineProps<{
  direction?: 'horizontal' | 'vertical'
  size?: number
  align?: string
}>()
</script>

<template>
  <div
    class="formily-space"
    :style="{
      display: 'flex',
      flexDirection: props.direction === 'vertical' ? 'column' : 'row',
      alignItems: props.align || 'center',
      gap: `${props.size || 8}px`,
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.formily-space {
  width: 100%;
}
</style>
