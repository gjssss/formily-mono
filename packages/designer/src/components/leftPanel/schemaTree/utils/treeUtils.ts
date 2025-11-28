import { uid } from '@formily/shared'

import type { TreeNode } from '../types'

// 深拷贝 schema，避免共用引用
export function cloneSchema<T>(schema: T): T {
  return JSON.parse(JSON.stringify(schema))
}

// 将树节点路径转换为数据路径片段数组
export function normalizePathSegments(nodePath: string): string[] {
  return nodePath.split('.').filter(segment => segment !== 'properties' && segment !== 'items')
}

// 复制节点时生成新字段 key，并同步更新 reactions 依赖路径
export function cloneSchemaWithNewIds(schema: any, oldNodePath: string, newRootKey: string) {
  const oldRootSegments = normalizePathSegments(oldNodePath)
  const newRootSegments = [...oldRootSegments.slice(0, -1), newRootKey]
  const pathMap = new Map<string, string>()

  const walk = (node: any, oldSegments: string[], newSegments: string[]): any => {
    const cloned: any = cloneSchema(node)

    pathMap.set(oldSegments.join('.'), newSegments.join('.'))

    if (node.properties && typeof node.properties === 'object') {
      const newProperties: Record<string, any> = {}
      Object.entries(node.properties).forEach(([key, childSchema]) => {
        const newKey = `f_${uid()}`
        const childOldSegments = [...oldSegments, key]
        const childNewSegments = [...newSegments, newKey]
        newProperties[newKey] = walk(childSchema, childOldSegments, childNewSegments)
      })
      cloned.properties = newProperties
    }

    if (node.items && typeof node.items === 'object') {
      cloned.items = walk(node.items, [...oldSegments, 'items'], [...newSegments, 'items'])
    }

    return cloned
  }

  const mapPath = (source: string): string | null => {
    if (pathMap.has(source))
      return pathMap.get(source) || null

    for (const [oldPath, newPath] of pathMap.entries()) {
      if (source.startsWith(`${oldPath}.`)) {
        return `${newPath}${source.slice(oldPath.length)}`
      }
    }
    return null
  }

  const updateReactions = (node: any) => {
    if (!node || typeof node !== 'object')
      return

    const reactions = node['x-reactions']
    if (reactions && Array.isArray(reactions.dependencies)) {
      reactions.dependencies = reactions.dependencies.map((dep: any) => {
        if (dep && typeof dep.source === 'string') {
          const newSource = mapPath(dep.source)
          if (newSource) {
            return {
              ...dep,
              source: newSource,
            }
          }
        }
        return dep
      })
      node['x-reactions'] = reactions
    }

    if (node.properties) {
      Object.values(node.properties).forEach(child => updateReactions(child))
    }
    if (node.items) {
      updateReactions(node.items)
    }
  }

  const newSchema = walk(schema, oldRootSegments, newRootSegments)
  updateReactions(newSchema)

  return newSchema
}

// 判断节点是否容器
export function checkIsContainer(schema: any): boolean {
  if (schema['x-droppable'] === false)
    return false

  if (['object', 'void', 'array'].includes(schema.type))
    return true

  return false
}

// 将 schema 转换为树形结构
export function convertSchemaToTree(schema: any, parentPath = ''): TreeNode[] {
  const nodes: TreeNode[] = []

  if (!schema || typeof schema !== 'object')
    return nodes

  if (schema.properties && typeof schema.properties === 'object') {
    Object.entries(schema.properties).forEach(([key, fieldSchema]: [string, any]) => {
      const path = parentPath ? `${parentPath}.properties.${key}` : key
      const component = fieldSchema['x-component'] || 'Unknown'
      const title = fieldSchema.title || key
      const isContainer = checkIsContainer(fieldSchema)

      const node: TreeNode = {
        path,
        label: title,
        title,
        component,
        isContainer,
        children: convertSchemaToTree(fieldSchema, path),
      }

      nodes.push(node)
    })
  }

  if (schema.items?.properties) {
    Object.entries(schema.items.properties).forEach(([key, fieldSchema]: [string, any]) => {
      const path = `${parentPath}.items.properties.${key}`
      const component = fieldSchema['x-component'] || 'Unknown'
      const title = fieldSchema.title || key
      const isContainer = checkIsContainer(fieldSchema)

      const node: TreeNode = {
        path,
        label: title,
        title,
        component,
        isContainer,
        children: convertSchemaToTree(fieldSchema, path),
      }

      nodes.push(node)
    })
  }

  return nodes
}

// 获取所有节点 key
export function getAllNodeKeys(nodes: TreeNode[]): string[] {
  const keys: string[] = []
  nodes.forEach((node) => {
    keys.push(node.path)
    if (node.children && node.children.length > 0) {
      keys.push(...getAllNodeKeys(node.children))
    }
  })
  return keys
}

// 计算拖拽插入位置
export function calculateDropPosition(event: DragEvent, nodeElement: Element): 'before' | 'after' | 'inner' {
  const rect = nodeElement.getBoundingClientRect()
  const relativeY = event.clientY - rect.top
  const threshold = rect.height * 0.2

  if (relativeY < threshold)
    return 'before'
  if (relativeY > rect.height - threshold)
    return 'after'
  return 'inner'
}

// 获取鼠标位置对应的树节点
export function findTreeNodeAtPosition(treeData: TreeNode[], x: number, y: number): { element: Element, data: TreeNode } | null {
  const element = document.elementFromPoint(x, y)
  const nodeElement = element?.closest('.el-tree-node')

  if (!nodeElement)
    return null

  const nodeContentElement = nodeElement.querySelector('.el-tree-node__content')
  if (!nodeContentElement)
    return null

  const findNodeByPath = (nodes: TreeNode[], path: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.path === path)
        return node
      if (node.children) {
        const found = findNodeByPath(node.children, path)
        if (found)
          return found
      }
    }
    return null
  }

  const pathFromDom = nodeElement.getAttribute('data-path')
    || nodeContentElement.getAttribute('data-path')

  if (pathFromDom) {
    const nodeData = findNodeByPath(treeData, pathFromDom)
    if (nodeData)
      return { element: nodeElement, data: nodeData }
  }

  const allNodes = document.querySelectorAll('.el-tree-node')
  const index = Array.from(allNodes).indexOf(nodeElement)
  if (index >= 0 && index < treeData.length) {
    return { element: nodeElement, data: treeData[index] }
  }

  return null
}
