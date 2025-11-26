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
}, {
  includeTitle: true,
  includeInput: true,
  includeSize: true,
}) as ISchema
