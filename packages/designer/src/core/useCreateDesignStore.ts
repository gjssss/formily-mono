import type { ISchema } from '@formily/vue'
import type { DesignStore, FieldNode } from './types'
import { provide, ref } from 'vue'
import { DesignStoreKey } from './types'

/**
 * 创建设计器状态（在 Designer 根组件中使用）
 *
 * 用法：
 * ```vue
 * <script setup>
 * const store = useCreateDesignStore()
 * </script>
 * ```
 */
export function useCreateDesignStore(): DesignStore {
  // 响应式状态
  const fields = ref<Record<string, FieldNode>>({})
  const selectedFieldId = ref<string | null>(null)
  const formSchema = ref<ISchema>({
    type: 'object',
    properties: {},
  })

  /**
   * 添加字段到设计器
   */
  function addField(field: FieldNode): void {
    fields.value[field.id] = field

    // 同步更新 formSchema
    if (!formSchema.value.properties) {
      formSchema.value.properties = {}
    }
    formSchema.value.properties[field.name] = field.schema
  }

  /**
   * 更新字段的 Schema
   */
  function updateFieldSchema(fieldId: string, newSchema: ISchema): void {
    const field = fields.value[fieldId]
    if (!field)
      return

    // 更新 field 节点的 schema
    field.schema = JSON.parse(JSON.stringify(newSchema))

    // 同步更新 formSchema
    if (formSchema.value.properties) {
      formSchema.value.properties[field.name] = newSchema
    }
  }

  /**
   * 选中字段
   */
  function selectField(fieldId: string | null): void {
    selectedFieldId.value = fieldId
  }

  /**
   * 获取当前选中的字段
   */
  function getSelectedField(): FieldNode | null {
    if (!selectedFieldId.value)
      return null
    return fields.value[selectedFieldId.value] || null
  }

  // 创建 store 对象
  const store: DesignStore = {
    fields,
    selectedFieldId,
    formSchema,
    addField,
    updateFieldSchema,
    selectField,
    getSelectedField,
  }

  // 提供给子组件
  provide(DesignStoreKey, store)

  return store
}
