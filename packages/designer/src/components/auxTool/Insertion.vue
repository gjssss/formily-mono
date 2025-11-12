<script setup lang="ts">
import { computed } from 'vue'
import { ClosestPosition } from '@/core/dragon'
import { useDesignStore } from '@/core/useDesignStore'

const store = useDesignStore()

/**
 * 根据 closestPosition 计算插入指示器的样式
 */
const insertionStyle = computed(() => {
  if (!store.isDragging.value || !store.closestNode.value) {
    return { display: 'none' }
  }

  const position = store.closestPosition.value
  const rect = store.dragon.closestRect.value

  if (!rect) {
    return { display: 'none' }
  }

  // 检查是否为 Forbid 状态
  const isForbid = position.toString().includes('FORBID')

  // 基础样式
  const baseStyle: any = {
    position: 'absolute',
    backgroundColor: isForbid ? '#ef4444' : '#3b82f6',
    pointerEvents: 'none',
    zIndex: 10,
    transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isForbid
      ? '0 0 8px rgba(239, 68, 68, 0.5)'
      : '0 0 8px rgba(59, 130, 246, 0.5)',
  }

  // 根据不同的位置设置不同的样式
  switch (position) {
    case ClosestPosition.Before:
    case ClosestPosition.ForbidBefore:
      // 前方插入：垂直线（左边）
      Object.assign(baseStyle, {
        width: '2px',
        height: `${rect.height}px`,
        transform: `perspective(1px) translate3d(${rect.x}px, ${rect.y}px, 0)`,
      })
      break

    case ClosestPosition.After:
    case ClosestPosition.ForbidAfter:
      // 后方插入：垂直线（右边）
      Object.assign(baseStyle, {
        width: '2px',
        height: `${rect.height}px`,
        transform: `perspective(1px) translate3d(${rect.x + rect.width - 2}px, ${rect.y}px, 0)`,
      })
      break

    case ClosestPosition.Upper:
    case ClosestPosition.ForbidUpper:
      // 上方插入：水平线（上边）
      Object.assign(baseStyle, {
        width: `${rect.width}px`,
        height: '2px',
        transform: `perspective(1px) translate3d(${rect.x}px, ${rect.y}px, 0)`,
      })
      break

    case ClosestPosition.Under:
    case ClosestPosition.ForbidUnder:
      // 下方插入：水平线（下边）
      Object.assign(baseStyle, {
        width: `${rect.width}px`,
        height: '2px',
        transform: `perspective(1px) translate3d(${rect.x}px, ${rect.y + rect.height - 2}px, 0)`,
      })
      break

    case ClosestPosition.Inner:
    case ClosestPosition.InnerBefore:
    case ClosestPosition.InnerAfter:
    case ClosestPosition.ForbidInner:
    case ClosestPosition.ForbidInnerBefore:
    case ClosestPosition.ForbidInnerAfter:
      // 内部插入：高亮整个区域
      Object.assign(baseStyle, {
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        transform: `perspective(1px) translate3d(${rect.x}px, ${rect.y}px, 0)`,
        backgroundColor: 'transparent',
        border: isForbid ? '2px dashed #ef4444' : '2px dashed #3b82f6',
      })
      break

    case ClosestPosition.Forbid:
      // 完全禁止：不显示
      return { display: 'none' }

    default:
      return { display: 'none' }
  }

  return baseStyle
})
</script>

<template>
  <div class="insertion-indicator" :style="insertionStyle" />
</template>

<style scoped>
.insertion-indicator {
  border-radius: 1px;
}
</style>
