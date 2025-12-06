import { ref } from 'vue'
import type { Dependency, StateRule } from '../types'

function createDefaultDependency(): Dependency {
  return {
    source: '',
    property: 'value',
    name: '',
    type: 'any',
  }
}

function parseDependencies(reactions: any): Dependency[] {
  if (!reactions?.dependencies || !Array.isArray(reactions.dependencies))
    return []

  return reactions.dependencies.map((dep: any) => ({
    source: dep?.source || '',
    property: dep?.property || 'value',
    name: dep?.name || '',
    type: dep?.type || 'any',
  }))
}

function parseStateRules(reactions: any): StateRule[] {
  if (!reactions?.fulfill?.state)
    return []

  return Object.entries(reactions.fulfill.state).map(([state, expression]) => ({
    state,
    expression: String(expression).replace(/^\{\{|\}\}$/g, '').trim(),
  }))
}

export function useAdvancedRules() {
  const dependencies = ref<Dependency[]>([])
  const stateRules = ref<StateRule[]>([])

  function loadAdvancedConfig(reactions: any) {
    dependencies.value = parseDependencies(reactions)
    stateRules.value = parseStateRules(reactions)
  }

  function addDependency() {
    dependencies.value.push(createDefaultDependency())
  }

  function removeDependency(index: number) {
    dependencies.value.splice(index, 1)
  }

  function handleFieldChange(dep: Dependency) {
    if (!dep.name && dep.source) {
      const fieldName = dep.source.split('.').pop() || dep.source
      dep.name = `${fieldName}_${dep.property}`
    }
  }

  function addStateRule() {
    stateRules.value.push({
      state: 'visible',
      expression: '',
    })
  }

  function removeStateRule(index: number) {
    stateRules.value.splice(index, 1)
  }

  function buildAdvancedReactions() {
    const reactions: any = {}

    if (dependencies.value.length > 0) {
      reactions.dependencies = dependencies.value
        .filter(dep => dep.source)
        .map(dep => ({
          source: dep.source,
          property: dep.property,
          name: dep.name,
          type: dep.type,
        }))
    }

    if (stateRules.value.length > 0) {
      reactions.fulfill = {
        state: {},
      }

      stateRules.value.forEach((rule) => {
        if (rule.state && rule.expression)
          reactions.fulfill.state[rule.state] = `{{${rule.expression}}}`
      })
    }

    return reactions
  }

  return {
    dependencies,
    stateRules,
    loadAdvancedConfig,
    addDependency,
    removeDependency,
    handleFieldChange,
    addStateRule,
    removeStateRule,
    buildAdvancedReactions,
  }
}
