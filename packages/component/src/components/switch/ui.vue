<script setup lang="ts">
import type { FormilyPattern } from '@/types'
import { computed } from 'vue'
import FormItemLayout from '../common/FormItemLayout.vue'
import { useFormContainerInherit } from '../common/useFormContainerInherit'

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
  layout?: 'inline' | 'vertical' | 'inherit'
  labelAlign?: 'left' | 'right' | 'inherit'
  pattern?: FormilyPattern
  // Switch specific props
  value?: boolean
  onChange?: (value: boolean) => void
  activeText?: string
  inactiveText?: string
  activeValue?: any
  inactiveValue?: any
  inlinePrompt?: boolean
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
const isDisabled = computed(() => patternState.value.disabled || patternState.value.readonly)
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
    <ElSwitch
      :model-value="props.value"
      :active-text="props.activeText"
      :inactive-text="props.inactiveText"
      :active-value="props.activeValue"
      :inactive-value="props.inactiveValue"
      :inline-prompt="props.inlinePrompt"
      :disabled="isDisabled"
      :size="inheritedProps.size"
      @update:model-value="props.onChange"
    />
  </FormItemLayout>
</template>
