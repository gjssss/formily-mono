<script setup lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElTooltip } from 'element-plus'
import { computed } from 'vue'

defineOptions({
  name: 'FormItemLayout',
  inheritAttrs: false,
})

const props = defineProps<{
  title?: string
  required?: boolean
  tooltip?: string
  labelWidth?: string | 'inherit'
  layout?: 'inline' | 'vertical' | 'inherit'
  labelAlign?: 'left' | 'right' | 'inherit'
}>()

const layoutClass = computed(() => {
  return `formily-form-item--${props.layout}`
})

const labelStyle = computed(() => {
  return {
    width: props.labelWidth,
    textAlign: props.labelAlign,
  }
})
</script>

<template>
  <div class="formily-form-item" :class="layoutClass">
    <div v-if="props.title" class="formily-form-item__label" :style="labelStyle">
      <span v-if="props.required" class="formily-form-item__required">*</span>
      <span class="formily-form-item__label-text">{{ props.title }}</span>
      <ElTooltip v-if="props.tooltip" :content="props.tooltip" placement="top" effect="dark">
        <el-icon class="formily-form-item__tooltip">
          <QuestionFilled />
        </el-icon>
      </ElTooltip>
    </div>
    <div class="formily-form-item__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.formily-form-item {
  display: flex;
  width: 100%;
  box-sizing: border-box;
}

/* Inline 布局 */
.formily-form-item--inline {
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

/* Vertical 布局 */
.formily-form-item--vertical {
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

/* Label 样式 */
.formily-form-item__label {
  color: var(--el-text-color-regular);
  font-size: 14px;
  line-height: 32px;
  white-space: nowrap;
  flex-shrink: 0;
}

.formily-form-item--inline .formily-form-item__label {
  min-width: 80px;
}

.formily-form-item--vertical .formily-form-item__label {
  text-align: left;
  line-height: 24px;
}

/* 必填标记 */
.formily-form-item__required {
  color: var(--el-color-danger);
  margin-right: 4px;
}

/* Label 文本 */
.formily-form-item__label-text {
  flex-shrink: 0;
}

/* Tooltip 图标 */
.formily-form-item__tooltip {
  color: var(--el-text-color-secondary);
  cursor: help;
  font-size: 14px;
  flex-shrink: 0;
}

.formily-form-item__tooltip:hover {
  color: var(--el-color-primary);
}

/* Content 区域 */
.formily-form-item__content {
  flex: 1;
  min-width: 0;
}

.formily-form-item--vertical .formily-form-item__content {
  width: 100%;
}

/* 响应式：小屏幕自动切换为 vertical */
@media (max-width: 768px) {
  .formily-form-item--inline {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .formily-form-item--inline .formily-form-item__label {
    text-align: left;
  }
}
</style>
