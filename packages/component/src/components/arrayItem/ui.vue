<script setup lang="ts">
defineOptions({
  name: 'ArrayItem',
  inheritAttrs: false,
})

const props = defineProps<{
  arrayIndex?: number
  disabled?: boolean
  onAdd?: () => void
  onRemove?: (index: number) => void
  onMoveUp?: (index: number) => void
  onMoveDown?: (index: number) => void
}>()
</script>

<template>
  <div class="formily-array-item">
    <div class="array-item-header">
      <div class="array-item-index">
        # {{ (props.arrayIndex ?? 0) + 1 }}
      </div>
      <div class="array-item-actions">
        <ElButton
          text
          type="primary"
          size="small"
          :disabled="props.disabled"
          @click="props.onAdd"
        >
          添加
        </ElButton>
        <ElButton
          text
          size="small"
          :disabled="props.disabled"
          @click="() => props.onMoveUp?.(props.arrayIndex!)"
        >
          上移
        </ElButton>
        <ElButton
          text
          size="small"
          :disabled="props.disabled"
          @click="() => props.onMoveDown?.(props.arrayIndex!)"
        >
          下移
        </ElButton>
        <ElButton
          text
          type="danger"
          size="small"
          :disabled="props.disabled"
          @click="() => props.onRemove?.(props.arrayIndex!)"
        >
          删除
        </ElButton>
      </div>
    </div>
    <div class="array-item-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.formily-array-item {
  width: 100%;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background: #ffffff;
  transition: all 0.2s;
}

.formily-array-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.array-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  border-radius: 4px 4px 0 0;
}

.array-item-index {
  font-size: 13px;
  font-weight: 600;
  color: #606266;
}

.array-item-actions {
  display: flex;
  gap: 4px;
}

.array-item-content {
  padding: 12px;
}
</style>
