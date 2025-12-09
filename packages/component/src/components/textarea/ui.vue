<script setup lang="ts">
import type { FormilyPattern } from '@/types'
import { computed } from 'vue'
import FormItemLayout from '../common/FormItemLayout.vue'
import { useFormContainerInherit } from '../common/useFormContainerInherit'

defineOptions({
  name: 'TextAreaComponent',
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
  // TextArea specific props
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  rows?: number
  maxlength?: string | number
  showWordLimit?: boolean
  clearable?: boolean
  autosize?: boolean | { minRows?: number, maxRows?: number }
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
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
    <ElInput
      type="textarea"
      :placeholder="props.placeholder"
      :rows="props.rows"
      :maxlength="props.maxlength"
      :show-word-limit="props.showWordLimit"
      :clearable="props.clearable"
      :autosize="props.autosize"
      :resize="props.resize"
      :disabled="patternState.disabled"
      :readonly="patternState.readonly"
      :size="inheritedProps.size"
      :model-value="props.value"
      @update:model-value="props.onChange"
    />
  </FormItemLayout>
</template>
