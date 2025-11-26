<script setup lang="ts">
import { computed, provide } from 'vue'
import { formContainerKey } from '@/shared/symbol'

defineOptions({
  name: 'FormContainer',
})

const props = defineProps<{
  title?: string
  disabled?: boolean
  layout?: 'horizontal' | 'vertical' | 'inline'
  labelWidth?: string
  labelAlign?: 'left' | 'right' | 'top'
  size?: 'large' | 'default' | 'small'
}>()

// 提供容器级别的配置给子组件
provide(formContainerKey, computed(() => ({
  disabled: props.disabled,
  layout: props.layout,
  labelWidth: props.labelWidth,
  labelAlign: props.labelAlign,
  size: props.size,
})))
</script>

<template>
  <slot />
</template>
