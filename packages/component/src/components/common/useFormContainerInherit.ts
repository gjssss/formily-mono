import type { ComputedRef } from 'vue'
import type { FormilyPattern } from '@/types'
import { computed, inject } from 'vue'
import { formContainerKey } from '@/shared/symbol'

/**
 * 处理表单容器继承逻辑的 composable
 * 当属性值为 'inherit' 时，使用容器提供的值
 */
export function useFormContainerInherit<T extends Record<string, any>>(
  props: T,
): ComputedRef<T & {
  layout: 'inline' | 'vertical' | 'horizontal'
  labelWidth: string
  labelAlign: 'left' | 'right' | 'top'
  size: 'large' | 'default' | 'small'
  pattern: FormilyPattern
}> {
  const formContainer = inject(formContainerKey, computed(() => ({
    layout: 'vertical',
    labelWidth: 'auto',
    labelAlign: 'left',
    size: 'default',
    pattern: 'inherit' as FormilyPattern,
  })))

  return computed(() => {
    const result: any = { ...props }
    const resolvedPattern = props.pattern === 'inherit' || !props.pattern
      ? formContainer.value.pattern || 'inherit'
      : props.pattern
    result.pattern = resolvedPattern

    // 处理 size
    if (!props.size || props.size === 'inherit') {
      result.size = formContainer.value.size
    }

    // 处理 layout
    if (!props.layout || props.layout === 'inherit') {
      result.layout = formContainer.value.layout
    }

    // 处理 labelAlign
    if (!props.labelAlign || props.labelAlign === 'inherit') {
      result.labelAlign = formContainer.value.labelAlign
    }

    // 处理 labelWidth
    if (!props.labelWidth || props.labelWidth === 'inherit') {
      result.labelWidth = formContainer.value.labelWidth
    }
    return result
  })
}
