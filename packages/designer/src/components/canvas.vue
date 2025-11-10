<script setup lang="ts">
import type { FormilyComponent } from '@formily-djd/component'
import { provide, watch } from 'vue'
import { useDesignStore } from '@/core/useDesignStore'
import { ComponentSettingsKey } from '@/shared'
import AuxToolWidget from './auxTool/AuxToolWidget.vue'
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

// 处理点击事件 - 深度优先选中
function handleClick(event: MouseEvent) {
  // 使用 closest 查找最近的带有 data-node-id 的元素
  const target = event.target as HTMLElement
  const el = target.closest('[data-node-id]')

  if (el) {
    const nodeId = el.getAttribute('data-node-id')
    if (nodeId) {
      // 提取顶层字段名（取路径的第一部分）
      // 例如："array.items.properties.input" -> "array"
      const parts = nodeId.split('.')
      const topLevelFieldName = parts[0]

      // 同时更新 nodeId 和 fieldName
      // nodeId 用于选中框定位，fieldName 用于配置面板
      store.selectNode(nodeId, topLevelFieldName)
    }
  }
  else {
    // 点击空白处取消选中
    store.selectNode(null, null)
  }
}

// 处理鼠标移动事件 - 更新悬浮状态
function handleMouseMove(event: MouseEvent) {
  const target = event.target as HTMLElement
  const el = target.closest('[data-node-id]')

  if (el) {
    const nodeId = el.getAttribute('data-node-id')
    store.setHover(nodeId)
  }
  else {
    store.setHover(null)
  }
}

// 处理鼠标离开事件 - 清除悬浮状态
function handleMouseLeave() {
  store.setHover(null)
}
</script>

<template>
  <div class="canvas djd-design">
    <h3>画布</h3>

    <div
      class="canvas-content"
      @click="handleClick"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      <CanvasField
        v-if="store.formSchema.value"
        :schema="store.formSchema.value"
      />

      <!-- 辅助工具层：选中框和悬浮框 -->
      <AuxToolWidget />
    </div>
  </div>
</template>

<style scoped>
.canvas {
  height: 100%;
}

.canvas-content {
  position: relative; /* 为辅助工具层提供定位上下文 */
  padding: 16px;
  min-height: 400px;
}
</style>
