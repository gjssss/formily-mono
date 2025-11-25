import type { ISchema } from '@formily/vue'
import { createSetterSchema } from '../common/setterFactory'

export default createSetterSchema({
  // TextArea 特定属性
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
    'enum': [
      { label: '无', value: 'none' },
      { label: '垂直', value: 'vertical' },
      { label: '水平', value: 'horizontal' },
      { label: '全部', value: 'both' },
    ],
  },
}, {
  includeTitle: true,
  includeInput: true,
  includeSize: false,
}) as ISchema
