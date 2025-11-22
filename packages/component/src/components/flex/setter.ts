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
          { label: '水平', value: 'row' },
          { label: '垂直', value: 'column' },
        ],
      },
    },
    justify: {
      type: 'string',
      title: '主轴对齐',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.justify',
      'x-component-props': {
        options: [
          { label: '起始对齐', value: 'flex-start' },
          { label: '居中对齐', value: 'center' },
          { label: '末尾对齐', value: 'flex-end' },
          { label: '两端对齐', value: 'space-between' },
          { label: '分散对齐', value: 'space-around' },
        ],
      },
    },
    align: {
      type: 'string',
      title: '交叉轴对齐',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.align',
      'x-component-props': {
        options: [
          { label: '起始对齐', value: 'flex-start' },
          { label: '居中对齐', value: 'center' },
          { label: '末尾对齐', value: 'flex-end' },
          { label: '拉伸', value: 'stretch' },
        ],
      },
    },
    wrap: {
      type: 'string',
      title: '换行',
      'x-component': 'Radio',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.wrap',
      'x-component-props': {
        options: [
          { label: '不换行', value: 'nowrap' },
          { label: '换行', value: 'wrap' },
        ],
      },
    },
    gap: {
      type: 'number',
      title: '间距 (px)',
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.gap',
      'x-component-props': {
        min: 0,
        max: 100,
      },
    },
  },
} as ISchema
