import type { ISchema } from '@formily/vue'
import type { Component } from 'vue'

export interface FormilyComponent {
  component: Component
  setterSchema: ISchema
}
