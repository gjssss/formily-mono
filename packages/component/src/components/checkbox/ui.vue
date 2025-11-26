<script setup lang="ts">
import FormItemLayout from '../common/FormItemLayout.vue'
import { useFormContainerInherit } from '../common/useFormContainerInherit'

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
  // Checkbox specific props
  value?: (string | number)[]
  onChange?: (value: (string | number)[]) => void
  options?: Option[]
  min?: number
  max?: number
  disabled?: boolean | 'inherit'
  size?: 'large' | 'default' | 'small' | 'inherit'
}>()

interface Option {
  label: string
  value: string | number
}

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
    <ElCheckboxGroup
      :model-value="props.value"
      :options="props.options"
      :min="props.min"
      :max="props.max"
      :disabled="inheritedProps.disabled"
      :size="inheritedProps.size"
      @update:model-value="props.onChange"
    />
  </FormItemLayout>
</template>
