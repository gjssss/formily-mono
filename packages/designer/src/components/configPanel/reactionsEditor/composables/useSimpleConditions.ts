import { ref } from 'vue'
import { buildSimpleReactions, parseSimpleConditions } from '../utils/simpleConditions'
import type { SimpleCondition } from '../types'

function createEmptyCondition(): SimpleCondition {
  return {
    field: '',
    operator: 'eq',
    value: '',
    connector: undefined,
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
      simpleConditions.value = parsedSimpleConditions
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
