import type { ISchema } from '@formily/vue'

export default {
  type: 'object',
  properties: {
    // 组件特定属性
    placeholder: {
      'type': 'string',
      'title': '占位符',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.placeholder',
    },
    maxlength: {
      'type': 'number',
      'title': '最大长度',
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.maxlength',
      'x-component-props': {
        min: 0,
      },
    },
    showWordLimit: {
      'type': 'boolean',
      'title': '显示字数',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.showWordLimit',
    },
    clearable: {
      'type': 'boolean',
      'title': '可清空',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.clearable',
    },
    prefixIcon: {
      'type': 'string',
      'title': '前缀图标',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.prefixIcon',
    },
    suffixIcon: {
      'type': 'string',
      'title': '后缀图标',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.suffixIcon',
    },
  },
} as ISchema
