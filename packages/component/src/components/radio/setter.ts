import type { ISchema } from '@formily/vue'

export default {
  type: 'object',
  properties: {
    // 选项配置
    options: {
      'type': 'array',
      'title': '选项列表',
      'x-component': 'ArrayItems',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.options',
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
  },
} as ISchema
