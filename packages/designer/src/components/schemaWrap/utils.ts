export function isObjectValue(schema: any): boolean {
  if (Array.isArray(schema?.items))
    return isObjectValue(schema.items[0])

  if (schema?.items?.type === 'array' || schema?.items?.type === 'object') {
    return true
  }
  return false
}
