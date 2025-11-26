<script setup lang="ts">
import FormItemLayout from '../common/FormItemLayout.vue'
import { useFormContainerInherit } from '../common/useFormContainerInherit'

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
  layout?: 'inline' | 'vertical' | 'inherit'
  labelAlign?: 'left' | 'right' | 'inherit'
  // Input specific props
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  maxlength?: string | number
  showWordLimit?: boolean
  clearable?: boolean
  prefixIcon?: string
  suffixIcon?: string
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
    :label-width="inheritedProps.labelWidth"
    :layout="inheritedProps.layout"
    :label-align="inheritedProps.labelAlign"
  >
    <ElInput
      :placeholder="props.placeholder"
      :maxlength="props.maxlength"
      :show-word-limit="props.showWordLimit"
      :clearable="props.clearable"
      :prefix-icon="props.prefixIcon"
      :suffix-icon="props.suffixIcon"
      :disabled="inheritedProps.disabled"
      :readonly="props.readonly"
      :size="inheritedProps.size"
      :model-value="props.value"
      @update:model-value="props.onChange"
    />
  </FormItemLayout>
</template>

<style scoped>
/* 组件特定样式可以在这里添加 */
</style>
