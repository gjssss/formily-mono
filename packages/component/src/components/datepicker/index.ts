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
} as FormilyComponent
