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
      'type': 'string',
      'title': '默认值',
      'x-component': 'TextArea',
      'x-decorator': 'FormItem',
      'x-path': 'default',
      'x-component-props': {
        rows: 3,
      },
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
    rows: {
      'type': 'number',
      'title': '行数',
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.rows',
      'x-component-props': {
        min: 1,
        max: 20,
        step: 1,
      },
    },
    maxlength: {
      'type': 'number',
      'title': '最大长度',
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.maxlength',
      'x-component-props': {
        min: 0,
      },
    },
    showWordLimit: {
      'type': 'boolean',
      'title': '显示字数限制',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.showWordLimit',
    },
    autosize: {
      'type': 'boolean',
      'title': '自适应高度',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.autosize',
    },
    resize: {
      'type': 'string',
      'title': '缩放',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.resize',
      'x-component-props': {
        options: [
          { label: '无', value: 'none' },
          { label: '垂直', value: 'vertical' },
          { label: '水平', value: 'horizontal' },
          { label: '全部', value: 'both' },
        ],
      },
    },
  },
} as ISchema
