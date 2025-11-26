import type { SetterConfig } from '../common/setterPresets'

export default {
  basicSetter: {},
  componentSetter: {
    type: 'object',
    properties: {
      columns: {
        'type': 'number',
        'title': '列数',
        'x-component': 'InputNumber',
        'x-decorator': 'FormItem',
        'x-path': 'x-component-props.columns',
        'x-component-props': {
          min: 1,
          max: 12,
        },
      },
      columnGap: {
        'type': 'number',
        'title': '列间距 (px)',
        'x-component': 'InputNumber',
        'x-decorator': 'FormItem',
        'x-path': 'x-component-props.columnGap',
        'x-component-props': {
          min: 0,
          max: 100,
        },
      },
      rowGap: {
        'type': 'number',
        'title': '行间距 (px)',
        'x-component': 'InputNumber',
        'x-decorator': 'FormItem',
        'x-path': 'x-component-props.rowGap',
        'x-component-props': {
          min: 0,
          max: 100,
        },
      },
    },
  },
} as SetterConfig
