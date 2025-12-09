import type { SetterConfig } from '@formily-djd/component'
import type { ISchema } from '@formily/json-schema'
import { getByPath } from '@formily-djd/utils'

/**
 * 根据 setterSchema 中的 x-path 从 schema 中提取组件属性
 */
export function buildComponentProps(schema: ISchema, setterSchema: SetterConfig): Record<string, any> {
  const componentProps: Record<string, any> = {
    ...(schema?.['x-component-props'] || {}),
  }

  // 处理 basicSetter 中的属性映射
  if (setterSchema.basicSetter) {
    Object.entries(setterSchema.basicSetter).forEach(([key, fieldSchema]) => {
      const xPath = (fieldSchema as ISchema)['x-path']
      if (xPath) {
        const value = getByPath(schema, xPath)
        if (value !== undefined) {
          componentProps[key] = value
        }
      }
    })
  }

  // 处理 componentSetter 中的属性映射
  if (setterSchema.componentSetter?.properties) {
    Object.entries(setterSchema.componentSetter.properties).forEach(([key, fieldSchema]) => {
      const xPath = (fieldSchema as ISchema)['x-path']
      if (xPath) {
        const value = getByPath(schema, xPath)
        if (value !== undefined) {
          componentProps[key] = value
        }
      }
    })
  }

  return componentProps
}

/**
 * 判断是否需要递归渲染
 */
export function shouldRecurse(schema: ISchema): boolean {
  // 检查 x-droppable 标记
  if (schema?.['x-droppable'] === false) {
    return false
  }

  const type = schema.type
  return (type === 'object' || type === 'void' || type === 'array') && !!schema.properties
}

/**
 * 判断是否渲染数组组件
 */
export function shouldRenderArrayComponent(schema: ISchema): boolean {
  return schema.type === 'array' && !!schema.items
}
