import type { SetterConfig } from '../common/setterPresets'
import { basicSetter, inputSetter, patternSetter, sizeSetter } from '../common/setterPresets'

export default {
  basicSetter: {
    ...basicSetter,
    ...inputSetter,
    ...patternSetter,
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
      prefix: {
        'type': 'string',
        'title': '前缀',
        'x-component': 'Input',
        'x-decorator': 'FormItem',
        'x-path': 'x-component-props.prefix',
      },
      suffix: {
        'type': 'string',
        'title': '后缀',
        'x-component': 'Input',
        'x-decorator': 'FormItem',
        'x-path': 'x-component-props.suffix',
      },
    },
  },
} as SetterConfig
