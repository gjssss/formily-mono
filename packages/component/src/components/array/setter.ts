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
    // 数组特定属性
    minItems: {
      'type': 'number',
      'title': '最少项数',
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
      'x-path': 'minItems',
      'x-component-props': {
        min: 0,
      },
    },
    maxItems: {
      'type': 'number',
      'title': '最多项数',
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
      'x-path': 'maxItems',
      'x-component-props': {
        min: 0,
      },
    },
  },
} as ISchema
