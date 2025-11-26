import type { SetterConfig } from '../common/setterPresets'
import { basicSetter, patternSetter, sizeSetter } from '../common/setterPresets'

export default {
  basicSetter: {
    ...basicSetter,
    ...patternSetter,
    ...sizeSetter,
  },
  componentSetter: {
    type: 'object',
    properties: {
      // Checkbox 特定属性
      min: {
        'type': 'number',
        'title': '最少选择数',
        'x-component': 'InputNumber',
        'x-decorator': 'FormItem',
        'x-path': 'x-component-props.min',
        'x-component-props': {
          min: 0,
        },
      },
      max: {
        'type': 'number',
        'title': '最多选择数',
        'x-component': 'InputNumber',
        'x-decorator': 'FormItem',
        'x-path': 'x-component-props.max',
        'x-component-props': {
          min: 0,
        },
      },
      // 选项配置
      options: {
        'type': 'array',
        'title': '选项列表',
        'x-component': 'ArrayItems',
        'x-decorator': 'FormItem',
        'x-path': 'enum',
        'x-decorator-props': {
          inset: false,
          bordered: false,
          wrapperWrap: false,
          labelWrap: false,
          fullness: false,
          layout: 'vertical',
          labelAlign: 'left',
        },
        'items': {
          type: 'object',
          properties: {
            space: {
              'type': 'void',
              'x-component': 'Space',
              'properties': {
                kv: {
                  type: 'void',
                  properties: {
                    label: {
                      'type': 'string',
                      'title': '标签',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: '显示文本',
                      },
                      'x-decorator-props': {
                        labelWidth: '42px',
                      },
                    },
                    value: {
                      'type': 'string',
                      'title': '值',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: '选项值',
                      },
                      'x-decorator-props': {
                        labelWidth: '42px',
                      },
                    },
                  },
                },
                remove: {
                  'type': 'void',
                  'x-decorator': 'FormItem',
                  'x-component': 'ArrayItems.Remove',
                },
              },
            },
          },
        },
        'properties': {
          add: {
            'type': 'void',
            'title': '添加选项',
            'x-component': 'ArrayItems.Addition',
          },
        },
      },
    },
  },
} as SetterConfig
