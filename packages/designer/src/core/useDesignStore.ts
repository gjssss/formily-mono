import type { DesignStore } from './types'
import { inject } from 'vue'
import { DesignStoreKey } from './types'

/**
 * 获取设计器状态（在 Designer 子组件中使用）
 *
 * 用法：
 * ```vue
 * <script setup>
 * const store = useDesignStore()
 * const { fields, selectedFieldId, addField } = store
 * </script>
 * ```
 *
 * @throws {Error} 如果在 Designer 组件外使用会抛出错误
 */
export function useDesignStore(): DesignStore {
  const store = inject(DesignStoreKey)

  if (!store) {
    throw new Error('[useDesignStore] 必须在 Designer 组件内使用')
  }

  return store
}
