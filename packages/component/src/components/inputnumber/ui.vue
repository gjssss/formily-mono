<script setup lang="ts">
import FormItemLayout from '../common/FormItemLayout.vue'
import { useFormContainerInherit } from '../common/useFormContainerInherit'

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
  disabled?: boolean | 'inherit'
  readonly?: boolean
  size?: 'large' | 'default' | 'small' | 'inherit'
}>()

// 处理继承逻辑
const inheritedProps = useFormContainerInherit(props)
</script>

<template>
  <FormItemLayout
    :title="props.title"
    :required="props.required"
    :tooltip="props.tooltip"
    :label-width="props.labelWidth"
    :layout="props.layout"
    :label-align="props.labelAlign"
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
      :disabled="inheritedProps.disabled"
      :readonly="props.readonly"
      :size="inheritedProps.size"
      @update:model-value="props.onChange"
    />
  </FormItemLayout>
</template>
