import type { ISchema } from '@formily/vue'
import { createSetterSchema } from '../common/setterFactory'

export default createSetterSchema({
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
    'items': {
      type: 'object',
      properties: {
        space: {
          'type': 'void',
          'x-component': 'Space',
          'properties': {
            sort: {
              'type': 'void',
              'x-decorator': 'FormItem',
              'x-component': 'ArrayItems.SortHandle',
            },
            label: {
              'type': 'string',
              'title': '标签',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '显示文本',
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
}, {
  includeTitle: true,
  includeInput: { placeholder: false, clearable: false, disabled: true, readonly: false },
  includeSize: false,
}) as ISchema
