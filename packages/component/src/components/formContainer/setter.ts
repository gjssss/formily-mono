import type { SetterConfig } from '../common/setterPresets'
import { basicSetter, patternSetter } from '../common/setterPresets'

export default {
  basicSetter: {
    ...basicSetter,
    ...patternSetter,
  },
  componentSetter: {
    type: 'object',
    properties: {
      gap: {
        'type': 'number',
        'title': '全局间距 (px)',
        'x-component': 'InputNumber',
        'x-decorator': 'FormItem',
        'x-path': 'x-component-props.form-gap',
      },
      layout: {
        'type': 'string',
        'title': '全局布局',
        'x-component': 'Select',
        'x-decorator': 'FormItem',
        'x-path': 'x-component-props.layout',
        'enum': [
          { label: '继承', value: 'inherit' },
          { label: '水平', value: 'horizontal' },
          { label: '垂直', value: 'vertical' },
          { label: '行内', value: 'inline' },
        ],
      },
      labelWidth: {
        'type': 'string',
        'title': '全局标签宽度',
        'x-component': 'Input',
        'x-decorator': 'FormItem',
        'x-path': 'x-component-props.labelWidth',
        'x-component-props': {
          placeholder: '如: 100px, auto',
        },
      },
      labelAlign: {
        'type': 'string',
        'title': '全局标签对齐',
        'x-component': 'Select',
        'x-decorator': 'FormItem',
        'x-path': 'x-component-props.labelAlign',
        'enum': [
          { label: '继承', value: 'inherit' },
          { label: '左对齐', value: 'left' },
          { label: '右对齐', value: 'right' },
          { label: '顶部', value: 'top' },
        ],
      },
      size: {
        'type': 'string',
        'title': '全局尺寸',
        'x-component': 'Select',
        'x-decorator': 'FormItem',
        'x-path': 'x-component-props.size',
        'enum': [
          { label: '大', value: 'large' },
          { label: '默认', value: 'default' },
          { label: '小', value: 'small' },
        ],
      },
    },
  },
} as SetterConfig
