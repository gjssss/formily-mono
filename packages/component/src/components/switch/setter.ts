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
    activeText: {
      'type': 'string',
      'title': '激活文字',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.activeText',
    },
    inactiveText: {
      'type': 'string',
      'title': '未激活文字',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.inactiveText',
    },
  },
} as ISchema
