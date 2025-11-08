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
    rows: {
      'type': 'number',
      'title': '行数',
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.rows',
    },
    maxlength: {
      'type': 'number',
      'title': '最大长度',
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.maxlength',
    },
    showWordLimit: {
      'type': 'boolean',
      'title': '显示字数限制',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.showWordLimit',
    },
  },
} as ISchema
