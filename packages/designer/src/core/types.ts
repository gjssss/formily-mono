import type { ISchema } from '@formily/vue'
import type { InjectionKey, Ref } from 'vue'

export interface DesignStore {
  // 表单的根 Schema（唯一数据源）
  formSchema: Ref<any>
  // 当前选中的字段名称
  selectedFieldName: Ref<string | null>
  // 方法
  addField: (name: string, schema: ISchema) => void
  updateFieldSchema: (name: string, newSchema: ISchema) => void
  selectField: (name: string | null) => void
  getSelectedField: () => ISchema | null
}

/**
 * Provide/Inject Key
 */
export const DesignStoreKey: InjectionKey<DesignStore> = Symbol('DesignStore')
