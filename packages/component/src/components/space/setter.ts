import type { ISchema } from '@formily/vue'

export default {
  type: 'object',
  properties: {
    direction: {
      type: 'string',
      title: '方向',
      'x-component': 'Radio',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.direction',
      'x-component-props': {
        options: [
          { label: '水平', value: 'horizontal' },
          { label: '垂直', value: 'vertical' },
        ],
      },
    },
    size: {
      type: 'number',
      title: '间距 (px)',
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.size',
      'x-component-props': {
        min: 0,
        max: 100,
      },
    },
    align: {
      type: 'string',
      title: '对齐',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.align',
      'x-component-props': {
        options: [
          { label: '起始对齐', value: 'flex-start' },
          { label: '居中对齐', value: 'center' },
          { label: '末尾对齐', value: 'flex-end' },
        ],
      },
    },
  },
} as ISchema
