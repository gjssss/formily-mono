import type { ISchema } from '@formily/json-schema'
import { getByPath } from '@formily-djd/utils'

/**
 * 根据 setterSchema 中的 x-path 从 schema 中提取组件属性
 */
export function buildComponentProps(schema: ISchema, setterSchema: ISchema): Record<string, any> {
  const componentProps: Record<string, any> = {}

  if (!setterSchema.properties) {
    return componentProps
  }

  Object.entries(setterSchema.properties).forEach(([key, fieldSchema]) => {
    const xPath = (fieldSchema as ISchema)['x-path']
    if (xPath) {
      const value = getByPath(schema, xPath)
      if (value !== undefined) {
        componentProps[key] = value
      }
    }
  })

  return componentProps
}

/**
 * 判断是否需要递归渲染
 */
export function shouldRecurse(schema: ISchema): boolean {
  const type = schema.type
  return (type === 'object' || type === 'void') && !!schema.properties
}
