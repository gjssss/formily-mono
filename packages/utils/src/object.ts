export function getByPath(obj: any, path: string, options?: {
  transformKey?: (key: string) => string
}): any {
  const { transformKey = (key: string) => key } = options || {}
  return path.split('.').reduce((acc, key) => acc?.[transformKey(key)], obj)
}

export function setByPath(obj: any, path: string, value: any): void {
  const keys = path.split('.')
  const lastKey = keys.pop()!
  const target = keys.reduce((acc, key) => {
    if (!acc[key] || typeof acc[key] !== 'object') {
      acc[key] = {}
    }
    return acc[key]
  }, obj)

  target[lastKey] = value
}

/**
 * 从路径删除节点并返回删除的值
 * @param obj 目标对象
 * @param path 路径（如 "username" 或 "users.properties.name"）
 * @returns 删除的值
 */
export function deleteByPath(obj: any, path: string): any {
  const keys = path.split('.')
  const lastKey = keys.pop()!
  const parent = keys.length > 0 ? getByPath(obj, keys.join('.')) : obj

  if (!parent || typeof parent !== 'object') {
    return undefined
  }

  const value = parent[lastKey]
  delete parent[lastKey]
  return value
}

/**
 * 在指定位置插入字段
 * @param obj 目标对象（应该是 schema 根对象，包含 properties）
 * @param targetPath 目标路径
 * @param fieldName 新字段名
 * @param value 新字段值
 * @param position 插入位置 ('before' | 'after')
 */
export function insertFieldByPath(
  obj: any,
  targetPath: string,
  fieldName: string,
  value: any,
  position: 'before' | 'after' = 'after',
): void {
  // 解析路径：提取父路径和目标字段名
  const keys = targetPath.split('.')
  const targetFieldName = keys.pop()!
  const parentPath = keys.join('.')

  // 获取父对象
  // 如果没有父路径，说明是根级别字段，parent 就是 obj 本身
  const parent = parentPath ? getByPath(obj, parentPath) : obj

  if (!parent) {
    return
  }

  // 确保 properties 存在
  if (!parent.properties) {
    parent.properties = {}
  }

  const properties = parent.properties

  // 将 properties 转换为数组，找到目标字段的索引
  const entries = Object.entries(properties)
  const targetIndex = entries.findIndex(([key]) => key === targetFieldName)

  if (targetIndex === -1) {
    // 目标字段不存在，直接添加到末尾
    properties[fieldName] = value
    return
  }

  // 重新构建 properties 对象，在指定位置插入新字段
  const insertIndex = position === 'after' ? targetIndex + 1 : targetIndex
  const newEntries = [
    ...entries.slice(0, insertIndex),
    [fieldName, value],
    ...entries.slice(insertIndex),
  ]

  // 清空原 properties 并重新赋值（保持顺序）
  Object.keys(properties).forEach(key => delete properties[key])
  newEntries.forEach(([key, val]) => {
    properties[key] = val
  })
}

/**
 * 获取父路径
 * @param path 完整路径
 * @returns 父路径，如果是根路径则返回 null
 */
export function getParentPath(path: string): string | null {
  const keys = path.split('.')
  if (keys.length <= 1) {
    return null
  }
  keys.pop()
  return keys.join('.')
}

/**
 * 从路径中提取字段名
 * @param path 完整路径（如 "users.properties.name"）
 * @returns 字段名（如 "name"）
 */
export function getFieldNameFromPath(path: string): string {
  const keys = path.split('.')
  return keys[keys.length - 1]
}

/**
 * 递归获取所有字段名
 * @param schema Schema 对象
 * @param prefix 路径前缀
 * @returns 所有字段名数组
 */
export function getAllFieldNames(schema: any, prefix = ''): string[] {
  const names: string[] = []

  if (!schema || typeof schema !== 'object') {
    return names
  }

  // 处理 properties
  if (schema.properties && typeof schema.properties === 'object') {
    Object.keys(schema.properties).forEach((key) => {
      const fullPath = prefix ? `${prefix}.${key}` : key
      names.push(key) // 只收集字段名，不要完整路径
      // 递归处理子节点
      names.push(...getAllFieldNames(schema.properties[key], fullPath))
    })
  }

  // 处理 items.properties（数组类型）
  if (
    schema.items?.properties
    && typeof schema.items.properties === 'object'
  ) {
    Object.keys(schema.items.properties).forEach((key) => {
      const fullPath = prefix ? `${prefix}.items.properties.${key}` : key
      names.push(key)
      names.push(...getAllFieldNames(schema.items.properties[key], fullPath))
    })
  }

  return names
}

/**
 * 生成唯一的字段名
 * @param prefix 前缀（通常是组件key）
 * @param existingNames 已存在的字段名列表
 * @returns 唯一的字段名
 */
export function generateUniqueFieldName(
  prefix: string,
  existingNames: string[],
): string {
  let counter = 1
  let name = `${prefix}_${counter}`

  while (existingNames.includes(name)) {
    counter++
    name = `${prefix}_${counter}`
  }

  return name
}
