import type { ISchema } from '@formily/vue'

export default {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: '字段标题',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-path': 'title', // 映射到 schema.title
    },
    placeholder: {
      type: 'string',
      title: '占位符',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.placeholder', // 映射到嵌套路径
    },
    maxlength: {
      type: 'number',
      title: '最大长度',
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.maxlength',
    },
  },
} as ISchema
