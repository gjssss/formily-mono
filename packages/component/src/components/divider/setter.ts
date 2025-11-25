import type { ISchema } from '@formily/vue'

export default {
  type: 'object',
  properties: {
    orientation: {
      type: 'string',
      title: '方向',
      'x-component': 'Radio.Group',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.orientation',
      'enum': [
        { label: '水平', value: 'horizontal' },
        { label: '垂直', value: 'vertical' },
      ],
    },
    dashed: {
      type: 'boolean',
      title: '虚线',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.dashed',
    },
  },
} as ISchema
