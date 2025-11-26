import type { ISchema } from '@formily/vue'

/**
 * 创建 Title 和布局相关的 Setter
 */
export function createTitleSetters(): Record<string, ISchema> {
  return {
    title: {
      'type': 'string',
      'title': '标题',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-path': 'title',
    },
    required: {
      'type': 'boolean',
      'title': '必填标记',
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
}

/**
 * 创建通用输入控件 Setter
 */
export function createInputSetters(options?: {
  placeholder?: boolean
  clearable?: boolean
  disabled?: boolean
  readonly?: boolean
}): Record<string, ISchema> {
  const {
    placeholder = true,
    clearable = true,
    disabled = true,
    readonly = true,
  } = options || {}

  const setters: Record<string, ISchema> = {}

  if (placeholder) {
    setters.placeholder = {
      'type': 'string',
      'title': '占位符',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.placeholder',
    }
  }

  if (clearable) {
    setters.clearable = {
      'type': 'boolean',
      'title': '可清空',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.clearable',
    }
  }

  if (disabled) {
    setters.disabled = {
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
    }
  }

  if (readonly) {
    setters.readonly = {
      'type': 'boolean',
      'title': '只读',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-path': 'x-component-props.readonly',
    }
  }

  return setters
}

/**
 * 创建尺寸相关的 Setter
 */
export function createSizeSetters(): Record<string, ISchema> {
  return {
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
}

/**
 * 创建完整的 Setter Schema
 */
export function createSetterSchema(
  componentSetters: Record<string, ISchema>,
  options?: {
    includeTitle?: boolean
    includeInput?: boolean | Parameters<typeof createInputSetters>[0]
    includeSize?: boolean
  },
): ISchema {
  const { includeTitle = true, includeInput = true, includeSize = false } = options || {}

  const properties: Record<string, ISchema> = {}

  // 添加 Title 和布局配置
  if (includeTitle) {
    Object.assign(properties, createTitleSetters())
  }

  // 添加通用输入配置
  if (includeInput) {
    const inputOptions = typeof includeInput === 'object' ? includeInput : undefined
    Object.assign(properties, createInputSetters(inputOptions))
  }

  // 添加尺寸配置
  if (includeSize) {
    Object.assign(properties, createSizeSetters())
  }

  // 添加组件特定配置
  Object.assign(properties, componentSetters)

  return {
    type: 'object',
    properties,
  } as ISchema
}
