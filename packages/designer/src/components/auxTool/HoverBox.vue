<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed } from 'vue'
import { useNodeRect } from '@/composables/useNodeRect'
import { useDesignStore } from '@/core'

const store = useDesignStore()

// 获取悬浮节点的矩形位置
const rect = useNodeRect(store.hoveredNodeId)

// 检查悬浮节点是否已被选中
const isHoveredNodeSelected = computed(() => {
  if (!store.hoveredNodeId.value || !store.selectedNodeId.value)
    return false
  // 如果悬浮节点已被选中，不显示悬浮框（比较完整的 nodeId）
  return store.hoveredNodeId.value === store.selectedNodeId.value
})

// 计算悬浮框样式
const hoverBoxStyle = computed<CSSProperties>(() => {
  const baseStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    boxSizing: 'border-box',
    pointerEvents: 'none', // 不拦截鼠标事件
    zIndex: 2,
    visibility: 'hidden',
  }

  if (rect.value && !isHoveredNodeSelected.value) {
    // 使用 translate3d 定位（GPU 加速）
    baseStyle.transform = `perspective(1px) translate3d(${rect.value.x}px, ${rect.value.y}px, 0)`
    baseStyle.width = `${rect.value.width}px`
    baseStyle.height = `${rect.value.height}px`
    baseStyle.visibility = 'visible'
  }

  return baseStyle
})

// 是否显示悬浮框
const shouldShow = computed(() => {
  return rect.value && !isHoveredNodeSelected.value
})
</script>

<template>
  <div v-if="shouldShow" class="hover-box" :style="hoverBoxStyle" />
</template>

<style scoped>
.hover-box {
  border: 1px dashed #c0c4cc;
  background-color: rgba(192, 196, 204, 0.05);
  transition: all 0.1s ease;
}
</style>
