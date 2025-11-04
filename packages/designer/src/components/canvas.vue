<script setup lang="ts">
import type { FormilyComponent } from '@formily-djd/component'
import { provide, watch } from 'vue'
import { useDesignStore } from '@/core/useDesignStore'
import { ComponentSettingsKey } from '@/shared'
import CanvasField from './canvasField/index.vue'

const props = defineProps<{
  components: Record<string, FormilyComponent>
}>()

provide(ComponentSettingsKey, props.components)

// 获取设计器状态
const store = useDesignStore()

watch(store.formSchema, (newSchema) => {
  console.log('formSchema changed', newSchema)
}, { deep: true })
</script>

<template>
  <div class="canvas djd-design">
    <h3>画布</h3>

    <div class="canvas-content">
      <CanvasField
        v-if="store.formSchema.value"
        :schema="store.formSchema.value"
      />
    </div>
  </div>
</template>

<style scoped>
.canvas {
  height: 100%;
}

.canvas-content {
  padding: 16px;
}

:deep(.design-field-wrapper) {
  padding: 12px;
  margin: 8px 0;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

:deep(.design-field-wrapper:hover) {
  border-color: #c0c4cc;
  background-color: #fafafa;
}

:deep(.design-field-wrapper.active) {
  border-color: #409eff;
  background-color: #ecf5ff;
}

:deep(.field-title) {
  font-size: 12px;
  color: #606266;
  margin-bottom: 4px;
  font-weight: 500;
}
</style>
