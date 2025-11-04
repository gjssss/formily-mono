import type { ISchema } from '@formily/vue'
import { getByPath, setByPath } from '@formily-djd/utils'

/**
 * 将组件 Schema 转换为 Setter 表单的值
 * 根据 setterSchema 中每个字段的 x-path，从 componentSchema 中提取对应的值
 */
export function schemaToSetterValues(
  componentSchema: ISchema,
  setterSchema: ISchema,
): Record<string, any> {
  const values: Record<string, any> = {}

  Object.entries(setterSchema.properties || {}).forEach(([key, fieldSchema]) => {
    const targetPath = (fieldSchema as ISchema)['x-path']
    if (targetPath) {
      const value = getByPath(componentSchema, targetPath)
      if (value !== undefined) {
        values[key] = value
      }
    }
  })

  return values
}

/**
 * 将 Setter 表单的值转换回组件 Schema
 * 根据 setterSchema 中每个字段的 x-path，将值设置到新的 Schema 中
 */
export function setterValuesToSchema(
  setterValues: Record<string, any>,
  setterSchema: ISchema,
  originalSchema: ISchema,
): ISchema {
  // 深拷贝原始 Schema
  const newSchema: ISchema = JSON.parse(JSON.stringify(originalSchema))

  Object.entries(setterSchema.properties || {}).forEach(([key, fieldSchema]) => {
    const targetPath = (fieldSchema as ISchema)['x-path']
    if (targetPath && setterValues[key] !== undefined) {
      setByPath(newSchema, targetPath, setterValues[key])
    }
  })

  return newSchema
}
