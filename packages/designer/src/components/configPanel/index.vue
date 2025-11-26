<script setup lang="ts">
import type { FormilyComponent } from '@formily-djd/component'
import type { Form as FormilyForm } from '@formily/core'
import type { ISchema } from '@formily/vue'
import { ArrayItems, Checkbox, FormItem, Input, InputNumber, Radio, Space, Switch } from '@formily/element-plus'
import { createSchemaField, FormProvider } from '@formily/vue'
import { computed, ref, shallowRef, watch } from 'vue'
import { useDesignStore } from '@/core/useDesignStore'
import { CompatSelect } from './CompatSelect'
import { createConfigForm } from './configForm'
import ReactionsEditor from './ReactionsEditor.vue'

const props = defineProps<{
  components: Record<string, FormilyComponent>
}>()

// 获取设计器状态
const store = useDesignStore()

// 创建 SchemaField
const { SchemaField } = createSchemaField({
  components: {
    FormItem,
    Input,
    InputNumber,
    Checkbox,
    Radio,
    Switch,
    Select: CompatSelect,
    Space,
    ArrayItems,
  },
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

  const basicSetter = componentSetterSchema.value.basicSetter
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

  const componentSetter = componentSetterSchema.value.componentSetter
  if (!componentSetter || !componentSetter.properties || Object.keys(componentSetter.properties).length === 0)
    return null

  return componentSetter
})

// 合并后的完整 Setter Schema（基础配置 + 组件配置）
const fullSetterSchema = computed(() => {
  if (!componentSetterSchema.value)
    return null

  const basic = componentSetterSchema.value.basicSetter || {}
  const component = componentSetterSchema.value.componentSetter?.properties || {}

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
const activeCollapse = shallowRef(['base', 'operate', 'component'])

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

      <FormProvider v-if="configForm" :key="formKey" :form="configForm">
        <!-- 折叠面板 -->
        <ElCollapse v-model="activeCollapse" class="config-section">
          <!-- 基础配置区域 -->
          <ElCollapseItem v-if="basicSetterSchema" name="base" title="基本配置">
            <SchemaField :schema="basicSetterSchema" />
          </ElCollapseItem>

          <ElCollapseItem name="operate" title="操作配置">
            <div>
              <ElButton type="primary" @click="openReactionsEditor">
                条件渲染
              </ElButton>
            </div>
          </ElCollapseItem>

          <!-- 组件配置区域 -->
          <ElCollapseItem v-if="componentConfigSchema" name="component" title="组件配置">
            <SchemaField :schema="componentConfigSchema" />
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
