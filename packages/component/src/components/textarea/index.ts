import type { FormilyComponent } from '@/types'
import Setter from './setter'
import Component from './ui.vue'

export default {
  component: Component,
  setterSchema: Setter,
  config: {
    name: '文本域',
    icon: 'Document',
    category: '基础',
    description: '多行文本输入框',
  },
} as FormilyComponent
