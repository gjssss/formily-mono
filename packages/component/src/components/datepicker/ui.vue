<script setup lang="ts">
import FormItemLayout from '../common/FormItemLayout.vue'
import { useFormContainerInherit } from '../common/useFormContainerInherit'

defineOptions({
  name: 'DatePickerComponent',
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
  // DatePicker specific props
  value?: string | Date
  onChange?: (value: string | Date) => void
  placeholder?: string
  format?: string
  valueFormat?: string
  type?: 'date' | 'datetime' | 'daterange' | 'datetimerange' | 'year' | 'month' | 'week'
  clearable?: boolean
  editable?: boolean
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
    <ElDatePicker
      :placeholder="props.placeholder"
      :model-value="props.value"
      :format="props.format"
      :value-format="props.valueFormat"
      :type="props.type || 'date'"
      :clearable="props.clearable"
      :editable="props.editable"
      :disabled="inheritedProps.disabled"
      :readonly="props.readonly"
      :size="inheritedProps.size"
      @update:model-value="props.onChange"
    />
  </FormItemLayout>
</template>
