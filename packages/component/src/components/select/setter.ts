import type { ISchema } from '@formily/vue'

export default {
  type: 'object',
  properties: {
    // 组件特定属性
    placeholder: {
      'type': 'string',
      'title': '占位符',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.placeholder',
    },
    multiple: {
      'type': 'boolean',
      'title': '多选',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.multiple',
    },
    clearable: {
      'type': 'boolean',
      'title': '可清空',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.clearable',
    },
    filterable: {
      'type': 'boolean',
      'title': '可搜索',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.filterable',
    },
    allowCreate: {
      'type': 'boolean',
      'title': '允许创建',
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
      'x-path': 'x-component-props.options',
      'items': {
        'type': 'object',
        'properties': {
          'space': {
            'type': 'void',
            'x-component': 'Space',
            'properties': {
              'sort': {
                'type': 'void',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayItems.SortHandle',
              },
              'label': {
                'type': 'string',
                'title': '标签',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '显示文本',
                },
              },
              'value': {
                'type': 'string',
                'title': '值',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '选项值',
                },
              },
              'remove': {
                'type': 'void',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayItems.Remove',
              },
            },
          },
        },
      },
      'properties': {
        'add': {
          'type': 'void',
          'title': '添加选项',
          'x-component': 'ArrayItems.Addition',
        },
      },
    },
  },
} as ISchema
