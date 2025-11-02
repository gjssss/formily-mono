import type { InjectionKey, Ref } from 'vue'
import type { ISchema } from '@formily/vue'

export interface FieldNode {
  id: string
  name: string
  componentName: string
  schema: ISchema
}

export interface DesignStore {
  // 所有字段节点
  fields: Ref<Record<string, FieldNode>>
  // 当前选中的字段 ID
  selectedFieldId: Ref<string | null>
  // 表单的根 Schema
  formSchema: Ref<ISchema>
  // 方法
  addField: (field: FieldNode) => void
  updateFieldSchema: (fieldId: string, newSchema: ISchema) => void
  selectField: (fieldId: string | null) => void
  getSelectedField: () => FieldNode | null
}

/**
 * Provide/Inject Key
 */
export const DesignStoreKey: InjectionKey<DesignStore> = Symbol('DesignStore')
