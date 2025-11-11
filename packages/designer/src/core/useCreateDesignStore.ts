import type { ISchema } from '@formily/vue'
import type { DesignStore } from './types'
import { getByPath, setByPath } from '@formily-djd/utils'
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
  // 响应式状态 - 唯一数据源
  const formSchema = ref<any>({
    type: 'object',
    properties: {},
  })
  const selectedFieldName = ref<string | null>(null)
  const selectedNodeId = ref<string | null>(null)
  const hoveredNodeId = ref<string | null>(null)

  /**
   * 添加字段到设计器
   * @param name 字段名称（作为 schema properties 的 key）
   * @param schema 字段的 Schema 定义
   */
  function addField(name: string, schema: ISchema): void {
    if (!formSchema.value.properties) {
      formSchema.value.properties = {}
    }
    formSchema.value.properties[name] = schema
  }

  /**
   * 更新字段的 Schema
   * @param name 字段名称
   * @param newSchema 新的 Schema 定义
   */
  function updateFieldSchema(name: string, newSchema: ISchema): void {
    setByPath(formSchema.value.properties, name, newSchema)
  }

  /**
   * 选中字段
   * @param name 字段名称
   */
  function selectField(name: string | null): void {
    selectedFieldName.value = name
  }

  /**
   * 获取当前选中的字段 Schema
   */
  function getSelectedField(): ISchema | null {
    if (!selectedFieldName.value)
      return null
    return getByPath(formSchema.value.properties, selectedFieldName.value) || null
  }

  /**
   * 选中节点（通过节点 ID）
   * @param nodeId 节点 ID（完整路径）
   */
  function selectNode(nodeId: string | null): void {
    selectedNodeId.value = nodeId
    selectedFieldName.value = nodeId
  }

  /**
   * 设置悬浮的节点
   * @param nodeId 节点 ID（字段路径）
   */
  function setHover(nodeId: string | null): void {
    hoveredNodeId.value = nodeId
  }

  // 创建 store 对象
  const store: DesignStore = {
    formSchema,
    selectedFieldName,
    selectedNodeId,
    hoveredNodeId,
    addField,
    updateFieldSchema,
    selectField,
    selectNode,
    getSelectedField,
    setHover,
  }

  // 提供给子组件
  provide(DesignStoreKey, store)

  return store
}
