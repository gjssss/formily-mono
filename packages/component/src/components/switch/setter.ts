import type { ISchema } from '@formily/vue'
import { createSetterSchema, createSetterItem } from '../common/setterFactory'

export default createSetterSchema({
  // Switch 特定属性
  activeText: createSetterItem(
    'string',
    '激活文字',
    'Input',
    'x-component-props.activeText',
  ),
  inactiveText: createSetterItem(
    'string',
    '未激活文字',
    'Input',
    'x-component-props.inactiveText',
  ),
  activeValue: createSetterItem(
    'string',
    '激活值',
    'Input',
    'x-component-props.activeValue',
    { placeholder: '默认为 true' },
  ),
  inactiveValue: createSetterItem(
    'string',
    '未激活值',
    'Input',
    'x-component-props.inactiveValue',
    { placeholder: '默认为 false' },
  ),
  inlinePrompt: createSetterItem(
    'boolean',
    '内联文字',
    'Switch',
    'x-component-props.inlinePrompt',
  ),
}, {
  includeTitle: true,
  includeInput: { placeholder: false, clearable: false, disabled: true, readonly: false },
  includeSize: false,
}) as ISchema
