<script setup lang="ts">
import FormItemLayout from '../common/FormItemLayout.vue'

defineOptions({
  name: 'SelectComponent',
  inheritAttrs: false,
})

interface Option {
  label: string
  value: string | number
}

const props = defineProps<{
  // FormItemLayout props
  title?: string
  required?: boolean
  tooltip?: string
  labelWidth?: string
  layout?: 'inline' | 'vertical'
  labelAlign?: 'left' | 'right'
  // Select specific props
  value?: string | number
  onChange?: (value: string | number) => void
  placeholder?: string
  options?: Option[]
  multiple?: boolean
  clearable?: boolean
  filterable?: boolean
  allowCreate?: boolean
  disabled?: boolean
}>()
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
    <ElSelect
      :placeholder="props.placeholder"
      :model-value="props.value"
      :multiple="props.multiple"
      :clearable="props.clearable"
      :filterable="props.filterable"
      :allow-create="props.allowCreate"
      :disabled="props.disabled"
      @update:model-value="props.onChange"
    >
      <ElOption
        v-for="option in props.options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </ElSelect>
  </FormItemLayout>
</template>
