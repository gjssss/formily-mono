<script setup lang="ts">
import FormItemLayout from '../common/FormItemLayout.vue'

defineOptions({
  name: 'InputComponent',
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
  // Input specific props
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  maxlength?: string | number
  showWordLimit?: boolean
  clearable?: boolean
  prefixIcon?: string
  suffixIcon?: string
  disabled?: boolean
  readonly?: boolean
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
    <ElInput
      :placeholder="props.placeholder"
      :maxlength="props.maxlength"
      :show-word-limit="props.showWordLimit"
      :clearable="props.clearable"
      :prefix-icon="props.prefixIcon"
      :suffix-icon="props.suffixIcon"
      :disabled="props.disabled"
      :readonly="props.readonly"
      :model-value="props.value"
      @update:model-value="props.onChange"
    />
  </FormItemLayout>
</template>

<style scoped>
/* 组件特定样式可以在这里添加 */
</style>
