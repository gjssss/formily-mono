<script setup lang="ts">
import FormItemLayout from '../common/FormItemLayout.vue'

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
  layout?: 'inline' | 'vertical'
  labelAlign?: 'left' | 'right'
  // Checkbox specific props
  value?: (string | number)[]
  onChange?: (value: (string | number)[]) => void
  options?: Option[]
  min?: number
  max?: number
  disabled?: boolean
}>()

interface Option {
  label: string
  value: string | number
}
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
      :disabled="props.disabled"
      @update:model-value="props.onChange"
    />
  </FormItemLayout>
</template>
