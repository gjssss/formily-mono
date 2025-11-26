import type { FormilyComponent } from '../../types'
import Setter from './setter'
import Component from './ui.vue'

export default {
  component: Component,
  setterSchema: Setter,
  config: {
    name: '分割线',
    icon: 'Minus',
    category: '布局',
    description: '内容分割线',
  },
  defaultSchema: {
    'type': 'void',
    'title': '分割线',
    'x-component': 'Divider',
    'x-droppable': false, // 关键标记：不可放置子组件
    'x-component-props': {
      orientation: 'horizontal',
      dashed: false,
    },
  },
} as FormilyComponent
