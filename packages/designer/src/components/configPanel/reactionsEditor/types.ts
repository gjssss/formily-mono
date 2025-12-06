export interface Dependency {
  source: string
  property: string
  name: string
  type: string
}

export interface StateRule {
  state: string
  expression: string
}

export type SimpleOperator = 'eq' | 'neq' | 'includes' | 'notIncludes'
export type SimpleConnector = 'and' | 'or'

export interface SimpleCondition {
  field: string
  operator: SimpleOperator
  value: string
  connector?: SimpleConnector
}
