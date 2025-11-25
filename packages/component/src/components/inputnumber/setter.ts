import type { ISchema } from '@formily/vue'
import { createSetterSchema, createSetterItem } from '../common/setterFactory'

export default createSetterSchema({
  // InputNumber 特定属性
  min: createSetterItem(
    'number',
    '最小值',
    'InputNumber',
    'x-component-props.min',
  ),
  max: createSetterItem(
    'number',
    '最大值',
    'InputNumber',
    'x-component-props.max',
  ),
  step: createSetterItem(
    'number',
    '步长',
    'InputNumber',
    'x-component-props.step',
    { min: 0 },
  ),
  precision: createSetterItem(
    'number',
    '精度',
    'InputNumber',
    'x-component-props.precision',
    { min: 0, max: 10 },
  ),
  controls: createSetterItem(
    'boolean',
    '显示控制按钮',
    'Switch',
    'x-component-props.controls',
  ),
  controlsPosition: createSetterItem(
    'string',
    '控制按钮位置',
    'Select',
    'x-component-props.controlsPosition',
    {
      options: [
        { label: '默认', value: '' },
        { label: '右侧', value: 'right' },
      ],
    },
  ),
}, {
  includeTitle: true,
  includeInput: { placeholder: true, clearable: false, disabled: true, readonly: true },
  includeSize: false,
}) as ISchema
