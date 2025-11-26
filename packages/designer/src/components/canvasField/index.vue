<script setup lang="ts">
import type { FormilyComponent } from '@formily-djd/component'
import type { ISchema } from '@formily/json-schema'
import { computed, inject } from 'vue'
import { useDesignStore } from '@/core/useDesignStore'
import { ComponentSettingsKey } from '@/shared'
import { buildComponentProps, shouldRecurse, shouldRenderArrayComponent } from './utils'

defineOptions({
  name: 'CanvasField',
})

const props = defineProps<{
  schema?: ISchema
  fieldName?: string
  nodePath?: string // 节点路径，用于唯一标识组件（如 "username" 或 "array.items.properties.input"）
}>()

const ComponentSettings = inject<Record<string, FormilyComponent>>(ComponentSettingsKey) ?? {}
const store = useDesignStore()

const xComponent = computed(() => props.schema?.['x-component'])

// 当前节点的完整路径
const currentNodePath = computed(() => {
  if (!props.nodePath)
    return props.fieldName || ''
  if (!props.fieldName)
    return props.nodePath
  return props.nodePath ? `${props.nodePath}.${props.fieldName}` : props.fieldName
})

// 判断当前组件是否被选中（只有选中的组件才可以拖拽）
const isSelected = computed(() => {
  return store.selectedNodeId.value === currentNodePath.value
})

// 判断是否可以拖拽
const isDraggable = computed(() => {
  // 如果全局 draggable = false，禁用拖拽
  if (!store.draggable) {
    return false
  }
  // 根节点不可拖拽
  if (!props.fieldName)
    return false
  // 只有选中的组件可以拖拽
  return isSelected.value
})

// 用于生成子节点路径的基础路径
function getChildBasePath(): string {
  if (props.schema?.type === 'array')
    return currentNodePath.value ? `${currentNodePath.value}.items` : ''
  else
    return currentNodePath.value ? `${currentNodePath.value}.properties` : ''
}

// 判断是否为空容器（需要显示占位符）
const isEmptyContainer = computed(() => {
  const schema = props.schema
  if (!schema)
    return false

  // 检查 x-droppable 标记
  if (schema['x-droppable'] === false) {
    return false
  }

  const isContainerType = schema.type === 'object' || schema.type === 'void'
  const hasNoChildren = !schema.properties || Object.keys(schema.properties).length === 0

  return isContainerType && hasNoChildren
})

/**
 * 处理拖拽开始
 */
function handleDragStart(event: DragEvent) {
  if (!isDraggable.value || !event.dataTransfer)
    return

  // event.stopPropagation() // 阻止事件冒泡到父节点

  // 设置拖拽数据
  const dragData = {
    type: 'move-component',
    nodePath: currentNodePath.value,
    fieldName: props.fieldName,
    schema: props.schema,
  }

  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('application/json', JSON.stringify(dragData))

  // 设置拖拽开始状态
  store.startDrag([
    {
      nodePath: currentNodePath.value,
      fieldName: props.fieldName || '',
      schema: props.schema,
    },
  ])
}

/**
 * 处理拖拽结束
 */
function handleDragEnd() {
  // 拖拽结束后清理状态
  store.cancelDrag()
}
</script>

<template>
  <div
    v-if="props.schema"
    :data-node-id="currentNodePath"
    :class="{ 'is-draggable': isDraggable, 'is-selected': isSelected }"
    :draggable="isDraggable"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <!-- 处理外部有组件包裹的 object -->
    <component
      :is="ComponentSettings[xComponent].component" v-if="xComponent && ComponentSettings[xComponent]"
      v-bind="buildComponentProps(props.schema, ComponentSettings[xComponent].setterSchema)"
    >
      <!-- 空容器占位符 -->
      <div v-if="isEmptyContainer" class="empty-container-placeholder">
        <svg class="placeholder-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" />
          <path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span class="placeholder-text">添加组件到这里</span>
      </div>

      <template v-if="shouldRenderArrayComponent(props.schema)">
        <CanvasField :schema="(props.schema.items as any)" :node-path="`${getChildBasePath()}`" />
      </template>
      <!-- 递归类型：object/void/array -->
      <template v-if="shouldRecurse(props.schema)">
        <template v-for="key in Object.keys(props.schema?.properties || {})" :key="key">
          <CanvasField
            :schema="(props.schema?.properties as any)?.[key]" :field-name="key"
            :node-path="getChildBasePath()"
          />
        </template>
      </template>
      <!-- 递归类型：object/void/array -->
    </component>
    <!-- 处理没有组件包裹的 object -->

    <!-- 没有组件包裹的只能是 void/object 类型 -->
    <template v-else>
      <!-- 空容器占位符 -->
      <div v-if="isEmptyContainer" class="empty-container-placeholder">
        <svg class="placeholder-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" />
          <path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span class="placeholder-text">添加组件到这里</span>
      </div>

      <template v-for="key in Object.keys(props.schema?.properties || {})" :key="key">
        <CanvasField
          :schema="(props.schema?.properties as any)?.[key]" :field-name="key"
          :node-path="getChildBasePath()"
        />
      </template>
    </template>
    <!-- 没有组件包裹的只能是 void/object 类型 -->
  </div>
</template>

<style scoped>
/* 可拖拽的组件样式 */
.is-draggable {
  cursor: move;
  position: relative;
}

/* 拖拽时的样式 */
.is-draggable:active {
  opacity: 0.5;
}

/* 空容器占位符 */
.empty-container-placeholder {
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  color: #999;
  pointer-events: none;
  padding: 8px;
}

.placeholder-icon {
  color: #d9d9d9;
}

.placeholder-text {
  font-size: 12px;
  user-select: none;
}
</style>
