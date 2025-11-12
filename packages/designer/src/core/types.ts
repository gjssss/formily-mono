import type { ISchema } from '@formily/vue'
import type { InjectionKey, Ref } from 'vue'
import type { Dragon } from './dragon'
import type { ClosestPosition, IDragNode, IPoint } from './dragon/types'

export interface DesignStore {
  // ========== 基础状态 ==========
  // 表单的根 Schema（唯一数据源）
  formSchema: Ref<any>
  // 当前选中的字段名称（用于配置面板）
  selectedFieldName: Ref<string | null>
  // 当前选中的节点 ID（完整路径，用于选中框渲染）
  selectedNodeId: Ref<string | null>
  // 当前悬浮的节点 ID（字段路径）
  hoveredNodeId: Ref<string | null>

  // ========== 拖拽状态 ==========
  // Dragon 拖拽引擎实例
  dragon: Dragon
  // 是否正在拖拽
  isDragging: Ref<boolean>
  // 正在拖拽的节点
  dragNodes: Ref<IDragNode[]>
  // 触摸的节点（鼠标 hover）
  touchNode: Ref<string | null>
  // 最近的目标节点
  closestNode: Ref<string | null>
  // 最近的插入位置
  closestPosition: Ref<ClosestPosition>

  // ========== 基础方法 ==========
  addField: (name: string, schema: ISchema) => void
  updateFieldSchema: (name: string, newSchema: ISchema) => void
  selectField: (name: string | null) => void
  selectNode: (nodeId: string | null) => void
  getSelectedField: () => ISchema | null
  setHover: (nodeId: string | null) => void

  // ========== 拖拽方法 ==========
  // 开始拖拽
  startDrag: (nodes: IDragNode[]) => void
  // 更新拖拽位置
  updateDragPosition: (point: IPoint, touchNode?: string) => void
  // 执行放置（插入或移动）
  drop: () => void
  // 取消拖拽
  cancelDrag: () => void
  // 移动字段
  moveField: (sourcePath: string, targetPath: string, position: ClosestPosition) => void
  // 在指定位置插入新字段
  insertField: (targetPath: string, fieldName: string, schema: ISchema, position: ClosestPosition) => void
  // 获取节点的 Schema
  getNodeSchema: (nodePath: string) => any
  // 查找所有子节点路径
  findChildNodes: (nodePath: string) => string[]
}

/**
 * Provide/Inject Key
 */
export const DesignStoreKey: InjectionKey<DesignStore> = Symbol('DesignStore')
