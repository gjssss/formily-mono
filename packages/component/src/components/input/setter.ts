import type { ISchema } from '@formily/vue'
import { createSetterSchema, createSetterItem } from '../common/setterFactory'

export default createSetterSchema({
  // Input 特定属性
  maxlength: createSetterItem(
    'number',
    '最大长度',
    'InputNumber',
    'x-component-props.maxlength',
    { min: 0 },
  ),
  showWordLimit: createSetterItem(
    'boolean',
    '显示字数',
    'Switch',
    'x-component-props.showWordLimit',
  ),
  prefixIcon: createSetterItem(
    'string',
    '前缀图标',
    'Input',
    'x-component-props.prefixIcon',
  ),
  suffixIcon: createSetterItem(
    'string',
    '后缀图标',
    'Input',
    'x-component-props.suffixIcon',
  ),
}, {
  includeTitle: true,
  includeInput: true,
  includeSize: false,
}) as ISchema
