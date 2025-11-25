import type { ISchema } from '@formily/vue'
import { createSetterSchema, createSetterItem } from '../common/setterFactory'

export default createSetterSchema({
  // Select 特定属性
  multiple: createSetterItem(
    'boolean',
    '多选',
    'Switch',
    'x-component-props.multiple',
  ),
  filterable: createSetterItem(
    'boolean',
    '可搜索',
    'Switch',
    'x-component-props.filterable',
  ),
  allowCreate: createSetterItem(
    'boolean',
    '允许创建',
    'Switch',
    'x-component-props.allowCreate',
  ),
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
  includeInput: { placeholder: true, clearable: true, disabled: true, readonly: false },
  includeSize: false,
}) as ISchema
