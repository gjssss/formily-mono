import type { ISchema } from '@formily/vue'
import { createSetterSchema, createSetterItem } from '../common/setterFactory'

export default createSetterSchema({
  // TextArea 特定属性
  rows: createSetterItem(
    'number',
    '行数',
    'InputNumber',
    'x-component-props.rows',
    { min: 1, max: 20, step: 1 },
  ),
  maxlength: createSetterItem(
    'number',
    '最大长度',
    'InputNumber',
    'x-component-props.maxlength',
    { min: 0 },
  ),
  showWordLimit: createSetterItem(
    'boolean',
    '显示字数限制',
    'Switch',
    'x-component-props.showWordLimit',
  ),
  autosize: createSetterItem(
    'boolean',
    '自适应高度',
    'Switch',
    'x-component-props.autosize',
  ),
  resize: createSetterItem(
    'string',
    '缩放',
    'Select',
    'x-component-props.resize',
    {
      options: [
        { label: '无', value: 'none' },
        { label: '垂直', value: 'vertical' },
        { label: '水平', value: 'horizontal' },
        { label: '全部', value: 'both' },
      ],
    },
  ),
}, {
  includeTitle: true,
  includeInput: true,
  includeSize: false,
}) as ISchema
