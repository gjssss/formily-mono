import type { FormilyComponent } from '@/types'
import Setter from './setter'
import Component from './ui.vue'

export default {
  component: Component,
  setterSchema: Setter,
  config: {
    name: '数字输入框',
    icon: 'Histogram',
    category: '基础',
    description: '数字输入控件',
  },
  defaultSchema: {
    'type': 'number',
    'title': '数字输入框',
    'x-component': 'InputNumber',
    'x-decorator': 'FormItem',
    'x-pattern': 'inherit',
    'x-component-props': {
      placeholder: '请输入数字',
    },
  },
} as FormilyComponent
