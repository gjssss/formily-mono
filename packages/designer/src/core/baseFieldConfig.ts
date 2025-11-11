import type { ISchema } from '@formily/vue'

/**
 * 通用的字段基础配置
 * 所有组件都会包含这些配置项
 */
export const baseFieldConfigSchema: ISchema = {
  type: 'object',
  properties: {
    'title': {
      'type': 'string',
      'title': '字段标题',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-path': 'title',
    },
    'description': {
      'type': 'string',
      'title': '字段描述',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-path': 'description',
    },
    'required': {
      'type': 'boolean',
      'title': '是否必填',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-path': 'required',
    },
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
  },
}
