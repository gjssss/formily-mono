import type { ISchema } from '@formily/vue'
import { createSetterSchema } from '../common/setterFactory'

export default createSetterSchema({
  // DatePicker 特定属性
  type: {
    'type': 'string',
    'title': '类型',
    'x-component': 'Select',
    'x-decorator': 'FormItem',
    'x-path': 'x-component-props.type',
    'enum': [
      { label: '日期', value: 'date' },
      { label: '日期时间', value: 'datetime' },
      { label: '日期范围', value: 'daterange' },
      { label: '日期时间范围', value: 'datetimerange' },
      { label: '年', value: 'year' },
      { label: '月', value: 'month' },
      { label: '周', value: 'week' },
    ],
  },
  format: {
    'type': 'string',
    'title': '显示格式',
    'x-component': 'Input',
    'x-decorator': 'FormItem',
    'x-path': 'x-component-props.format',
    'x-component-props': {
      placeholder: '如: YYYY-MM-DD',
    },
  },
  valueFormat: {
    'type': 'string',
    'title': '值格式',
    'x-component': 'Input',
    'x-decorator': 'FormItem',
    'x-path': 'x-component-props.valueFormat',
    'x-component-props': {
      placeholder: '如: YYYY-MM-DD',
    },
  },
  editable: {
    'type': 'boolean',
    'title': '可输入',
    'x-component': 'Switch',
    'x-decorator': 'FormItem',
    'x-path': 'x-component-props.editable',
  },
}, {
  includeTitle: true,
  includeInput: { placeholder: true, clearable: true, disabled: true, readonly: true },
  includeSize: false,
}) as ISchema
