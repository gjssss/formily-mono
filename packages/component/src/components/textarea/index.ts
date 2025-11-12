import type { FormilyComponent } from '@/types'
import Setter from './setter'
import Component from './ui.vue'

export default {
  component: Component,
  setterSchema: Setter,
  config: {
    name: '文本域',
    icon: 'Document',
    category: '基础',
    description: '多行文本输入框',
  },
  defaultSchema: {
    'type': 'string',
    'title': '文本域',
    'x-component': 'Textarea',
    'x-decorator': 'FormItem',
    'x-component-props': {
      placeholder: '请输入',
      rows: 4,
    },
  },
} as FormilyComponent
