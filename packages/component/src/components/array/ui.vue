<script setup lang="ts">
defineOptions({
  name: 'Array',
  inheritAttrs: false,
})
const props = defineProps<{
  title?: string
  onAdd?: () => void
}>()
</script>

<template>
  <div>
    <div>array title: {{ props.title }}</div>
    <ElButton @click="props.onAdd">
      添加
    </ElButton>
    <div>--------------------------------</div>
    <slot />
    <div>--------------------------------</div>
  </div>
</template>
