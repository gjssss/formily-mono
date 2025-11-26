import type { ISchema } from '@formily/vue'
import { createSetterSchema } from '../common/setterFactory'

export default createSetterSchema({
  // Switch 特定属性
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
}, {
  includeTitle: true,
  includeInput: { placeholder: false, clearable: false, disabled: true, readonly: false },
  includeSize: true,
}) as ISchema
