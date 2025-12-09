import type { SimpleCondition } from '../types'
import { ref } from 'vue'
import { buildSimpleReactions, parseSimpleConditions } from '../utils/simpleConditions'

/**
 * 检测字段路径是否为数组相对路径
 */
function isArrayRelativePath(field: string): boolean {
  return field.includes('[]') || field.startsWith('.')
}

function createEmptyCondition(): SimpleCondition {
  return {
    field: '',
    operator: 'eq',
    value: '',
    connector: undefined,
    isArrayMode: false,
  }
}

export function useSimpleConditions() {
  const simpleConditions = ref<SimpleCondition[]>([createEmptyCondition()])

  function resetSimpleConditions() {
    simpleConditions.value = [createEmptyCondition()]
  }

  function addSimpleCondition() {
    if (simpleConditions.value.length > 0) {
      const last = simpleConditions.value[simpleConditions.value.length - 1]
      if (!last.connector)
        last.connector = 'and'
    }

    simpleConditions.value.push(createEmptyCondition())
  }

  function removeSimpleCondition(index: number) {
    simpleConditions.value.splice(index, 1)

    if (!simpleConditions.value.length) {
      resetSimpleConditions()
      return
    }

    if (index > 0 && index === simpleConditions.value.length)
      simpleConditions.value[index - 1].connector = undefined
  }

  function loadSimpleConditions(reactions: any) {
    const parsedSimpleConditions = parseSimpleConditions(reactions)

    if (parsedSimpleConditions) {
      // 根据字段路径设置 isArrayMode
      simpleConditions.value = parsedSimpleConditions.map(condition => ({
        ...condition,
        isArrayMode: isArrayRelativePath(condition.field),
      }))
      return true
    }

    resetSimpleConditions()
    return false
  }

  return {
    simpleConditions,
    addSimpleCondition,
    removeSimpleCondition,
    resetSimpleConditions,
    loadSimpleConditions,
    buildSimpleReactions: () => buildSimpleReactions(simpleConditions.value),
  }
}
