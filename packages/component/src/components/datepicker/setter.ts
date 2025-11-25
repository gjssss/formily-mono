import type { ISchema } from '@formily/vue'
import { createSetterSchema, createSetterItem } from '../common/setterFactory'

export default createSetterSchema({
  // DatePicker 特定属性
  type: createSetterItem(
    'string',
    '类型',
    'Select',
    'x-component-props.type',
    {
      options: [
        { label: '日期', value: 'date' },
        { label: '日期时间', value: 'datetime' },
        { label: '日期范围', value: 'daterange' },
        { label: '日期时间范围', value: 'datetimerange' },
        { label: '年', value: 'year' },
        { label: '月', value: 'month' },
        { label: '周', value: 'week' },
      ],
    },
  ),
  format: createSetterItem(
    'string',
    '显示格式',
    'Input',
    'x-component-props.format',
    { placeholder: '如: YYYY-MM-DD' },
  ),
  valueFormat: createSetterItem(
    'string',
    '值格式',
    'Input',
    'x-component-props.valueFormat',
    { placeholder: '如: YYYY-MM-DD' },
  ),
  editable: createSetterItem(
    'boolean',
    '可输入',
    'Switch',
    'x-component-props.editable',
  ),
}, {
  includeTitle: true,
  includeInput: { placeholder: true, clearable: true, disabled: true, readonly: true },
  includeSize: false,
}) as ISchema
