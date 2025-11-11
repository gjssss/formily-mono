import type { FormilyComponent } from '@/types'
import Setter from './setter'
import Component from './ui.vue'

export default {
  component: Component,
  setterSchema: Setter,
  config: {
    name: '单选框',
    icon: 'CircleCheck',
    category: '选择',
    description: '单选控件',
  },
} as FormilyComponent
