<script setup lang="ts">
import type { FormilyPattern } from '@/types'
import { computed, provide } from 'vue'
import { formContainerKey } from '@/shared/symbol'

defineOptions({
  name: 'FormContainer',
})

const props = defineProps<{
  title?: string
  layout?: 'horizontal' | 'vertical' | 'inline'
  labelWidth?: string
  labelAlign?: 'left' | 'right' | 'top'
  size?: 'large' | 'default' | 'small'
  gap?: number
  pattern?: FormilyPattern
  layoutStyle?: 'none' | 'border' | 'border-none'
  titleStyle?: 'none' | 'center' | 'left' | 'right'
}>()

// 提供容器级别的配置给子组件
provide(formContainerKey, computed(() => ({
  layout: props.layout,
  labelWidth: props.labelWidth,
  labelAlign: props.labelAlign,
  size: props.size,
  pattern: props.pattern,
})))

const layoutStyleClass = computed(() => {
  return `formily-form-container-layout-${props.layoutStyle}`
})

const titleStyleClass = computed(() => {
  return `formily-form-container-title-${props.titleStyle}`
})
</script>

<template>
  <div>
    <div class="formily-form-container-title" :class="titleStyleClass">
      {{ props.title }}
    </div>
    <div class="formily-form-container" :class="layoutStyleClass" :style="{ gap: `${props.gap ?? 8}px` }">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.formily-form-container {
  display: flex;
  flex-direction: column;
}

.formily-form-container-title {
  font-size: 18px;
  font-weight: 400;
  margin-bottom: 8px;
}

.formily-form-container-layout-border {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 16px;
}

.formily-form-container-layout-border-none {
  border: none;
}

.formily-form-container-title-center {
  text-align: center;
}

.formily-form-container-title-left {
  text-align: left;
}

.formily-form-container-title-right {
  text-align: right;
}
</style>
