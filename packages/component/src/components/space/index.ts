import type { FormilyComponent } from '../../types'
import Component from './ui.vue'
import Setter from './setter'

export default {
  component: Component,
  setterSchema: Setter,
  config: {
    name: 'Space 间距',
    icon: 'Grid',
    category: '布局',
    description: '快捷间距容器',
  },
  defaultSchema: {
    type: 'void',
    title: 'Space 间距',
    'x-component': 'Space',
    'x-component-props': {
      direction: 'horizontal',
      size: 8,
      align: 'center',
    },
    properties: {},
  },
} as FormilyComponent
