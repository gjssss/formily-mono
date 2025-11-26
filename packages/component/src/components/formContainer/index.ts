import type { FormilyComponent } from '@/types'
import Setter from './setter'
import Component from './ui.vue'

export default {
  component: Component,
  setterSchema: Setter,
  config: {
    name: '表单容器',
    icon: 'Box',
    category: '布局',
    description: '表单容器，可以为内部组件提供统一配置',
  },
  defaultSchema: {
    'type': 'void',
    'title': '表单容器',
    'x-component': 'FormContainer',
    'x-component-props': {
      layout: 'horizontal',
      labelWidth: '100px',
      labelAlign: 'right',
      size: 'default',
      disabled: false,
    },
    'properties': {},
  },
} as FormilyComponent
