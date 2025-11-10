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
