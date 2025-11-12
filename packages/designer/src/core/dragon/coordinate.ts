/**
 * 坐标计算工具函数
 * 借鉴自 Formily Designable 的优化算法
 */

import type { IPoint, IRect } from './types'

/**
 * 判断点是否在矩形内（带自适应敏感边界）
 *
 * 敏感边界设计：
 * - 大元素（>200px）: 10-20px 的边界
 * - 小元素（<200px）: 固定 10px 边界
 * - 避免边缘频繁触发
 *
 * @param point 点坐标
 * @param rect 矩形区域
 * @param sensitive 是否使用敏感边界（默认 true）
 */
export function isPointInRect(
  point: IPoint,
  rect: IRect,
  sensitive = true,
): boolean {
  const boundSensor = (value: number): number => {
    if (!sensitive)
      return 0
    const sensor = value * 0.1 // 10% 的边界
    if (sensor > 20)
      return 20 // 最大 20px
    if (sensor < 10)
      return 10 // 最小 10px
    return sensor
  }

  const xSensor = boundSensor(rect.width)
  const ySensor = boundSensor(rect.height)

  return (
    point.x >= rect.x + xSensor
    && point.x <= rect.x + rect.width - xSensor
    && point.y >= rect.y + ySensor
    && point.y <= rect.y + rect.height - ySensor
  )
}

/**
 * 计算点到矩形的最短距离
 *
 * 优化：在矩形内部的维度距离为 0
 *
 * @param point 点坐标
 * @param rect 矩形区域
 */
export function calcDistanceOfPointToRect(
  point: IPoint,
  rect: IRect,
): number {
  let minX = Math.min(
    Math.abs(point.x - rect.x),
    Math.abs(point.x - (rect.x + rect.width)),
  )

  let minY = Math.min(
    Math.abs(point.y - rect.y),
    Math.abs(point.y - (rect.y + rect.height)),
  )

  // 在矩形范围内的维度距离为 0
  if (point.x >= rect.x && point.x <= rect.x + rect.width) {
    minX = 0
  }
  if (point.y >= rect.y && point.y <= rect.y + rect.height) {
    minY = 0
  }

  return Math.sqrt(minX ** 2 + minY ** 2)
}

/**
 * 计算点到边缘的距离
 *
 * @param point 点坐标
 * @param rect 矩形区域
 */
export function calcDistancePointToEdge(
  point: IPoint,
  rect: IRect,
): number {
  const distanceTop = Math.abs(point.y - rect.y)
  const distanceBottom = Math.abs(point.y - (rect.y + rect.height))
  const distanceLeft = Math.abs(point.x - rect.x)
  const distanceRight = Math.abs(point.x - (rect.x + rect.width))

  return Math.min(distanceTop, distanceBottom, distanceLeft, distanceRight)
}

/**
 * 判断点是否靠近 After 位置
 *
 * @param point 点坐标
 * @param rect 矩形区域
 * @param inline 是否内联布局
 */
export function isNearAfter(
  point: IPoint,
  rect: IRect,
  inline: boolean,
): boolean {
  if (inline) {
    // 水平布局：判断是否在右半部分
    return point.x >= rect.x + rect.width / 2
  }
  else {
    // 垂直布局：判断是否在下半部分
    return point.y >= rect.y + rect.height / 2
  }
}

/**
 * 判断矩形是否为内联布局
 * 通过宽高比判断：宽度 > 高度 则为内联布局
 *
 * @param rect 矩形区域
 */
export function isInlineLayout(rect: IRect): boolean {
  return rect.width > rect.height
}

/**
 * 计算两个矩形的中心点距离
 *
 * @param rect1 矩形1
 * @param rect2 矩形2
 */
export function calcRectDistance(rect1: IRect, rect2: IRect): number {
  const center1 = {
    x: rect1.x + rect1.width / 2,
    y: rect1.y + rect1.height / 2,
  }
  const center2 = {
    x: rect2.x + rect2.width / 2,
    y: rect2.y + rect2.height / 2,
  }

  return Math.sqrt(
    (center1.x - center2.x) ** 2 + (center1.y - center2.y) ** 2,
  )
}

/**
 * 获取矩形的中心点
 *
 * @param rect 矩形区域
 */
export function getRectCenter(rect: IRect): IPoint {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  }
}

/**
 * 计算两点之间的距离
 *
 * @param p1 点1
 * @param p2 点2
 */
export function calcPointDistance(p1: IPoint, p2: IPoint): number {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
}

/**
 * 判断元素是否有子节点（用于判断是否为容器）
 *
 * @param schema Schema 对象
 */
export function hasChildren(schema: any): boolean {
  if (!schema)
    return false

  // Object/Void 类型检查 properties
  if (schema.properties && Object.keys(schema.properties).length > 0) {
    return true
  }

  // Array 类型检查 items.properties
  if (
    schema.items?.properties
    && Object.keys(schema.items.properties).length > 0
  ) {
    return true
  }

  return false
}
