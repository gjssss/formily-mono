<script setup lang="ts">
import type { FormilyComponent } from '@formily-djd/component'

const props = defineProps<{
  visible: boolean
  groupedComponents: Record<string, Array<{ key: string, component: FormilyComponent }>>
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'select', key: string, component: FormilyComponent): void
}>()
</script>

<template>
  <ElDialog
    :model-value="props.visible"
    title="选择组件"
    width="600px"
    :close-on-click-modal="false"
    @update:model-value="emit('update:visible', $event)"
  >
    <div class="component-picker-content">
      <div
        v-for="(items, category) in props.groupedComponents"
        :key="category"
        class="picker-category-group"
      >
        <div class="picker-category-title">
          {{ category }}
        </div>
        <div class="picker-component-grid">
          <div
            v-for="{ key, component } in items"
            :key="key"
            class="picker-component-item"
            @click="emit('select', key, component)"
          >
            <div class="picker-component-icon">
              {{ component.config?.icon?.slice(0, 3) }}
            </div>
            <div class="picker-component-name">
              {{ component.config?.name || key }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </ElDialog>
</template>

<style scoped>
.component-picker-content {
  max-height: 70vh;
  overflow-y: auto;
  padding: 16px;
}

.picker-category-group {
  margin-bottom: 24px;
}

.picker-category-group:last-child {
  margin-bottom: 0;
}

.picker-category-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.picker-component-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.picker-component-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 8px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: var(--el-bg-color);
}

.picker-component-item:hover {
  border-color: var(--el-color-primary);
  box-shadow: var(--el-box-shadow-light);
  transform: translateY(-2px);
}

.picker-component-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--el-color-primary);
  color: var(--el-color-white);
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.picker-component-name {
  font-size: 12px;
  color: var(--el-text-color-regular);
  text-align: center;
  word-break: break-word;
}
</style>
