import type { FormilyComponent } from '../../types'
import Component from './ui.vue'
import Setter from './setter'

export default {
  component: Component,
  setterSchema: Setter,
  config: {
    name: 'Flex 布局',
    icon: 'Grid',
    category: '布局',
    description: 'Flex 弹性布局容器',
  },
  defaultSchema: {
    type: 'void',
    title: 'Flex 容器',
    'x-component': 'Flex',
    'x-component-props': {
      direction: 'row',
      justify: 'flex-start',
      align: 'flex-start',
      wrap: 'nowrap',
      gap: 0,
    },
    properties: {},
  },
} as FormilyComponent
