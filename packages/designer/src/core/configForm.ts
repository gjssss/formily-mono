import { createForm, onFormValuesChange } from '@formily/core'
import type { Form } from '@formily/core'
import type { ISchema } from '@formily/vue'
import type { DesignStore } from './types'
import { schemaToSetterValues, setterValuesToSchema } from './utils'

/**
 * 创建配置表单
 * 该表单用于编辑当前选中字段的配置
 *
 * @param setterSchema - Setter Schema
 * @param store - 设计器状态
 */
export function createConfigForm(setterSchema: ISchema, store: DesignStore): Form {
  const selectedField = store.getSelectedField()

  const configForm = createForm({
    // 初始值：从选中节点的 Schema 提取
    values: selectedField
      ? schemaToSetterValues(selectedField.schema, setterSchema)
      : {},

    effects() {
      // 监听配置表单值变化
      onFormValuesChange((form) => {
        const currentField = store.getSelectedField()
        if (!currentField)
          return

        // 将表单值映射回组件 Schema
        const newSchema = setterValuesToSchema(
          form.values,
          setterSchema,
          currentField.schema,
        )

        // 更新 store（响应式更新）
        store.updateFieldSchema(currentField.id, newSchema)

        console.log('配置表单值变化:', form.values)
        console.log('更新后的 Schema:', newSchema)
      })
    },
  })

  return configForm
}
