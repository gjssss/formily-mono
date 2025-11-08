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
    placeholder: {
      'type': 'string',
      'title': '占位符',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.placeholder',
    },
    multiple: {
      'type': 'boolean',
      'title': '多选',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.multiple',
    },
    clearable: {
      'type': 'boolean',
      'title': '可清空',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.clearable',
    },
  },
} as ISchema
