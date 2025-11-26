<script setup lang="ts">
import { computed } from 'vue'
import FormItemLayout from '../common/FormItemLayout.vue'
import { useFormContainerInherit } from '../common/useFormContainerInherit'
import type { FormilyPattern } from '@/types'

defineOptions({
  name: 'InputNumberComponent',
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
  // InputNumber specific props
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  precision?: number
  placeholder?: string
  controls?: boolean
  controlsPosition?: '' | 'right'
  size?: 'large' | 'default' | 'small' | 'inherit'
}>()

// 处理继承逻辑
const inheritedProps = useFormContainerInherit(props)
const patternState = computed(() => {
  const pattern = inheritedProps.value.pattern
  return {
    disabled: pattern === 'disabled',
    readonly: pattern === 'readOnly',
  }
})
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
    <ElInputNumber
      :placeholder="props.placeholder"
      :model-value="props.value"
      :min="props.min"
      :max="props.max"
      :step="props.step"
      :precision="props.precision"
      :controls="props.controls"
      :controls-position="props.controlsPosition || undefined"
      :disabled="patternState.disabled"
      :readonly="patternState.readonly"
      :size="inheritedProps.size"
      @update:model-value="props.onChange"
    />
  </FormItemLayout>
</template>
