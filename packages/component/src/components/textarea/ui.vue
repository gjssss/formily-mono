<script setup lang="ts">
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
  // TextArea specific props
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  rows?: number
  maxlength?: string | number
  showWordLimit?: boolean
  autosize?: boolean | { minRows?: number, maxRows?: number }
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
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
    <ElInput
      type="textarea"
      :placeholder="props.placeholder"
      :rows="props.rows"
      :maxlength="props.maxlength"
      :show-word-limit="props.showWordLimit"
      :autosize="props.autosize"
      :resize="props.resize"
      :disabled="inheritedProps.disabled"
      :readonly="props.readonly"
      :size="inheritedProps.size"
      :model-value="props.value"
      @update:model-value="props.onChange"
    />
  </FormItemLayout>
</template>
