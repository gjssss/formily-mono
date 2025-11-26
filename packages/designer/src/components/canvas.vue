<script setup lang="ts">
import type { FormilyComponent } from '@formily-djd/component'
import { uid } from '@formily/shared'
import { computed, provide, ref } from 'vue'
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

// 是否在拖拽区域上方
const isDragOver = ref(false)

// 计算画布是否为空
const isEmpty = computed(() => {
  const properties = store.formSchema.value?.properties
  return !properties || Object.keys(properties).length === 0
})

// 处理点击事件 - 深度优先选中
function handleClick(event: MouseEvent) {
  // 使用 closest 查找最近的带有 data-node-id 的元素
  const target = event.target as HTMLElement
  const el = target.closest('[data-node-id]')

  if (el) {
    const nodeId = el.getAttribute('data-node-id')
    if (nodeId) {
      console.log(nodeId)
      store.selectNode(nodeId)
    }
  }
  else {
    // 点击空白处取消选中
    store.selectNode(null)
  }
}

// 处理鼠标移动事件 - 更新悬浮状态
function handleMouseMove(event: MouseEvent) {
  const target = event.target as HTMLElement
  const el = target.closest('[data-node-id]')

  const nodeId = el?.getAttribute('data-node-id')

  // 更新悬停状态
  store.setHover(nodeId || null)

  // 如果正在拖拽，更新拖拽位置
  if (store.isDragging.value) {
    const point = {
      x: event.clientX,
      y: event.clientY,
    }
    store.updateDragPosition(point, nodeId || undefined)
  }
}

// 处理鼠标离开事件 - 清除悬浮状态
function handleMouseLeave() {
  store.setHover(null)
}

/**
 * 处理拖拽进入
 */
function handleDragOver(event: DragEvent) {
  // 如果 draggable = false，禁止 Canvas 拖拽
  if (!store.draggable) {
    return
  }

  event.preventDefault()
  event.stopPropagation()

  if (!event.dataTransfer)
    return

  // 设置拖放效果
  const hasDragNodes = store.dragNodes.value.length > 0
  event.dataTransfer.dropEffect = hasDragNodes ? 'move' : 'copy'
  isDragOver.value = true

  // 如果还没有启动拖拽状态，则启动（用于从物料库拖拽的情况）
  if (!store.isDragging.value) {
    store.startDrag([]) // 空数组表示从物料库拖拽
  }

  // 获取鼠标位置和目标节点
  const target = event.target as HTMLElement
  const el = target.closest('[data-node-id]')
  const nodeId = el?.getAttribute('data-node-id')

  const point = {
    x: event.clientX,
    y: event.clientY,
  }

  // 更新拖拽位置
  store.updateDragPosition(point, nodeId || undefined)
}

/**
 * 处理拖拽离开
 */
function handleDragLeave(event: DragEvent) {
  const target = event.target as HTMLElement
  // 只在真正离开画布容器时才设置为 false
  if (target.classList.contains('canvas-content')) {
    isDragOver.value = false
  }
}

/**
 * 处理放置
 */
function handleDrop(event: DragEvent) {
  // 如果 draggable = false，禁止 Canvas 放置
  if (!store.draggable) {
    return
  }

  console.log('[Canvas] handleDrop')
  event.preventDefault()
  event.stopPropagation()

  isDragOver.value = false

  if (!event.dataTransfer)
    return

  try {
    const dataStr = event.dataTransfer.getData('application/json')
    if (!dataStr)
      return

    const dragData = JSON.parse(dataStr)
    console.log('dragData', dragData)

    if (dragData.type === 'new-component') {
      // 从物料库拖拽新组件
      handleDropNewComponent(dragData)
    }
    else if (dragData.type === 'move-component') {
      // 画布内移动组件
      handleDropMoveComponent()
    }
  }
  catch (error) {
    console.error('解析拖拽数据失败:', error)
  }
}

/**
 * 处理放置新组件
 */
function handleDropNewComponent(dragData: any) {
  const { componentKey, defaultSchema } = dragData

  if (!defaultSchema) {
    console.warn('组件缺少 defaultSchema:', componentKey)
    return
  }

  // 使用 uid 生成唯一的字段名，添加前缀确保不以数字开头
  const fieldName = `f_${uid()}`

  // 获取目标位置
  const targetPath = store.closestNode.value
  const position = store.closestPosition.value

  if (!targetPath) {
    // 空画布，直接添加到根
    store.addField(fieldName, defaultSchema)
  }
  else {
    // 插入到指定位置
    store.insertField(targetPath, fieldName, defaultSchema, position)
  }

  // 自动选中新添加的字段
  store.selectNode(fieldName)

  // 清理拖拽状态
  store.cancelDrag()
}

/**
 * 处理画布内组件移动
 */
function handleDropMoveComponent() {
  // 直接调用 store 的 drop 方法执行移动
  // Dragon 引擎已经计算好了 closestNode 和 closestPosition
  store.drop()
}
</script>

<template>
  <div class="canvas djd-design">
    <div
      class="canvas-content"
      :class="{ 'drag-over': isDragOver, 'empty': isEmpty }"
      @click="handleClick"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <CanvasField v-if="store.formSchema.value" :schema="store.formSchema.value" />

      <!-- 辅助工具层：选中框和悬浮框 -->
      <AuxToolWidget />
    </div>
  </div>
</template>

<style scoped>
.canvas {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.canvas h3 {
  margin: 0 0 16px 0;
  padding: 0;
  flex-shrink: 0;
}

.canvas-content {
  position: relative;
  /* 为辅助工具层提供定位上下文 */
  flex: 1;
  padding: 16px;
  min-height: 400px;
  transition: all 0.2s;
  background-color: transparent;
  overflow-y: auto;
}

/* 拖拽时的样式 */
.canvas-content.drag-over {
  background-color: rgba(59, 130, 246, 0.05);
}

/* 空画布样式 */
.canvas-content.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
}

.empty-canvas {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.empty-hint {
  text-align: center;
  color: #9ca3af;
}

.empty-icon {
  color: #d1d5db;
  margin: 0 auto 16px;
}

.empty-hint p {
  font-size: 14px;
  margin: 0;
}

/* 拖拽时隐藏空画布提示 */
.canvas-content.drag-over .empty-canvas {
  opacity: 0;
}
</style>
