import type { ISchema } from '@formily/vue'

export default {
  type: 'object',
  properties: {
    title: {
      'type': 'string',
      'title': '字段标题',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-path': 'title',
    },
  },
} as ISchema
