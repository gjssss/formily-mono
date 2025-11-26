import type { ISchema } from '@formily/vue'

/**
 * Setter 配置类型
 */
export interface SetterConfig {
  basicSetter: Record<string, ISchema>
  componentSetter: ISchema
}

/**
 * 基础配置 Setter（标题、必填、提示等）
 */
export const basicSetter: Record<string, ISchema> = {
  title: {
    'type': 'string',
    'title': '标题',
    'x-component': 'Input',
    'x-decorator': 'FormItem',
    'x-path': 'title',
  },
  required: {
    'type': 'boolean',
    'title': '必填',
    'x-component': 'Switch',
    'x-decorator': 'FormItem',
    'x-path': 'required',
    'x-component-props': {
      activeText: '显示',
      inactiveText: '隐藏',
    },
  },
  tooltip: {
    'type': 'string',
    'title': '提示信息',
    'x-component': 'Input',
    'x-decorator': 'FormItem',
    'x-path': 'x-component-props.tooltip',
    'x-component-props': {
      placeholder: '鼠标悬停时显示的提示',
    },
  },
  labelWidth: {
    'type': 'string',
    'title': '标签宽度',
    'x-component': 'Input',
    'x-decorator': 'FormItem',
    'x-path': 'x-component-props.labelWidth',
    'x-component-props': {
      placeholder: '如: 100px, auto',
    },
  },
  layout: {
    'type': 'string',
    'title': '布局方式',
    'x-component': 'Select',
    'x-decorator': 'FormItem',
    'x-path': 'x-component-props.layout',
    'enum': [
      { label: '继承', value: 'inherit' },
      { label: '行内', value: 'inline' },
      { label: '垂直', value: 'vertical' },
    ],
  },
  labelAlign: {
    'type': 'string',
    'title': '标签对齐',
    'x-component': 'Select',
    'x-decorator': 'FormItem',
    'x-path': 'x-component-props.labelAlign',
    'enum': [
      { label: '继承', value: 'inherit' },
      { label: '左对齐', value: 'left' },
      { label: '右对齐', value: 'right' },
    ],
  },
}

/**
 * 输入控件通用配置 Setter
 */
export const inputSetter: Record<string, ISchema> = {
  placeholder: {
    'type': 'string',
    'title': '占位符',
    'x-component': 'Input',
    'x-decorator': 'FormItem',
    'x-path': 'x-component-props.placeholder',
  },
  clearable: {
    'type': 'boolean',
    'title': '可清空',
    'x-component': 'Switch',
    'x-decorator': 'FormItem',
    'x-path': 'x-component-props.clearable',
  },
  disabled: {
    'type': 'string',
    'title': '禁用',
    'x-component': 'Select',
    'x-decorator': 'FormItem',
    'x-path': 'x-component-props.disabled',
    'enum': [
      { label: '继承', value: 'inherit' },
      { label: '是', value: true },
      { label: '否', value: false },
    ],
  },
  readonly: {
    'type': 'boolean',
    'title': '只读',
    'x-component': 'Switch',
    'x-decorator': 'FormItem',
    'x-path': 'x-component-props.readonly',
  },
}

/**
 * 尺寸配置 Setter
 */
export const sizeSetter: Record<string, ISchema> = {
  size: {
    'type': 'string',
    'title': '尺寸',
    'x-component': 'Select',
    'x-decorator': 'FormItem',
    'x-path': 'x-component-props.size',
    'enum': [
      { label: '继承', value: 'inherit' },
      { label: '大', value: 'large' },
      { label: '默认', value: 'default' },
      { label: '小', value: 'small' },
    ],
  },
}

/**
 * 仅包含 disabled 的配置（用于不需要其他输入配置的组件）
 */
export const disabledOnlySetter: Record<string, ISchema> = {
  disabled: {
    'type': 'string',
    'title': '禁用',
    'x-component': 'Select',
    'x-decorator': 'FormItem',
    'x-path': 'x-component-props.disabled',
    'enum': [
      { label: '继承', value: 'inherit' },
      { label: '是', value: true },
      { label: '否', value: false },
    ],
  },
}
