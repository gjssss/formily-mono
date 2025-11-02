<script setup lang="ts">
import type { FormilyComponent } from '@formily-djd/component'
import { createForm } from '@formily/core'
import { createSchemaField, FormProvider } from '@formily/vue'
import { computed } from 'vue'
import { useDesignStore } from '../core/useDesignStore'

const props = defineProps<{
  components: Record<string, FormilyComponent>
}>()

// 获取设计器状态
const store = useDesignStore()

// 创建渲染表单
const renderForm = createForm()

// 创建 SchemaField，注册所有渲染组件
const { SchemaField } = createSchemaField({
  components: Object.entries(props.components).reduce(
    (acc, [key, def]) => {
      acc[key] = def.component
      return acc
    },
    {} as Record<string, any>,
  ),
})

// 所有字段
const fields = computed(() => Object.values(store.fields.value))

// 处理字段点击
function handleFieldClick(fieldId: string) {
  store.selectField(fieldId)
  console.log('选中字段:', fieldId)
}
</script>

<template>
  <div class="canvas">
    <h3>画布</h3>

    <div class="canvas-content">
      <FormProvider :form="renderForm">
        <div
          v-for="field in fields"
          :key="field.id"
          class="field-wrapper"
          :class="{ active: store.selectedFieldId.value === field.id }"
          @click="handleFieldClick(field.id)"
        >
          <!-- 使用 SchemaField 渲染单个字段 -->
          <SchemaField
            :name="field.name"
            :schema="field.schema"
          />
        </div>
      </FormProvider>
    </div>
  </div>
</template>

<style scoped>
.field-wrapper {
  padding: 8px;
  margin: 4px 0;
  border: 2px solid transparent;
  cursor: pointer;
}

.field-wrapper.active {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.field-wrapper:hover {
  border-color: #c0c4cc;
}
</style>
