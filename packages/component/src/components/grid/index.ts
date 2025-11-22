import type { FormilyComponent } from '../../types'
import Component from './ui.vue'
import Setter from './setter'

export default {
  component: Component,
  setterSchema: Setter,
  config: {
    name: 'Grid 布局',
    icon: 'Grid',
    category: '布局',
    description: 'Grid 网格布局容器',
  },
  defaultSchema: {
    type: 'void',
    title: 'Grid 容器',
    'x-component': 'Grid',
    'x-component-props': {
      columns: 3,
      rows: 'auto',
      columnGap: 16,
      rowGap: 16,
    },
    properties: {},
  },
} as FormilyComponent
