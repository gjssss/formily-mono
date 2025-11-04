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
