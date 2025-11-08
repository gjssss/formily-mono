import type { ISchema } from '@formily/json-schema'
import { uid } from '@formily/shared'
import { onBeforeUnmount } from 'vue'
import { isObjectValue } from './utils'

export function useKey(schema: ISchema): {
  getKey: (record: any, index: number) => string | undefined
} {
  const isObject = isObjectValue(schema)
  let keyMap: WeakMap<Record<string, unknown>, string> | string[] | null = null

  if (isObject) {
    keyMap = new WeakMap()
  }
  else {
    keyMap = []
  }

  onBeforeUnmount(() => {
    keyMap = null
  })

  return {
    getKey: (record: any, index: number) => {
      if (keyMap instanceof WeakMap) {
        if (!keyMap.has(record)) {
          keyMap.set(record, uid())
        }
        return `${keyMap.get(record)}-${index}`
      }

      if (keyMap && !keyMap[index]) {
        keyMap[index] = uid()
      }
      return keyMap ? `${keyMap[index]}-${index}` : undefined
    },
  }
}
