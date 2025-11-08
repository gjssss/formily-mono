<script setup lang="ts">
defineOptions({
  name: 'ArrayItem',
  inheritAttrs: false,
})
const props = defineProps<{
  arrayIndex?: number
  onAdd?: () => void
  onRemove?: (index: number) => void
  onMoveUp?: (index: number) => void
  onMoveDown?: (index: number) => void
}>()
</script>

<template>
  <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
    <div style="margin-bottom: 5px; font-weight: bold;">
      ArrayItem #{{ props.arrayIndex }}
    </div>
    <slot />
    <div style="margin-top: 10px;">
      <ElButton size="small" @click="props.onAdd">
        添加
      </ElButton>
      <ElButton size="small" @click="() => props.onRemove?.(props.arrayIndex!)" style="margin-left: 4px;">
        删除
      </ElButton>
      <ElButton size="small" @click="() => props.onMoveUp?.(props.arrayIndex!)" style="margin-left: 4px;">
        上移
      </ElButton>
      <ElButton size="small" @click="() => props.onMoveDown?.(props.arrayIndex!)" style="margin-left: 4px;">
        下移
      </ElButton>
    </div>
  </div>
</template>
