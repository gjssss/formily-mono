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
    format: {
      'type': 'string',
      'title': '格式',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.format',
    },
    type: {
      'type': 'string',
      'title': '类型',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.type',
      'enum': [
        { label: '日期', value: 'date' },
        { label: '日期时间', value: 'datetime' },
        { label: '日期范围', value: 'daterange' },
        { label: '日期时间范围', value: 'datetimerange' },
      ],
    },
  },
} as ISchema
