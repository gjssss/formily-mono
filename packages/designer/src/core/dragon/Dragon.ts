/**
 * Dragon 拖拽计算引擎
 * 借鉴自 Formily Designable 的智能位置计算算法
 */

import type { Ref } from 'vue'
import type {
  IDragNode,
  IDragonCalculateParams,
  IDragonConfig,
  IPoint,
  IRect,
  LayoutDirection,
} from './types'
import { ref } from 'vue'
import {
  calcDistanceOfPointToRect,
  isInlineLayout,
  isNearAfter,
  isPointInRect,
} from './coordinate'
import { ClosestPosition } from './types'

/**
 * Dragon 拖拽计算引擎
 *
 * 核心功能：
 * 1. 计算最近的目标节点
 * 2. 计算精确的插入位置（14种）
 * 3. 自适应水平/垂直布局
 * 4. 权限验证
 */
export class Dragon {
  // ========== 配置 ==========
  private sensitive: boolean
  private forceBlock: boolean

  // ========== 响应式状态 ==========
  /** 正在拖拽的节点 */
  dragNodes: Ref<IDragNode[]> = ref([])

  /** 触摸的节点路径（鼠标hover的节点） */
  touchNode: Ref<string | null> = ref(null)

  /** 最近的目标节点路径 */
  closestNode: Ref<string | null> = ref(null)

  /** 最近的插入位置 */
  closestPosition: Ref<ClosestPosition> = ref(ClosestPosition.Before)

  /** 最近节点的矩形区域 */
  closestRect: Ref<IRect | null> = ref(null)

  // ========== 回调函数 ==========
  /**
   * 获取节点的 DOM 元素矩形
   * @param nodePath 节点路径
   */
  private getNodeRect: (nodePath: string) => IRect | null

  /**
   * 获取节点的 Schema
   * @param nodePath 节点路径
   */
  private getNodeSchema: (nodePath: string) => any

  /**
   * 获取画布容器的矩形
   */
  private getCanvasRect: () => IRect

  /**
   * 查找节点的所有子节点路径
   * @param nodePath 节点路径
   */
  private findChildNodes: (nodePath: string) => string[]

  constructor(
    callbacks: {
      getNodeRect: (nodePath: string) => IRect | null
      getNodeSchema: (nodePath: string) => any
      getCanvasRect: () => IRect
      findChildNodes: (nodePath: string) => string[]
    },
    config?: IDragonConfig,
  ) {
    this.sensitive = config?.sensitive ?? true
    this.forceBlock = config?.forceBlock ?? false

    this.getNodeRect = callbacks.getNodeRect
    this.getNodeSchema = callbacks.getNodeSchema
    this.getCanvasRect = callbacks.getCanvasRect
    this.findChildNodes = callbacks.findChildNodes
  }

  /**
   * 设置拖拽节点
   */
  setDragNodes(nodes: IDragNode[]): void {
    this.dragNodes.value = nodes
  }

  /**
   * 核心计算方法：计算拖拽位置
   *
   * @param params 计算参数
   */
  calculate(params: IDragonCalculateParams): void {
    const { point, touchNode, closestNode, closestPosition } = params

    // 模式1：同步模式（双引擎协同，从其他引擎同步结果）
    if (closestNode !== undefined && closestPosition !== undefined) {
      this.closestNode.value = closestNode
      this.closestPosition.value = closestPosition
      if (closestNode) {
        this.closestRect.value = this.getNodeRect(closestNode)
      }
      return
    }

    // 模式2：计算模式（根据鼠标位置计算）
    if (!point)
      return

    // 设置触摸节点
    if (touchNode !== undefined) {
      this.touchNode.value = touchNode
    }

    // 查找最近的节点
    const closest = this.getClosestNode(point)
    this.closestNode.value = closest

    if (!closest) {
      // 没有目标节点，重置状态
      this.closestPosition.value = ClosestPosition.Before
      this.closestRect.value = null
      return
    }

    // 计算插入位置
    this.closestPosition.value = this.getClosestPosition(point, closest)
    this.closestRect.value = this.getNodeRect(closest)
  }

  /**
   * 查找最近的目标节点
   *
   * 算法：
   * 1. 如果有触摸节点，从触摸节点及其子节点中查找
   * 2. 计算所有候选节点到鼠标的距离
   * 3. 返回距离最小的节点
   *
   * @param point 鼠标位置
   */
  private getClosestNode(point: IPoint): string | null {
    const touchNode = this.touchNode.value

    if (!touchNode) {
      return null
    }

    const touchRect = this.getNodeRect(touchNode)
    if (!touchRect) {
      return null
    }

    // 获取触摸节点的所有子节点
    const childNodes = this.findChildNodes(touchNode)

    if (childNodes.length === 0) {
      // 没有子节点，直接返回触摸节点
      return touchNode
    }

    // 计算到所有候选节点的距离
    let minDistance = isPointInRect(point, touchRect, this.sensitive)
      ? 0
      : calcDistanceOfPointToRect(point, touchRect)
    let minDistanceNode = touchNode

    // 遍历子节点，找到距离最小的
    for (const childPath of childNodes) {
      const childRect = this.getNodeRect(childPath)
      if (!childRect)
        continue

      const distance = isPointInRect(point, childRect, this.sensitive)
        ? 0 // 在矩形内，距离为0
        : calcDistanceOfPointToRect(point, childRect)

      if (distance <= minDistance) {
        minDistance = distance
        minDistanceNode = childPath
      }
    }

    return minDistanceNode
  }

  /**
   * 计算精确的插入位置（核心算法）
   *
   * 支持 14 种位置：
   * - Before/After: 垂直布局的前后
   * - Upper/Under: 水平布局的上下
   * - Inner/InnerBefore/InnerAfter: 容器内部
   * - Forbid*: 对应的禁止状态
   *
   * @param point 鼠标位置
   * @param nodePath 目标节点路径
   */
  private getClosestPosition(
    point: IPoint,
    nodePath: string,
  ): ClosestPosition {
    const nodeRect = this.getNodeRect(nodePath)
    const nodeSchema = this.getNodeSchema(nodePath)

    if (!nodeRect || !nodeSchema) {
      return ClosestPosition.Forbid
    }

    // 判断布局方向
    const layout = this.getLayout(nodeRect)
    const isInline = layout === 'horizontal'

    // 判断是否在矩形内
    const inRect = isPointInRect(point, nodeRect, this.sensitive)

    // 判断是否为容器组件（可以接受子节点）
    const isContainer = this.isContainer(nodeSchema)

    // 判断是否可以作为兄弟插入
    const canSibling = this.canInsertSibling(nodePath)

    // 判断是否靠近 After 位置
    const nearAfter = isNearAfter(point, nodeRect, isInline)

    // ========== 在矩形内部 ==========
    if (inRect) {
      // 检查是否可以拖入内部
      if (isContainer && this.canDropInside(nodePath)) {
        const children = this.findChildNodes(nodePath)

        if (children.length === 0) {
          // 空容器，直接内部插入
          return ClosestPosition.Inner
        }
        else {
          // 有子节点，根据位置判断
          return nearAfter
            ? ClosestPosition.InnerAfter
            : ClosestPosition.InnerBefore
        }
      }

      // 不能拖入内部，尝试作为兄弟插入
      if (canSibling) {
        if (isInline) {
          return nearAfter ? ClosestPosition.After : ClosestPosition.Before
        }
        else {
          return nearAfter ? ClosestPosition.Under : ClosestPosition.Upper
        }
      }

      // 既不能内部插入也不能兄弟插入
      return ClosestPosition.Forbid
    }

    // ========== 在矩形外部 ==========
    // 只能作为兄弟插入
    if (!canSibling) {
      return ClosestPosition.Forbid
    }

    if (isInline) {
      return nearAfter
        ? ClosestPosition.ForbidAfter
        : ClosestPosition.ForbidBefore
    }
    else {
      return nearAfter
        ? ClosestPosition.ForbidUnder
        : ClosestPosition.ForbidUpper
    }
  }

  /**
   * 获取布局方向
   */
  private getLayout(rect: IRect): LayoutDirection {
    if (this.forceBlock) {
      return 'vertical'
    }
    return isInlineLayout(rect) ? 'horizontal' : 'vertical'
  }

  /**
   * 判断是否为容器组件
   */
  private isContainer(schema: any): boolean {
    if (!schema)
      return false

    // Object/Void 类型是容器
    if (schema.type === 'object' || schema.type === 'void') {
      return true
    }

    // Array 类型是容器
    if (schema.type === 'array') {
      return true
    }

    return false
  }

  /**
   * 判断是否可以作为兄弟节点插入
   */
  private canInsertSibling(nodePath: string): boolean {
    // 根节点不能有兄弟节点
    if (!nodePath.includes('.')) {
      return false
    }

    // TODO: 这里可以添加更多的权限验证
    return true
  }

  /**
   * 判断是否可以拖入内部
   * 验证拖拽节点是否可以成为目标节点的子节点
   */
  private canDropInside(targetPath: string): boolean {
    const dragNodes = this.dragNodes.value

    if (dragNodes.length === 0) {
      return true // 从物料库拖拽，总是允许
    }

    // 验证：不能拖入自身
    for (const dragNode of dragNodes) {
      if (dragNode.nodePath === targetPath) {
        return false
      }

      // 验证：不能拖入自己的子节点
      if (targetPath.startsWith(`${dragNode.nodePath}.`)) {
        return false
      }
    }

    return true
  }

  /**
   * 清理拖拽状态
   */
  clear(): void {
    this.dragNodes.value = []
    this.touchNode.value = null
    this.closestNode.value = null
    this.closestPosition.value = ClosestPosition.Before
    this.closestRect.value = null
  }
}
