<script setup lang="ts">
import type { FormilyComponent } from '@formily-djd/component'
import { FormProvider, createSchemaField } from '@formily/vue'
import { FormItem, Input, InputNumber } from '@formily/element-plus'
import { computed, watch, shallowRef } from 'vue'
import type { Form as FormilyForm } from '@formily/core'
import { useDesignStore } from '../core/useDesignStore'
import { createConfigForm } from '../core/configForm'
import { schemaToSetterValues } from '../core/utils'

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
  },
})

// 配置表单实例
const configForm = shallowRef<FormilyForm | null>(null)

// 当前选中的字段
const selectedField = computed(() => store.getSelectedField())

// 获取 Setter Schema
const setterSchema = computed(() => {
  if (!selectedField.value)
    return null

  const componentDef = props.components[selectedField.value.componentName]
  return componentDef?.setterSchema
})

// 监听选中节点变化，重新创建配置表单
watch(
  () => store.selectedFieldId.value,
  () => {
    if (selectedField.value && setterSchema.value) {
      // 创建新的配置表单
      configForm.value = createConfigForm(setterSchema.value, store)
    }
    else {
      configForm.value = null
    }
  },
  { immediate: true },
)

// 监听选中字段的 schema 变化，同步到配置表单
watch(
  () => selectedField.value?.schema,
  (newSchema) => {
    if (configForm.value && newSchema && setterSchema.value) {
      // 将 Schema 转换为配置表单值并设置
      const newValues = schemaToSetterValues(newSchema, setterSchema.value)
      configForm.value.setValues(newValues)
      console.log('字段 Schema 变化，同步配置表单值:', newValues)
    }
  },
  { deep: true },
)
</script>

<template>
  <div class="config-panel">
    <div v-if="!selectedField">
      <p>请选择一个字段</p>
    </div>

    <div v-else>
      <h3>{{ selectedField.componentName }} 配置</h3>

      <FormProvider v-if="configForm" :form="configForm">
        <SchemaField :schema="setterSchema" />
      </FormProvider>
    </div>
  </div>
</template>
