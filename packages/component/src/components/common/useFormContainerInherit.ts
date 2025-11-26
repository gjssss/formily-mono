import type { ComputedRef } from 'vue'
import { computed, inject } from 'vue'
import { formContainerKey } from '@/shared/symbol'

/**
 * 处理表单容器继承逻辑的 composable
 * 当属性值为 'inherit' 时，使用容器提供的值
 */
export function useFormContainerInherit<T extends Record<string, any>>(
  props: T,
): ComputedRef<T & { disabled: boolean, layout: 'inline' | 'vertical', labelWidth: string, labelAlign: 'left' | 'right', size: 'large' | 'default' | 'small' }> {
  const formContainer = inject(formContainerKey, computed(() => ({
    disabled: false,
    layout: 'vertical',
    labelWidth: 'auto',
    labelAlign: 'left',
    size: 'default',
  })))

  return computed(() => {
    const result: any = { ...props }

    // 处理 disabled
    if (props.disabled === 'inherit') {
      result.disabled = formContainer.value.disabled
    }

    // 处理 size
    if (props.size === 'inherit') {
      result.size = formContainer.value.size
    }

    // 处理 layout
    if (props.layout === 'inherit') {
      result.layout = formContainer.value.layout
    }

    // 处理 labelAlign
    if (props.labelAlign === 'inherit') {
      result.labelAlign = formContainer.value.labelAlign
    }

    // 处理 labelWidth
    if (props.labelWidth === 'inherit') {
      result.labelWidth = formContainer.value.labelWidth
    }

    return result
  })
}
