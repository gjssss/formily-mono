/* eslint-disable regexp/no-super-linear-backtracking */
/* eslint-disable regexp/prefer-w */
import type { Dependency, SimpleCondition, SimpleOperator } from '../types'

export function stripBraces(expression: any) {
  return String(expression ?? '').replace(/^\{\{|\}\}$/g, '').trim()
}

export function stripOuterParentheses(expression: string) {
  let result = expression.trim()

  while (result.startsWith('(') && result.endsWith(')')) {
    let depth = 0
    let isWrapper = true

    for (let i = 0; i < result.length; i++) {
      if (result[i] === '(')
        depth++
      else if (result[i] === ')')
        depth--

      if (depth === 0 && i < result.length - 1) {
        isWrapper = false
        break
      }
    }

    if (isWrapper)
      result = result.slice(1, -1).trim()
    else
      break
  }

  return result
}

export function literalToInputValue(literal: string) {
  const cleaned = literal.trim().replace(/^\(|\)$/g, '').trim()

  try {
    const parsed = JSON.parse(cleaned)
    if (typeof parsed === 'string')
      return parsed
    return String(parsed)
  }
  catch {
    return cleaned.replace(/^['"]|['"]$/g, '')
  }
}

function parseConditionExpression(expression: string, depNameToSource: Map<string, string>) {
  const normalized = stripOuterParentheses(expression)

  const equalsMatch = normalized.match(/^\$deps\.([a-zA-Z0-9_]+)\s*===\s*(.+)$/)
  if (equalsMatch) {
    const [, depName, valueLiteral] = equalsMatch
    const source = depNameToSource.get(depName)
    if (!source)
      return null

    return {
      field: source,
      operator: 'eq' as SimpleOperator,
      value: literalToInputValue(valueLiteral),
    }
  }

  const notEqualsMatch = normalized.match(/^\$deps\.([a-zA-Z0-9_]+)\s*!==\s*(.+)$/)
  if (notEqualsMatch) {
    const [, depName, valueLiteral] = notEqualsMatch
    const source = depNameToSource.get(depName)
    if (!source)
      return null

    return {
      field: source,
      operator: 'neq' as SimpleOperator,
      value: literalToInputValue(valueLiteral),
    }
  }

  const includesMatch = normalized.match(/^Array\.isArray\(\s*\$deps\.([a-zA-Z0-9_]+)\s*\)\s*&&\s*\$deps\.\1\.includes\((.+)\)$/)
  if (includesMatch) {
    const [, depName, valueLiteral] = includesMatch
    const source = depNameToSource.get(depName)
    if (!source)
      return null

    return {
      field: source,
      operator: 'includes' as SimpleOperator,
      value: literalToInputValue(valueLiteral),
    }
  }

  const notIncludesMatch = normalized.match(/^Array\.isArray\(\s*\$deps\.([a-zA-Z0-9_]+)\s*\)\s*&&\s*!\s*\$deps\.\1\.includes\((.+)\)$/)
  if (notIncludesMatch) {
    const [, depName, valueLiteral] = notIncludesMatch
    const source = depNameToSource.get(depName)
    if (!source)
      return null

    return {
      field: source,
      operator: 'notIncludes' as SimpleOperator,
      value: literalToInputValue(valueLiteral),
    }
  }

  return null
}

function splitExpressionByLogic(expression: string) {
  const segments: { expression: string, connector?: '&&' | '||' }[] = []
  let depth = 0
  let buffer = ''
  let i = 0

  while (i < expression.length) {
    const char = expression[i]

    if (char === '(') {
      depth++
    }
    else if (char === ')') {
      depth = Math.max(0, depth - 1)
    }

    if (depth === 0) {
      const maybeAnd = expression.slice(i, i + 2)
      if (maybeAnd === '&&' || maybeAnd === '||') {
        segments.push({ expression: buffer.trim(), connector: maybeAnd as '&&' | '||' })
        buffer = ''
        i += 2
        continue
      }
    }

    buffer += char
    i++
  }

  if (buffer.trim())
    segments.push({ expression: buffer.trim() })

  return segments
}

export function parseSimpleConditions(reactions: any): SimpleCondition[] | null {
  if (!reactions?.fulfill?.state?.visible || !Array.isArray(reactions.dependencies))
    return null

  const expression = stripBraces(reactions.fulfill.state.visible)
  if (!expression)
    return null

  const depNameToSource = new Map<string, string>()
  reactions.dependencies.forEach((dep: any) => {
    if (dep?.name && dep?.source && dep?.property === 'value')
      depNameToSource.set(dep.name, dep.source)
  })

  if (depNameToSource.size === 0)
    return null

  const singleParsed = parseConditionExpression(expression, depNameToSource)
  if (singleParsed)
    return [{ ...singleParsed, connector: undefined }]

  const segments = splitExpressionByLogic(expression)
  if (!segments.length)
    return null

  const conditions: SimpleCondition[] = []

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    const parsed = parseConditionExpression(segment.expression, depNameToSource)
    if (!parsed)
      return null

    conditions.push({
      ...parsed,
      connector: segment.connector ? (segment.connector === '||' ? 'or' : 'and') : undefined,
    })
  }

  if (conditions.length)
    conditions[conditions.length - 1].connector = undefined

  return conditions.length ? conditions : null
}

function normalizeInputValue(raw: string) {
  const trimmed = (raw ?? '').toString().trim()
  if (!trimmed)
    return ''

  try {
    return JSON.parse(trimmed)
  }
  catch {
    return trimmed.replace(/^['"]|['"]$/g, '')
  }
}

function formatValueLiteral(raw: string) {
  const normalized = normalizeInputValue(raw)
  return JSON.stringify(normalized)
}

function ensureDependencyName(source: string, nameMap: Map<string, string>, usedNames: Set<string>) {
  if (nameMap.has(source))
    return nameMap.get(source) as string

  const fieldName = source.split('.').pop() || source
  const baseName = `${fieldName}_value`
  let candidate = baseName
  let counter = 1

  while (usedNames.has(candidate)) {
    candidate = `${baseName}_${counter}`
    counter++
  }

  nameMap.set(source, candidate)
  usedNames.add(candidate)
  return candidate
}

export function buildSimpleReactions(simpleConditions: SimpleCondition[]) {
  const validConditions = simpleConditions
    .map((condition, index) => ({
      ...condition,
      connector: index < simpleConditions.length - 1 ? (condition.connector || 'and') : undefined,
    }))
    .filter(condition => condition.field && condition.value !== '')

  if (!validConditions.length)
    return null

  const dependenciesResult: Dependency[] = []
  const nameMap = new Map<string, string>()
  const usedNames = new Set<string>()
  const expressions: string[] = []

  validConditions.forEach((condition) => {
    const depName = ensureDependencyName(condition.field, nameMap, usedNames)
    if (!dependenciesResult.find(dep => dep.source === condition.field && dep.name === depName)) {
      dependenciesResult.push({
        source: condition.field,
        property: 'value',
        name: depName,
        type: 'any',
      })
    }

    const depRef = `$deps.${depName}`
    const valueLiteral = formatValueLiteral(condition.value)
    let expression = ''

    switch (condition.operator) {
      case 'eq':
        expression = `${depRef} === ${valueLiteral}`
        break
      case 'neq':
        expression = `${depRef} !== ${valueLiteral}`
        break
      case 'includes':
        expression = `Array.isArray(${depRef}) && ${depRef}.includes(${valueLiteral})`
        break
      case 'notIncludes':
        expression = `Array.isArray(${depRef}) && !${depRef}.includes(${valueLiteral})`
        break
    }

    expressions.push(`(${expression})`)
  })

  const expression = expressions.reduce((acc, curr, index) => {
    if (index === 0)
      return curr

    const connector = validConditions[index - 1].connector === 'or' ? '||' : '&&'
    return `${acc} ${connector} ${curr}`
  }, '')

  return {
    dependencies: dependenciesResult,
    fulfill: {
      state: {
        visible: `{{${expression}}}`,
      },
    },
  }
}
