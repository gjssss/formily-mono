import type { SetterConfig } from '../common/setterPresets'
import { basicSetter, inputSetter, sizeSetter } from '../common/setterPresets'

export default {
  basicSetter: {
    ...basicSetter,
    ...inputSetter,
    ...sizeSetter,
  },
  // Input 特定属性
  componentSetter: {
    type: 'object',
    properties: {
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
    },
  },
} as SetterConfig
