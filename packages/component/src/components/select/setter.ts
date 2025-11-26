import type { ISchema } from '@formily/vue'
import { createSetterSchema } from '../common/setterFactory'

export default createSetterSchema({
  // Select 特定属性
  multiple: {
    'title': '多选',
    'type': 'boolean',
    'x-component': 'Switch',
    'x-decorator': 'FormItem',
    'x-path': 'x-component-props.multiple',
  },
  filterable: {
    'title': '可搜索',
    'type': 'boolean',
    'x-component': 'Switch',
    'x-decorator': 'FormItem',
    'x-path': 'x-component-props.filterable',
  },
  allowCreate: {
    'title': '允许创建',
    'type': 'boolean',
    'x-component': 'Switch',
    'x-decorator': 'FormItem',
    'x-path': 'x-component-props.allowCreate',
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
}, {
  includeTitle: true,
  includeInput: { placeholder: true, clearable: true, disabled: true, readonly: false },
  includeSize: false,
}) as ISchema
