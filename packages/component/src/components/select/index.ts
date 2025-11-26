import type { FormilyComponent } from '@/types'
import Setter from './setter'
import Component from './ui.vue'

export default {
  component: Component,
  setterSchema: Setter,
  config: {
    name: '下拉选择',
    icon: 'ArrowDown',
    category: '选择',
    description: '下拉选择器',
  },
  defaultSchema: {
    'type': 'string',
    'title': '下拉选择',
    'x-component': 'Select',
    'x-decorator': 'FormItem',
    'x-pattern': 'inherit',
    'x-component-props': {
      placeholder: '请选择',
    },
    'enum': [
      { label: '选项1', value: '1' },
      { label: '选项2', value: '2' },
      { label: '选项3', value: '3' },
    ],
  },
} as FormilyComponent
