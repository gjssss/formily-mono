import type { SetterConfig } from '../common/setterPresets'
import { basicSetter, sizeSetter } from '../common/setterPresets'

export default {
  basicSetter: {
    ...basicSetter,
    // InputNumber 只需要 placeholder, disabled, readonly，不需要 clearable
    placeholder: {
      'type': 'string',
      'title': '占位符',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.placeholder',
    },
    disabled: {
      'type': 'string',
      'title': '禁用',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.disabled',
      'enum': [
        { label: '继承', value: 'inherit' },
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
    readonly: {
      'type': 'boolean',
      'title': '只读',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.readonly',
    },
    ...sizeSetter,
  },
  componentSetter: {
    type: 'object',
    properties: {
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
        'enum': [
          { label: '默认', value: '' },
          { label: '右侧', value: 'right' },
        ],
      },
    },
  },
} as SetterConfig
