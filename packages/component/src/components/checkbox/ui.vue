<script setup lang="ts">
import { computed } from 'vue'
import FormItemLayout from '../common/FormItemLayout.vue'
import { useFormContainerInherit } from '../common/useFormContainerInherit'
import type { FormilyPattern } from '@/types'

defineOptions({
  name: 'CheckboxComponent',
  inheritAttrs: false,
})

const props = defineProps<{
  // FormItemLayout props
  title?: string
  required?: boolean
  tooltip?: string
  labelWidth?: string
  layout?: 'inline' | 'vertical' | 'inherit'
  labelAlign?: 'left' | 'right' | 'inherit'
  pattern?: FormilyPattern
  // Checkbox specific props
  value?: (string | number)[]
  onChange?: (value: (string | number)[]) => void
  options?: Option[]
  min?: number
  max?: number
  size?: 'large' | 'default' | 'small' | 'inherit'
}>()

interface Option {
  label: string
  value: string | number
}

// 处理继承逻辑
const inheritedProps = useFormContainerInherit(props)
const patternState = computed(() => {
  const pattern = inheritedProps.value.pattern
  return {
    disabled: pattern === 'disabled',
    readonly: pattern === 'readOnly',
  }
})
const isDisabled = computed(() => patternState.value.disabled || patternState.value.readonly)
</script>

<template>
  <FormItemLayout
    :title="props.title"
    :required="props.required"
    :tooltip="props.tooltip"
    :label-width="inheritedProps.labelWidth"
    :layout="inheritedProps.layout"
    :label-align="inheritedProps.labelAlign"
  >
    <ElCheckboxGroup
      :model-value="props.value"
      :options="props.options"
      :min="props.min"
      :max="props.max"
      :disabled="isDisabled"
      :size="inheritedProps.size"
      @update:model-value="props.onChange"
    />
  </FormItemLayout>
</template>
