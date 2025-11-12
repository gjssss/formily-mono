/**
 * Dragon 拖拽引擎类型定义
 * 借鉴自 Formily Designable
 */

/**
 * 点坐标
 */
export interface IPoint {
  x: number
  y: number
}

/**
 * 矩形区域
 */
export interface IRect {
  x: number
  y: number
  width: number
  height: number
}

/**
 * 拖拽节点数据
 */
export interface IDragNode {
  nodePath: string // 节点路径（如 "username" 或 "users.properties.name"）
  fieldName: string // 字段名
  schema: any // Schema 数据
}

/**
 * 14种精确插入位置
 *
 * 位置说明：
 * - Before: 作为兄弟节点插入到目标前方（垂直布局）
 * - After: 作为兄弟节点插入到目标后方（垂直布局）
 * - Upper: 作为兄弟节点插入到目标上方（水平布局）
 * - Under: 作为兄弟节点插入到目标下方（水平布局）
 * - Inner: 作为子节点插入到目标内部（容器组件）
 * - InnerBefore: 作为第一个子节点插入
 * - InnerAfter: 作为最后一个子节点插入
 * - Forbid*: 对应的禁止状态（显示红色警告）
 */
export enum ClosestPosition {
  // 允许的位置
  Before = 'BEFORE',
  After = 'AFTER',
  Upper = 'UPPER',
  Under = 'UNDER',
  Inner = 'INNER',
  InnerBefore = 'INNER_BEFORE',
  InnerAfter = 'INNER_AFTER',

  // 禁止的位置
  ForbidBefore = 'FORBID_BEFORE',
  ForbidAfter = 'FORBID_AFTER',
  ForbidUpper = 'FORBID_UPPER',
  ForbidUnder = 'FORBID_UNDER',
  ForbidInner = 'FORBID_INNER',
  ForbidInnerBefore = 'FORBID_INNER_BEFORE',
  ForbidInnerAfter = 'FORBID_INNER_AFTER',
  Forbid = 'FORBID',
}

/**
 * Dragon 引擎配置
 */
export interface IDragonConfig {
  sensitive?: boolean // 是否使用敏感边界（默认 true）
  forceBlock?: boolean // 是否强制块级布局（默认 false）
}

/**
 * Dragon 计算参数
 */
export interface IDragonCalculateParams {
  point?: IPoint // 鼠标位置
  touchNode?: string // 触摸的节点路径
  closestNode?: string // 最近的节点路径（用于同步）
  closestPosition?: ClosestPosition // 最近的位置（用于同步）
}

/**
 * 自动滚动信息
 */
export interface IAutoScrollInfo {
  direction: 'start' | 'end'
  speed: number
}

/**
 * 布局方向
 */
export type LayoutDirection = 'horizontal' | 'vertical'
