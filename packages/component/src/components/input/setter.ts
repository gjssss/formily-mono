import type { ISchema } from '@formily/vue'
import { createSetterSchema } from '../common/setterFactory'

export default createSetterSchema({
  // Input 特定属性
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
}, {
  includeTitle: true,
  includeInput: true,
  includeSize: false,
}) as ISchema
