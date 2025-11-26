import type { ISchema } from '@formily/vue'
import { createSetterSchema } from '../common/setterFactory'

export default createSetterSchema({
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
  includeInput: { placeholder: false, clearable: false, disabled: true, readonly: false },
  includeSize: false,
}) as ISchema
