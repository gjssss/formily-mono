<script setup lang="ts">
import type { FormilyPattern } from '@/types'
import { computed } from 'vue'
import FormItemLayout from '../common/FormItemLayout.vue'
import { useFormContainerInherit } from '../common/useFormContainerInherit'

defineOptions({
  name: 'SelectComponent',
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
  // Select specific props
  value?: string | number
  onChange?: (value: string | number) => void
  placeholder?: string
  options?: Option[]
  multiple?: boolean
  clearable?: boolean
  filterable?: boolean
  allowCreate?: boolean
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
    <ElSelect
      :placeholder="props.placeholder"
      :model-value="props.value"
      :multiple="props.multiple"
      :clearable="props.clearable"
      :filterable="props.filterable"
      :allow-create="props.allowCreate"
      :disabled="patternState.disabled || patternState.readonly"
      :size="inheritedProps.size"
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
