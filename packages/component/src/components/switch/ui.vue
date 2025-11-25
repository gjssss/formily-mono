<script setup lang="ts">
import FormItemLayout from '../common/FormItemLayout.vue'

defineOptions({
  name: 'SwitchComponent',
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
  // Switch specific props
  value?: boolean
  onChange?: (value: boolean) => void
  activeText?: string
  inactiveText?: string
  activeValue?: any
  inactiveValue?: any
  inlinePrompt?: boolean
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
    <ElSwitch
      :model-value="props.value"
      :active-text="props.activeText"
      :inactive-text="props.inactiveText"
      :active-value="props.activeValue"
      :inactive-value="props.inactiveValue"
      :inline-prompt="props.inlinePrompt"
      :disabled="props.disabled"
      @update:model-value="props.onChange"
    />
  </FormItemLayout>
</template>
