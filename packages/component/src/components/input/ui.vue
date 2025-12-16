<script setup lang="ts">
import type { FormilyPattern } from '@/types'
import { computed } from 'vue'
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
  pattern?: FormilyPattern
  // Input specific props
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  maxlength?: string | number
  showWordLimit?: boolean
  clearable?: boolean
  prefixIcon?: string
  suffixIcon?: string
  prefix?: string
  suffix?: string
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
      :placeholder="props.placeholder"
      :maxlength="props.maxlength"
      :show-word-limit="props.showWordLimit"
      :clearable="props.clearable"
      :prefix-icon="props.prefixIcon"
      :suffix-icon="props.suffixIcon"
      :disabled="patternState.disabled"
      :readonly="patternState.readonly"
      :size="inheritedProps.size"
      :model-value="props.value"
      @update:model-value="props.onChange"
    >
      <template v-if="props.prefix" #prepend>
        {{ props.prefix }}
      </template>
      <template v-if="props.suffix" #append>
        {{ props.suffix }}
      </template>
    </ElInput>
  </FormItemLayout>
</template>

<style scoped>
/* 组件特定样式可以在这里添加 */
</style>
