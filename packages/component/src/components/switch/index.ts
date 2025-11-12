import type { FormilyComponent } from '@/types'
import Setter from './setter'
import Component from './ui.vue'

export default {
  component: Component,
  setterSchema: Setter,
  config: {
    name: '开关',
    icon: 'Switch',
    category: '基础',
    description: '开关控件',
  },
  defaultSchema: {
    'type': 'boolean',
    'title': '开关',
    'x-component': 'Switch',
    'x-decorator': 'FormItem',
  },
} as FormilyComponent
