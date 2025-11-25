<script setup lang="ts">
import FormItemLayout from '../common/FormItemLayout.vue'

defineOptions({
  name: 'RadioComponent',
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
  // Radio specific props
  value?: string | number
  onChange?: (value: string | number | boolean | undefined) => void
  options?: Option[]
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
    <ElRadioGroup
      :model-value="props.value"
      :disabled="props.disabled"
      @update:model-value="(value) => props.onChange?.(value)"
    >
      <ElRadio
        v-for="option in props.options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </ElRadio>
    </ElRadioGroup>
  </FormItemLayout>
</template>
