/**
 * 拖拽事件驱动器
 * 借鉴自 Formily Designable 的智能启动机制
 */

import type { IPoint } from './types'

/**
 * 全局拖拽状态（单例模式，防止多个实例冲突）
 */
const GlobalDragState = {
  dragging: false,
  startTime: 0,
  startPoint: null as IPoint | null,
  currentPoint: null as IPoint | null,
}

/**
 * 拖拽事件回调
 */
export interface IDragDriverCallbacks {
  onDragStart?: (event: DragEvent) => void
  onDragMove?: (event: DragEvent, point: IPoint) => void
  onDragEnd?: (event: DragEvent) => void
  onDrop?: (event: DragEvent, point: IPoint) => void
}

/**
 * 拖拽驱动器配置
 */
export interface IDragDriverConfig {
  /** 触发拖拽的最小移动距离（px） */
  moveThreshold?: number
  /** 触发拖拽的最小时间（ms） */
  timeThreshold?: number
}

/**
 * DragDriver 拖拽事件驱动器
 *
 * 核心特性：
 * 1. 距离和时间双重判断（移动 > 4px 且 时间 > 10ms）
 * 2. 全局状态管理防止冲突
 * 3. 坐标去重避免重复计算
 */
export class DragDriver {
  private callbacks: IDragDriverCallbacks
  private config: Required<IDragDriverConfig>
  private rafRequest: number | null = null

  constructor(callbacks: IDragDriverCallbacks, config?: IDragDriverConfig) {
    this.callbacks = callbacks
    this.config = {
      moveThreshold: config?.moveThreshold ?? 4,
      timeThreshold: config?.timeThreshold ?? 10,
    }
  }

  /**
   * 附加到容器元素
   */
  attach(container: HTMLElement): () => void {
    const handleDragStart = this.handleDragStart.bind(this)
    const handleDragOver = this.handleDragOver.bind(this)
    const handleDrop = this.handleDrop.bind(this)
    const handleDragEnd = this.handleDragEnd.bind(this)

    // 监听拖拽事件
    container.addEventListener('dragstart', handleDragStart)
    container.addEventListener('dragover', handleDragOver)
    container.addEventListener('drop', handleDrop)
    container.addEventListener('dragend', handleDragEnd)

    // 返回清理函数
    return () => {
      container.removeEventListener('dragstart', handleDragStart)
      container.removeEventListener('dragover', handleDragOver)
      container.removeEventListener('drop', handleDrop)
      container.removeEventListener('dragend', handleDragEnd)
      this.cleanup()
    }
  }

  /**
   * 处理拖拽开始
   */
  private handleDragStart(event: DragEvent): void {
    // 记录开始状态
    GlobalDragState.startTime = Date.now()
    GlobalDragState.startPoint = {
      x: event.clientX,
      y: event.clientY,
    }
    GlobalDragState.currentPoint = GlobalDragState.startPoint
    GlobalDragState.dragging = false // 还未触发真正的拖拽

    // 不立即触发回调，等待距离判断
  }

  /**
   * 处理拖拽移动
   * 使用 RAF 节流优化性能
   */
  private handleDragOver(event: DragEvent): void {
    event.preventDefault() // 必须调用，否则无法 drop

    const currentPoint = {
      x: event.clientX,
      y: event.clientY,
    }

    // 坐标去重：相同位置不重复处理
    if (
      GlobalDragState.currentPoint
      && currentPoint.x === GlobalDragState.currentPoint.x
      && currentPoint.y === GlobalDragState.currentPoint.y
    ) {
      return
    }

    // RAF 节流
    if (this.rafRequest) {
      cancelAnimationFrame(this.rafRequest)
    }

    this.rafRequest = requestAnimationFrame(() => {
      this.rafRequest = null

      // 检查是否应该触发拖拽
      if (!GlobalDragState.dragging && GlobalDragState.startPoint) {
        const distance = Math.sqrt(
          (currentPoint.x - GlobalDragState.startPoint.x) ** 2
          + (currentPoint.y - GlobalDragState.startPoint.y) ** 2,
        )
        const timeElapsed = Date.now() - GlobalDragState.startTime

        // 距离和时间双重判断
        if (
          distance > this.config.moveThreshold
          && timeElapsed > this.config.timeThreshold
        ) {
          GlobalDragState.dragging = true
          this.callbacks.onDragStart?.(event)
        }
      }

      // 已触发拖拽，执行移动回调
      if (GlobalDragState.dragging) {
        GlobalDragState.currentPoint = currentPoint
        this.callbacks.onDragMove?.(event, currentPoint)
      }
    })
  }

  /**
   * 处理放置
   */
  private handleDrop(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()

    if (!GlobalDragState.dragging) {
      this.cleanup()
      return
    }

    const dropPoint = {
      x: event.clientX,
      y: event.clientY,
    }

    this.callbacks.onDrop?.(event, dropPoint)
    this.cleanup()
  }

  /**
   * 处理拖拽结束
   */
  private handleDragEnd(event: DragEvent): void {
    if (GlobalDragState.dragging) {
      this.callbacks.onDragEnd?.(event)
    }
    this.cleanup()
  }

  /**
   * 清理状态
   */
  private cleanup(): void {
    if (this.rafRequest) {
      cancelAnimationFrame(this.rafRequest)
      this.rafRequest = null
    }

    GlobalDragState.dragging = false
    GlobalDragState.startTime = 0
    GlobalDragState.startPoint = null
    GlobalDragState.currentPoint = null
  }

  /**
   * 检查是否正在拖拽
   */
  static isDragging(): boolean {
    return GlobalDragState.dragging
  }
}
