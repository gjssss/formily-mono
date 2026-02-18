<script setup lang="ts">
import type { FormilyComponent } from '@formily-djd/component'
import type { Form as FormilyForm } from '@formily/core'
import type { ISchema } from '@formily/vue'
import type { Component } from 'vue'
import { createSchemaField, FormProvider } from '@formily/vue'
import { computed, inject, ref, shallowRef, watch } from 'vue'
import { DesignerAdapterKey } from '@/core/adapter'
import { useDesignStore } from '@/core/useDesignStore'
import { createConfigForm } from './configForm'
import ReactionsEditor from './reactionsEditor'

const props = defineProps<{
  components: Record<string, FormilyComponent>
}>()

const requiredSetterKeys = [
  'FormItem',
  'Input',
  'InputNumber',
  'Checkbox',
  'Radio',
  'Switch',
  'Select',
  'Space',
  'ArrayItems',
] as const

// 获取设计器状态
const store = useDesignStore()
const adapter = inject(DesignerAdapterKey, null)
const hasSetterAdapter = computed(() =>
  requiredSetterKeys.every(key => Boolean(adapter?.setterComponents?.[key])),
)
const schemaFieldComponent = computed<Component | null>(() => {
  if (!hasSetterAdapter.value)
    return null
  const setterComponents = adapter?.setterComponents
  if (!setterComponents)
    return null

  const { SchemaField } = createSchemaField({
    components: setterComponents as Record<string, Component>,
  })
  return SchemaField
})

// 配置表单实例
const configForm = shallowRef<FormilyForm | null>(null)

// 当前选中的字段
const selectedField = computed(() => store.getSelectedField())

// 获取组件名称
const componentName = computed(() => {
  if (!selectedField.value)
    return null
  return selectedField.value['x-component'] as string
})

// 获取组件的 Setter Schema
const componentSetterSchema = computed(() => {
  const name = componentName.value
  if (!name)
    return null

  const componentDef = props.components[name]
  return componentDef?.setterSchema
})

// 获取 basicSetter Schema
const basicSetterSchema = computed(() => {
  if (!componentSetterSchema.value)
    return null

  const basicSetter = (componentSetterSchema.value as any).basicSetter
  if (!basicSetter || Object.keys(basicSetter).length === 0)
    return null

  return {
    type: 'object',
    properties: basicSetter,
  } as ISchema
})

// 获取组件特定配置 Schema
const componentConfigSchema = computed(() => {
  if (!componentSetterSchema.value)
    return null

  const componentSetter = (componentSetterSchema.value as any).componentSetter
  if (!componentSetter || !componentSetter.properties || Object.keys(componentSetter.properties).length === 0)
    return null

  return componentSetter
})

// 合并后的完整 Setter Schema（基础配置 + 组件配置）
const fullSetterSchema = computed(() => {
  if (!componentSetterSchema.value)
    return null

  const basic = (componentSetterSchema.value as any).basicSetter || {}
  const component = (componentSetterSchema.value as any).componentSetter?.properties || {}

  return {
    type: 'object',
    properties: {
      ...basic,
      ...component,
    },
  } as ISchema
})

// 监听选中节点变化，重新创建配置表单
watch(
  () => store.selectedFieldName.value,
  () => {
    if (selectedField.value && fullSetterSchema.value) {
      configForm.value = createConfigForm(fullSetterSchema.value, store)
    }
    else {
      configForm.value = null
    }
  },
  { immediate: true },
)

// 折叠面板激活项（默认展开）
const activeCollapse = shallowRef(['base', 'component'])

// 用于强制重新渲染 SchemaField
const formKey = computed(() => store.selectedFieldName.value || 'empty')

// ReactionsEditor 弹窗控制
const reactionsDialogVisible = ref(false)

// 打开条件渲染编辑器
function openReactionsEditor() {
  reactionsDialogVisible.value = true
}

// 保存 x-reactions 配置
function handleSaveReactions(reactions: any) {
  const fieldName = store.selectedFieldName.value
  if (!fieldName)
    return

  const currentField = store.getSelectedField()
  if (!currentField)
    return

  // 更新 schema 中的 x-reactions
  const newSchema = {
    ...currentField,
    'x-reactions': Object.keys(reactions).length > 0 ? reactions : undefined,
  }

  store.updateFieldSchema(fieldName, newSchema)
}
</script>

<template>
  <div class="config-panel">
    <div v-if="!selectedField" class="config-empty">
      <p>请选择一个字段</p>
    </div>

    <div v-else class="config-content">
      <h3 class="config-title">
        {{ componentName }} 配置
      </h3>

      <div class="config-operate">
        <ElButton type="primary" @click="openReactionsEditor">
          条件渲染
        </ElButton>
      </div>

      <div v-if="!hasSetterAdapter" class="config-adapter-guide">
        <ElAlert
          title="未配置 Setter 适配器"
          type="warning"
          :closable="false"
          show-icon
          description="当前 Designer 未注入 adapter，无法编辑基础配置和组件配置。"
        />
        <p class="guide-title">
          接入示例：
        </p>
        <pre class="guide-code"><code>import { elementPlusAdapter } from '@formily-djd/designer/element-plus'

&lt;Designer :adapter="elementPlusAdapter" ... /&gt;</code></pre>
      </div>

      <FormProvider v-else-if="configForm && schemaFieldComponent" :key="formKey" :form="configForm">
        <!-- 折叠面板 -->
        <ElCollapse v-model="activeCollapse" class="config-section">
          <!-- 基础配置区域 -->
          <ElCollapseItem v-if="basicSetterSchema" name="base" title="基本配置">
            <component :is="schemaFieldComponent" :schema="basicSetterSchema" />
          </ElCollapseItem>

          <!-- 组件配置区域 -->
          <ElCollapseItem v-if="componentConfigSchema" name="component" title="组件配置">
            <component :is="schemaFieldComponent" :schema="componentConfigSchema" />
          </ElCollapseItem>
        </ElCollapse>
      </FormProvider>

      <!-- ReactionsEditor 弹窗 -->
      <ReactionsEditor
        v-model="reactionsDialogVisible"
        :schema="store.formSchema.value"
        :current-field-name="store.selectedFieldName.value"
        :initial-reactions="selectedField?.['x-reactions']"
        @save="handleSaveReactions"
      />
    </div>
  </div>
</template>

<style scoped>
.config-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.config-empty {
  padding: 20px;
  text-align: center;
  color: #909399;
}

.config-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.config-title {
  margin: 0;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #ebeef5;
  background-color: #fff;
  flex-shrink: 0;
}

.config-operate {
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  background-color: #fff;
}

.config-adapter-guide {
  padding: 12px 16px;
  overflow-y: auto;
  background-color: #fff;
}

.guide-title {
  margin: 12px 0 8px;
  font-weight: 600;
  color: #303133;
}

.guide-code {
  margin: 0;
  padding: 10px 12px;
  background-color: #f5f7fa;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.5;
  color: #606266;
  white-space: pre-wrap;
}

.config-section {
  background-color: #fff;
  flex: 1;
  overflow-y: auto;
  border: none;
  padding: 0 16px;
}

.config-section :deep(.el-collapse-item__header) {
  font-weight: 600;
}

.config-section :deep(.el-form-item) {
  margin-bottom: 18px;
}
</style>
