<script setup lang="ts">
defineOptions({
  name: 'Flex',
  inheritAttrs: false,
})

const props = defineProps<{
  direction?: 'row' | 'column'
  justify?: string
  align?: string
  wrap?: string
  gap?: number
}>()
</script>

<template>
  <div
    class="formily-flex"
    :style="{
      display: 'flex',
      flexDirection: props.direction || 'row',
      justifyContent: props.justify || 'flex-start',
      alignItems: props.align || 'flex-start',
      flexWrap: props.wrap || 'nowrap',
      gap: `${props.gap || 0}px`,
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.formily-flex {
  width: 100%;
}
</style>
