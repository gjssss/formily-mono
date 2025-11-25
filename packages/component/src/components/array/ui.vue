<script setup lang="ts">
defineOptions({
  name: 'Array',
  inheritAttrs: false,
})

const props = defineProps<{
  title?: string
  onAdd?: () => void
  onPush?: () => void
  onUnshift?: () => void
}>()
</script>

<template>
  <div class="formily-array">
    <div class="array-header">
      <div v-if="props.title" class="array-title">
        {{ props.title }}
      </div>
      <div class="array-actions">
        <ElButton type="primary" size="small" @click="props.onAdd">
          <ElIcon style="margin-right: 4px;">
            <Plus />
          </ElIcon>
          添加到末尾
        </ElButton>
        <ElButton size="small" @click="props.onUnshift">
          <ElIcon style="margin-right: 4px;">
            <Top />
          </ElIcon>
          添加到开头
        </ElButton>
      </div>
    </div>
    <div class="array-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.formily-array {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 16px;
  background: #fafafa;
}

.array-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.array-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.array-actions {
  display: flex;
  gap: 8px;
}

.array-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
