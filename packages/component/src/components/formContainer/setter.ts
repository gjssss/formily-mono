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
      layoutStyle: {
        'type': 'string',
        'title': '布局样式',
        'x-component': 'Select',
        'x-decorator': 'FormItem',
        'x-path': 'x-component-props.layoutStyle',
        'enum': [
          { label: '无', value: 'none' },
          { label: '边框标题', value: 'border' },
          { label: '仅标题', value: 'border-none' },
        ],
      },
      titleStyle: {
        'type': 'string',
        'title': '标题样式',
        'x-component': 'Select',
        'x-decorator': 'FormItem',
        'x-path': 'x-component-props.titleStyle',
        'enum': [
          { label: '无', value: 'none' },
          { label: '居中', value: 'center' },
          { label: '左对齐', value: 'left' },
          { label: '右对齐', value: 'right' },
        ],
      },
    },
  },
} as SetterConfig
