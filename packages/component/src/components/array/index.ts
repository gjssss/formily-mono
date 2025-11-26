import type { FormilyComponent } from '@/types'
import Setter from './setter'
import Component from './ui.vue'

export default {
  component: Component,
  setterSchema: Setter,
  config: {
    name: '数组容器',
    icon: 'Grid',
    category: '容器',
    description: '数组字段容器',
  },
  defaultSchema: {
    'type': 'array',
    'title': '数组容器',
    'x-component': 'Array',
    'x-decorator': 'FormItem',
    'x-pattern': 'inherit',
    'items': {
      'type': 'object',
      'x-component': 'ArrayItem',
      'properties': {},
    },
  },
} as FormilyComponent
