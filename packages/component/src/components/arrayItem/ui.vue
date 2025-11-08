<script setup lang="ts">
defineOptions({
  name: 'ArrayItem',
  inheritAttrs: false,
})
const props = defineProps<{
  arrayIndex?: number
  onAdd?: () => void
  onDelete?: (index?: number) => void
}>()
</script>

<template>
  <div>
    <div>ArrayItem {{ props.arrayIndex }}</div>
    <slot />
    <ElButton @click="props.onAdd">
      添加
    </ElButton>
    <ElButton @click="() => props.onDelete?.(props.arrayIndex)">
      删除
    </ElButton>
  </div>
</template>
