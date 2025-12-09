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
  /** 是否为数组模式（配置当前数组内的相对路径） */
  isArrayMode?: boolean
}
