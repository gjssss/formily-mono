import type { ISchema } from '@formily/vue'
import type { InjectionKey, Ref } from 'vue'

export interface DesignStore {
  // 表单的根 Schema（唯一数据源）
  formSchema: Ref<any>
  // 当前选中的字段名称（用于配置面板）
  selectedFieldName: Ref<string | null>
  // 当前选中的节点 ID（完整路径，用于选中框渲染）
  selectedNodeId: Ref<string | null>
  // 当前悬浮的节点 ID（字段路径）
  hoveredNodeId: Ref<string | null>
  // 方法
  addField: (name: string, schema: ISchema) => void
  updateFieldSchema: (name: string, newSchema: ISchema) => void
  selectField: (name: string | null) => void
  selectNode: (nodeId: string | null) => void
  getSelectedField: () => ISchema | null
  setHover: (nodeId: string | null) => void
}

/**
 * Provide/Inject Key
 */
export const DesignStoreKey: InjectionKey<DesignStore> = Symbol('DesignStore')
