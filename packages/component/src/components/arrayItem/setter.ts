import type { SetterConfig } from '../common/setterPresets'

export default {
  basicSetter: {},
  componentSetter: {
    type: 'object',
    properties: {
      // ArrayItem 通常不需要太多配置
      // 它主要作为容器使用，配置在 Array 层面
    },
  },
} as SetterConfig
