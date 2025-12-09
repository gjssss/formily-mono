import type { ISchema } from '@formily/vue'
import type { MaybeRef } from 'vue'
import { computed, unref } from 'vue'

export interface FieldTreeNode {
  value: string
  label: string
  disabled?: boolean
  children?: FieldTreeNode[]
}

export interface FieldTreeOptions {
  /** 是否为数组模式，显示当前数组内的字段 */
  isArrayMode?: boolean
  /** 是否过滤数组类型字段及其子字段 */
  filterArrayFields?: boolean
}

/**
 * 从 schema 中根据路径获取指定节点
 */
function getSchemaByPath(schema: ISchema, path: string): ISchema | undefined {
  const segments = path.split('.')
  let current: ISchema | undefined = schema

  for (const segment of segments) {
    if (!current)
      return undefined
    if (segment === 'properties' && current.properties) {
      continue
    }
    else if (segment === 'items' && current.items) {
      current = current.items as ISchema
    }
    else if (current.properties && (current.properties as Record<string, ISchema>)[segment]) {
      current = (current.properties as Record<string, ISchema>)[segment]
    }
    else {
      return undefined
    }
  }

  return current
}

/**
 * 找到当前字段最近的数组祖先的 items.properties 路径
 * 例如: f_mtqy8q98ht3.items.properties.f_9b97stvcjeh -> f_mtqy8q98ht3.items.properties
 */
function findNearestArrayScope(schema: ISchema, currentFieldName: string): { scopePath: string, depth: number } | null {
  const segments = currentFieldName.split('.')
  let path = ''
  let lastArrayScopePath = ''
  let lastArrayDepth = 0

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    path = path ? `${path}.${segment}` : segment

    const nodeSchema = getSchemaByPath(schema, path)
    if (nodeSchema?.type === 'array' && nodeSchema.items) {
      // 找到数组，记录其 items.properties 路径
      lastArrayScopePath = `${path}.items.properties`
      // 深度为当前字段到数组 items.properties 的层级差
      lastArrayDepth = segments.length - i - 1
      // 跳过 items 和 properties
      if (segments[i + 1] === 'items')
        i++
      if (segments[i + 1] === 'properties')
        i++
    }
  }

  return lastArrayScopePath ? { scopePath: lastArrayScopePath, depth: lastArrayDepth } : null
}

/**
 * 构建普通模式的字段树（过滤数组字段，禁用 object/void 字段）
 */
function buildNormalTree(
  properties: Record<string, ISchema> | undefined,
  currentFieldName: string | null,
  parentPath = '',
): FieldTreeNode[] {
  if (!properties)
    return []

  const nodes: FieldTreeNode[] = []

  Object.entries(properties).forEach(([key, schema]) => {
    const path = parentPath ? `${parentPath}.${key}` : key
    const title = (schema.title as string) || key

    // 排除当前字段及其子字段
    if (currentFieldName && (path === currentFieldName || path.startsWith(`${currentFieldName}.`)))
      return

    // 过滤数组类型字段及其子字段
    if (schema.type === 'array')
      return

    const isContainerType = schema.type === 'object' || schema.type === 'void'

    const node: FieldTreeNode = {
      value: path,
      label: `${title} (${key})`,
      disabled: isContainerType,
      children: undefined,
    }

    if (schema.properties) {
      const children = buildNormalTree(schema.properties as Record<string, ISchema>, currentFieldName, path)
      if (children.length > 0)
        node.children = children
    }

    nodes.push(node)
  })

  return nodes
}

/**
 * 构建数组模式的字段树（相对路径）
 * 思路：
 * 1. 计算当前字段相对于 properties 根的深度
 * 2. 构建普通绝对路径树（从 properties 根开始）
 * 3. 为每个路径添加相对路径前缀: '.'.repeat(depth) + '.[].' + absolutePath
 */
function buildArrayTree(
  properties: Record<string, ISchema> | undefined,
  relativeCurrentField: string | null,
  relativePrefix: string,
  parentPath = '',
): FieldTreeNode[] {
  if (!properties)
    return []

  const nodes: FieldTreeNode[] = []

  Object.entries(properties).forEach(([key, schema]) => {
    const absolutePath = parentPath ? `${parentPath}.${key}` : key
    const title = (schema.title as string) || key

    // 排除当前字段及其子字段
    if (relativeCurrentField && (absolutePath === relativeCurrentField || absolutePath.startsWith(`${relativeCurrentField}.`)))
      return

    // 计算相对路径：前缀 + 绝对路径
    const relativePath = `${relativePrefix}${absolutePath}`

    const isContainerType = schema.type === 'object' || schema.type === 'void'

    const node: FieldTreeNode = {
      value: relativePath,
      label: `${title} (${key})`,
      disabled: isContainerType,
      children: undefined,
    }

    if (schema.properties) {
      const children = buildArrayTree(
        schema.properties as Record<string, ISchema>,
        relativeCurrentField,
        relativePrefix,
        absolutePath,
      )
      if (children.length > 0)
        node.children = children
    }

    nodes.push(node)
  })

  return nodes
}

/**
 * 构建全量字段树（原始逻辑）
 */
function buildTree(
  properties: Record<string, ISchema> | undefined,
  currentFieldName: string | null,
  parentPath = '',
): FieldTreeNode[] {
  if (!properties)
    return []

  const nodes: FieldTreeNode[] = []

  Object.entries(properties).forEach(([key, schema]) => {
    const path = parentPath ? `${parentPath}.${key}` : key
    const title = (schema.title as string) || key

    if (currentFieldName && (path === currentFieldName || path.startsWith(`${currentFieldName}.`)))
      return

    const node: FieldTreeNode = {
      value: path,
      label: `${title} (${key})`,
      children: undefined,
    }

    if (schema.properties) {
      const children = buildTree(schema.properties as Record<string, ISchema>, currentFieldName, path)
      if (children.length > 0)
        node.children = children
    }

    nodes.push(node)
  })

  return nodes
}

export function useFieldTree(
  schema: MaybeRef<ISchema | undefined>,
  currentFieldName: MaybeRef<string | null>,
  options?: MaybeRef<FieldTreeOptions>,
) {
  const fieldTree = computed(() => {
    const schemaValue = unref(schema)
    const currentFieldNameValue = unref(currentFieldName)
    const opts = unref(options) || {}

    if (!schemaValue)
      return []

    if (opts.isArrayMode && currentFieldNameValue) {
      // 数组模式：显示最近数组内的字段，使用相对路径
      const arrayScope = findNearestArrayScope(schemaValue, currentFieldNameValue)
      if (arrayScope) {
        const scopeSchema = getSchemaByPath(schemaValue, arrayScope.scopePath)
        if (scopeSchema) {
          // 计算当前字段相对于 properties 根的路径
          // 例如: f_xxx.items.properties.object1.input2 -> object1.input2
          const scopePathPrefix = `${arrayScope.scopePath}.`
          const relativeCurrentField = currentFieldNameValue.startsWith(scopePathPrefix)
            ? currentFieldNameValue.slice(scopePathPrefix.length)
            : currentFieldNameValue

          // 计算深度（相对路径的段数）
          const depth = Math.ceil(relativeCurrentField.split('.').length / 2)
          console.log('depth', depth, relativeCurrentField)

          // 构建相对路径前缀: '.'.repeat(depth) + '.[].'
          const relativePrefix = `${'.'.repeat(depth)}.[].`

          return buildArrayTree(
            scopeSchema.properties as Record<string, ISchema>,
            relativeCurrentField,
            relativePrefix,
          )
        }
      }
      // 如果没找到数组作用域，返回空树
      return []
    }

    if (opts.filterArrayFields) {
      // 普通模式但过滤数组字段
      return buildNormalTree(schemaValue.properties as Record<string, ISchema> | undefined, currentFieldNameValue)
    }

    // 默认：全量字段树
    return buildTree(schemaValue.properties as Record<string, ISchema> | undefined, currentFieldNameValue)
  })

  /**
   * 检查当前字段是否在数组内
   */
  const isInArray = computed(() => {
    const currentFieldNameValue = unref(currentFieldName)
    return currentFieldNameValue?.includes('.items.properties.')
  })

  return { fieldTree, isInArray }
}
