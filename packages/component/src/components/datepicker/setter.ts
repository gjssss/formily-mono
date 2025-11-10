import type { ISchema } from '@formily/vue'

export default {
  type: 'object',
  properties: {
    // 组件特定属性
    type: {
      'type': 'string',
      'title': '类型',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.type',
      'x-component-props': {
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
    },
    placeholder: {
      'type': 'string',
      'title': '占位符',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.placeholder',
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
    clearable: {
      'type': 'boolean',
      'title': '可清空',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.clearable',
    },
    editable: {
      'type': 'boolean',
      'title': '可输入',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.editable',
    },
  },
} as ISchema
