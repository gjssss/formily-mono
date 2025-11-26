<script setup lang="ts">
import FormItemLayout from '../common/FormItemLayout.vue'
import { useFormContainerInherit } from '../common/useFormContainerInherit'

defineOptions({
  name: 'RadioComponent',
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
  // Radio specific props
  value?: string | number
  onChange?: (value: string | number | boolean | undefined) => void
  options?: Option[]
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
    <ElRadioGroup
      :model-value="props.value"
      :disabled="inheritedProps.disabled"
      :size="inheritedProps.size"
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
