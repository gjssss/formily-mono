import type { SetterConfig } from '../common/setterPresets'
import { basicSetter, patternSetter } from '../common/setterPresets'

export default {
  basicSetter: {
    ...basicSetter,
    ...patternSetter,
  },
  componentSetter: {
    type: 'object',
    properties: {
      // 数组特定属性
      minItems: {
        'type': 'number',
        'title': '最少项数',
        'x-component': 'InputNumber',
        'x-decorator': 'FormItem',
        'x-path': 'minItems',
        'x-component-props': {
          min: 0,
        },
      },
      maxItems: {
        'type': 'number',
        'title': '最多项数',
        'x-component': 'InputNumber',
        'x-decorator': 'FormItem',
        'x-path': 'maxItems',
        'x-component-props': {
          min: 0,
        },
      },
    },
  },
} as SetterConfig
