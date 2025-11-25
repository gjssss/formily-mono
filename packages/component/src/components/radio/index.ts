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
  defaultSchema: {
    'type': 'string',
    'title': '单选框',
    'x-component': 'Radio.Group',
    'x-decorator': 'FormItem',
    'enum': [
      { label: '选项1', value: '1' },
      { label: '选项2', value: '2' },
      { label: '选项3', value: '3' },
    ],
  },
} as FormilyComponent
