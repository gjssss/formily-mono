<script setup lang="ts">
import type { FormilyComponent } from '@formily-djd/component'
import { createForm } from '@formily/core'
import { createSchemaField, FormProvider, useField, useFieldSchema } from '@formily/vue'
import { defineComponent, h, watch } from 'vue'
import { useDesignStore } from '../core/useDesignStore'

const props = defineProps<{
  components: Record<string, FormilyComponent>
}>()

// 获取设计器状态
const store = useDesignStore()

// 创建渲染表单
const renderForm = createForm()

// 创建自定义 FormItem，用于处理字段选中
const DesignFormItem = defineComponent({
  name: 'DesignFormItem',
  setup(_props, { slots }) {
    const field = useField()
    const fieldSchema = useFieldSchema()

    const handleClick = (e: MouseEvent) => {
      e.stopPropagation()
      // 选中当前字段（使用字段的 name）
      const fieldName = field.value?.path?.toString() || null
      store.selectField(fieldName)
    }

    return () => {
      const fieldName = field.value?.path?.toString()
      const isSelected = fieldName === store.selectedFieldName.value

      return h(
        'div',
        {
          class: ['design-field-wrapper', { active: isSelected }],
          onClick: handleClick,
        },
        [
          // 字段标题
          fieldSchema.value?.title
            ? h('div', { class: 'field-title' }, fieldSchema.value.title as string)
            : null,
          // 字段内容
          h('div', { class: 'field-content' }, slots.default?.()),
        ],
      )
    }
  },
})

// 创建 SchemaField，注册所有渲染组件 + 自定义 FormItem
const { SchemaField } = createSchemaField({
  components: {
    ...Object.entries(props.components).reduce(
      (acc, [key, def]) => {
        acc[key] = def.component
        return acc
      },
      {} as Record<string, any>,
    ),
    FormItem: DesignFormItem, // 使用自定义 FormItem
  },
})
const schema = {
  type: 'object',
  properties: {
    username: {
      'type': 'string',
      'title': '用户名',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入用户名',
        maxlength: 200,
      },
    },
  },
}

watch(store.formSchema, (newSchema) => {
  console.log('formSchema changed', newSchema)
}, { deep: true })
</script>

<template>
  <div class="canvas">
    <h3>画布</h3>

    <div class="canvas-content">
      <FormProvider :form="renderForm">
        <SchemaField :schema="schema" />
      </FormProvider>
    </div>
  </div>
</template>

<style scoped>
.canvas {
  height: 100%;
}

.canvas-content {
  padding: 16px;
}

:deep(.design-field-wrapper) {
  padding: 12px;
  margin: 8px 0;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

:deep(.design-field-wrapper:hover) {
  border-color: #c0c4cc;
  background-color: #fafafa;
}

:deep(.design-field-wrapper.active) {
  border-color: #409eff;
  background-color: #ecf5ff;
}

:deep(.field-title) {
  font-size: 12px;
  color: #606266;
  margin-bottom: 4px;
  font-weight: 500;
}
</style>
