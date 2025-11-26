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
  defaultSchema: {
    'type': 'string',
    'title': '复选框',
    'x-component': 'Checkbox',
    'x-decorator': 'FormItem',
    'enum': [
      { label: '选项1', value: '1' },
      { label: '选项2', value: '2' },
      { label: '选项3', value: '3' },
    ],
  },
} as FormilyComponent
