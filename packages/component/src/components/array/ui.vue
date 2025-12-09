<script setup lang="ts">
import type { FormilyPattern } from '@/types'
import { computed } from 'vue'
import { useFormContainerInherit } from '../common/useFormContainerInherit'

defineOptions({
  name: 'Array',
  inheritAttrs: false,
})

const props = defineProps<{
  title?: string
  pattern?: FormilyPattern
  onAdd?: () => void
  onPush?: () => void
  onUnshift?: () => void
}>()

const inheritedProps = useFormContainerInherit(props)

const isDisabled = computed(() => {
  const pattern = inheritedProps.value.pattern
  const patternDisabled = pattern === 'disabled'
  const patternReadonly = pattern === 'readOnly'
  return Boolean(patternDisabled || patternReadonly)
})
</script>

<template>
  <div class="formily-array">
    <div class="array-header">
      <div v-if="props.title" class="array-title">
        {{ props.title }}
      </div>
      <div class="array-actions">
        <ElButton
          type="primary"
          size="small"
          :disabled="isDisabled"
          @click="props.onAdd"
        >
          添加到末尾
        </ElButton>
        <ElButton
          size="small"
          :disabled="isDisabled"
          @click="props.onUnshift"
        >
          添加到开头
        </ElButton>
      </div>
    </div>
    <div class="array-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.formily-array {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 16px;
  background: #fafafa;
}

.array-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.array-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.array-actions {
  display: flex;
  gap: 8px;
}

.array-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
