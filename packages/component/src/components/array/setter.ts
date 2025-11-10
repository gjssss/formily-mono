import type { ISchema } from '@formily/vue'

export default {
  type: 'object',
  properties: {
    // 数组特定属性
    minItems: {
      'type': 'number',
      'title': '最少项数',
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
      'x-path': 'minItems',
      'x-component-props': {
        min: 0,
      },
    },
    maxItems: {
      'type': 'number',
      'title': '最多项数',
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
      'x-path': 'maxItems',
      'x-component-props': {
        min: 0,
      },
    },
  },
} as ISchema
