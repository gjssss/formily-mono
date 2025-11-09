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
      'type': 'number',
      'title': '默认值',
      'x-component': 'InputNumber',
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
    placeholder: {
      'type': 'string',
      'title': '占位符',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.placeholder',
    },
    min: {
      'type': 'number',
      'title': '最小值',
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.min',
    },
    max: {
      'type': 'number',
      'title': '最大值',
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.max',
    },
    step: {
      'type': 'number',
      'title': '步长',
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.step',
      'x-component-props': {
        min: 0,
      },
    },
    precision: {
      'type': 'number',
      'title': '精度',
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.precision',
      'x-component-props': {
        min: 0,
        max: 10,
      },
    },
    controls: {
      'type': 'boolean',
      'title': '显示控制按钮',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.controls',
    },
    controlsPosition: {
      'type': 'string',
      'title': '控制按钮位置',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.controlsPosition',
      'x-component-props': {
        options: [
          { label: '默认', value: '' },
          { label: '右侧', value: 'right' },
        ],
      },
    },
  },
} as ISchema
