import type { ISchema } from '@formily/vue'
import type { Component } from 'vue'

export interface ComponentConfig {
  name: string
  icon?: string
  category?: string
  description?: string
  hidden?: boolean
}

export interface FormilyComponent {
  component: Component
  setterSchema: ISchema
  config: ComponentConfig
  defaultSchema: ISchema
}
