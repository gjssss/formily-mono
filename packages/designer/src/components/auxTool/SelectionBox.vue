<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed } from 'vue'
import { useNodeRect } from '@/composables/useNodeRect'
import { useDesignStore } from '@/core'

const store = useDesignStore()

// 获取选中节点的矩形位置
const rect = useNodeRect(store.selectedNodeId)

// 计算选中框样式
const selectionBoxStyle = computed<CSSProperties>(() => {
  const baseStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    boxSizing: 'border-box',
    pointerEvents: 'none', // 不拦截鼠标事件
    zIndex: 4,
    visibility: 'hidden',
  }

  if (rect.value) {
    // 使用 translate3d 定位（GPU 加速）
    baseStyle.transform = `perspective(1px) translate3d(${rect.value.x}px, ${rect.value.y}px, 0)`
    baseStyle.width = `${rect.value.width}px`
    baseStyle.height = `${rect.value.height}px`
    baseStyle.visibility = 'visible'
  }

  return baseStyle
})

// 是否显示选中框
const shouldShow = computed(() => {
  return rect.value !== null
})
</script>

<template>
  <div v-if="shouldShow" class="selection-box" :style="selectionBoxStyle">
    <div class="selection-box-inner" />
  </div>
</template>

<style scoped>
.selection-box {
  border: 2px solid #409eff;
  background-color: rgba(64, 158, 255, 0.05);
  transition: all 0.1s ease;
}

.selection-box-inner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}
</style>
