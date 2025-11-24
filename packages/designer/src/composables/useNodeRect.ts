import type { Ref } from 'vue'
import { computed, onUnmounted, ref, watch } from 'vue'

export interface NodeRect {
  x: number
  y: number
  width: number
  height: number
}

/**
 * 计算节点相对于 canvas 容器的矩形位置
 * @param nodeId 节点 ID（响应式）
 * @param canvasSelector canvas 容器的选择器（默认 '.canvas-content'）
 * @returns 节点的矩形位置（响应式，相对于 canvas 容器）
 */
export function useNodeRect(
  nodeId: Ref<string | null>,
  canvasSelector = '.canvas-content',
): Ref<NodeRect | null> {
  const rect = ref<NodeRect | null>(null)

  // 查找并计算节点矩形
  function updateRect(): void {
    if (!nodeId.value) {
      rect.value = null
      return
    }

    // 通过 data-node-id 属性查找元素
    const element = document.querySelector(`[data-node-id="${nodeId.value}"]`)
    if (!element) {
      rect.value = null
      return
    }

    // 查找 canvas 容器
    const canvasElement = document.querySelector(canvasSelector)
    if (!canvasElement) {
      rect.value = null
      return
    }

    // 获取元素相对于视口的位置
    const elementRect = element.getBoundingClientRect()
    // 获取 canvas 容器相对于视口的位置
    const canvasRect = canvasElement.getBoundingClientRect()

    // 计算元素相对于 canvas 容器的位置
    rect.value = {
      x: elementRect.x - canvasRect.x,
      y: elementRect.y - canvasRect.y,
      width: elementRect.width,
      height: elementRect.height,
    }
  }

  // 监听 nodeId 变化，重新计算矩形
  watch(nodeId, () => {
    updateRect()
  }, { immediate: true })

  // 监听窗口滚动和大小变化，更新矩形位置
  if (typeof window !== 'undefined') {
    // 监听全局滚动和大小变化
    // window.addEventListener('scroll', updateRect, true) // 使用捕获阶段监听所有滚动
    // window.addEventListener('resize', updateRect)

    // // 监听 canvas 容器的滚动事件（如果容器可滚动）
    // const canvasElement = document.querySelector(canvasSelector)
    // if (canvasElement) {
    //   canvasElement.addEventListener('scroll', updateRect)
    // }

    // // 组件卸载时清理事件监听，避免内存泄漏
    // onUnmounted(() => {
    //   window.removeEventListener('scroll', updateRect, true)
    //   window.removeEventListener('resize', updateRect)
    //   if (canvasElement) {
    //     canvasElement.removeEventListener('scroll', updateRect)
    //   }
    // })
  }

  return computed(() => rect.value)
}
