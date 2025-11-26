import type { SetterConfig } from '../common/setterPresets'

export default {
  basicSetter: {},
  componentSetter: {
    type: 'object',
    properties: {
      direction: {
        'type': 'string',
        'title': '方向',
        'x-component': 'Switch',
        'x-decorator': 'FormItem',
        'x-path': 'x-component-props.direction',
        'x-component-props': {
          activeText: '水平',
          inactiveText: '垂直',
          activeValue: 'horizontal',
          inactiveValue: 'vertical',
        },
      },
      size: {
        'type': 'number',
        'title': '间距 (px)',
        'x-component': 'InputNumber',
        'x-decorator': 'FormItem',
        'x-path': 'x-component-props.size',
        'x-component-props': {
          min: 0,
          max: 100,
        },
      },
    },
  },
} as SetterConfig
