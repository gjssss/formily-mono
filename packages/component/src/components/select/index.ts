import type { FormilyComponent } from '@/types'
import Setter from './setter'
import Component from './ui.vue'

export default {
  component: Component,
  setterSchema: Setter,
  config: {
    name: '下拉选择',
    icon: 'ArrowDown',
    category: '选择',
    description: '下拉选择器',
  },
} as FormilyComponent
