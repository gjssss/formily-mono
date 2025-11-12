import type { FormilyComponent } from '@/types'
import Setter from './setter'
import Component from './ui.vue'

export default {
  component: Component,
  setterSchema: Setter,
  config: {
    name: '输入框',
    icon: 'EditPen',
    category: '基础',
    description: '单行文本输入框',
  },
  defaultSchema: {
    'type': 'string',
    'title': '输入框',
    'x-component': 'Input',
    'x-decorator': 'FormItem',
    'x-component-props': {
      placeholder: '请输入',
    },
  },
} as FormilyComponent
