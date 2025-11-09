import type { ISchema } from '@formily/vue'

export default {
  type: 'object',
  properties: {
    // 基础属性
    title: {
      'type': 'string',
      'title': '字段标题',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-path': 'title',
    },
    description: {
      'type': 'string',
      'title': '字段描述',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-path': 'description',
    },
    required: {
      'type': 'boolean',
      'title': '是否必填',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-path': 'required',
    },
    // 显示和交互
    'x-display': {
      'type': 'string',
      'title': '显示状态',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-path': 'x-display',
      'x-component-props': {
        options: [
          { label: '显示', value: 'visible' },
          { label: '隐藏（占位）', value: 'hidden' },
          { label: '隐藏（不占位）', value: 'none' },
        ],
      },
    },
    'x-pattern': {
      'type': 'string',
      'title': '交互模式',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-path': 'x-pattern',
      'x-component-props': {
        options: [
          { label: '可编辑', value: 'editable' },
          { label: '禁用', value: 'disabled' },
          { label: '只读', value: 'readOnly' },
        ],
      },
    },
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
