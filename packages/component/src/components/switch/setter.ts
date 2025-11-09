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
    default: {
      'type': 'boolean',
      'title': '默认值',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-path': 'default',
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
    activeText: {
      'type': 'string',
      'title': '激活文字',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.activeText',
    },
    inactiveText: {
      'type': 'string',
      'title': '未激活文字',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.inactiveText',
    },
    activeValue: {
      'type': 'string',
      'title': '激活值',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.activeValue',
      'x-component-props': {
        placeholder: '默认为 true',
      },
    },
    inactiveValue: {
      'type': 'string',
      'title': '未激活值',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.inactiveValue',
      'x-component-props': {
        placeholder: '默认为 false',
      },
    },
    inlinePrompt: {
      'type': 'boolean',
      'title': '内联文字',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.inlinePrompt',
    },
  },
} as ISchema
