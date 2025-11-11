<script setup lang="ts">
import type { FormilyComponent } from '@formily-djd/component'
import { computed } from 'vue'

const props = defineProps<{
  components: Record<string, FormilyComponent>
}>()

// 按分类分组组件
const groupedComponents = computed(() => {
  const groups: Record<string, Array<{ key: string, component: FormilyComponent }>> = {}

  Object.entries(props.components).forEach(([key, component]) => {
    const category = component.config?.category || '其他'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push({ key, component })
  })

  return groups
})

// 处理组件点击（暂时只是示例，后续可以添加拖拽功能）
function handleComponentClick(key: string) {
  console.log('点击组件:', key)
  // TODO: 添加到画布的逻辑
}
</script>

<template>
  <div class="material-panel">
    <div class="panel-header">
      <h3>组件库</h3>
    </div>
    <div class="panel-content">
      <div
        v-for="(items, category) in groupedComponents"
        :key="category"
        class="category-group"
      >
        <div class="category-title">
          {{ category }}
        </div>
        <div class="component-grid">
          <div
            v-for="{ key, component } in items"
            :key="key"
            class="component-item"
            @click="handleComponentClick(key)"
          >
            <div class="component-icon">
              {{ component.config?.icon?.slice(0, 3) }}
            </div>
            <div class="component-name">
              {{ component.config?.name || key }}
            </div>
            <div v-if="component.config?.description" class="component-desc">
              {{ component.config.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.material-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid #e5e7eb;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.category-group {
  margin-bottom: 24px;
}

.category-group:last-child {
  margin-bottom: 0;
}

.category-title {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.component-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
}

.component-item:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.component-icon {
  font-size: 14px;
  color: #3b82f6;
  margin-bottom: 8px;
}

.component-name {
  font-size: 12px;
  font-weight: 500;
  color: #1f2937;
  text-align: center;
  line-height: 1.4;
}

.component-desc {
  font-size: 10px;
  color: #9ca3af;
  text-align: center;
  margin-top: 4px;
  line-height: 1.3;
}
</style>
