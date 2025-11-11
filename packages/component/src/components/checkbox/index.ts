import type { FormilyComponent } from '@/types'
import Setter from './setter'
import Component from './ui.vue'

export default {
  component: Component,
  setterSchema: Setter,
  config: {
    name: '复选框',
    icon: 'Select',
    category: '选择',
    description: '多选控件',
  },
} as FormilyComponent
