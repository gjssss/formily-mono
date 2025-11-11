import type { FormilyComponent } from '@/types'
import Setter from './setter'
import Component from './ui.vue'

export default {
  component: Component,
  setterSchema: Setter,
  config: {
    name: '数组项',
    icon: 'List',
    category: '容器',
    description: '数组项容器',
  },
} as FormilyComponent
