import Component from './ui.vue'

interface LocalFormilyComponent {
  component: any
  setterSchema: {
    basicSetter: Record<string, any>
    componentSetter: {
      type: string
      properties: Record<string, any>
    }
  }
  config: {
    name: string
    category: string
    description: string
  }
  defaultSchema: Record<string, any>
}

const setterSchema = {
  basicSetter: {},
  componentSetter: {
    type: 'object',
    properties: {},
  },
}

const defaultSchema = {
  'type': 'string',
  'title': '输入框',
  'x-component': 'Input',
  'x-pattern': 'inherit',
  'x-component-props': {
    placeholder: '请输入',
  },
}

const InputComponent: LocalFormilyComponent = {
  component: Component,
  setterSchema,
  config: {
    name: '输入框',
    category: '基础',
    description: 'uniapp playground 输入框',
  },
  defaultSchema,
}

export default InputComponent
