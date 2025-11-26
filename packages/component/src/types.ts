import type { ISchema } from '@formily/vue'
import type { Component } from 'vue'
import type { SetterConfig } from './components/common/setterPresets'

export type FormilyPattern = 'editable' | 'disabled' | 'readOnly' | 'inherit'

export interface ComponentConfig {
  name: string
  icon?: string
  category?: string
  description?: string
  hidden?: boolean
}

export interface FormilyComponent {
  component: Component
  setterSchema: ISchema | SetterConfig
  config: ComponentConfig
  defaultSchema: ISchema
}
