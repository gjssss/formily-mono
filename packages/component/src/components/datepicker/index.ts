import type { FormilyComponent } from '@/types'
import Setter from './setter'
import Component from './ui.vue'

export default {
  component: Component,
  setterSchema: Setter,
  config: {
    name: '日期选择器',
    icon: 'Calendar',
    category: '基础',
    description: '日期选择控件',
  },
  defaultSchema: {
    'type': 'string',
    'title': '日期选择器',
    'x-component': 'DatePicker',
    'x-decorator': 'FormItem',
    'x-component-props': {
      placeholder: '请选择日期',
    },
  },
} as FormilyComponent
