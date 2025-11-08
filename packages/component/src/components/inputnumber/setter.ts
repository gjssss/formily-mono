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
    min: {
      'type': 'number',
      'title': '最小值',
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.min',
    },
    max: {
      'type': 'number',
      'title': '最大值',
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.max',
    },
    step: {
      'type': 'number',
      'title': '步长',
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.step',
    },
    precision: {
      'type': 'number',
      'title': '精度',
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.precision',
    },
  },
} as ISchema
