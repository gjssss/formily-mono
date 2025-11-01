<script setup lang="ts">
import type { FormilyComponent } from '@formily-djd/component'
import { createForm, onFormValuesChange } from '@formily/core'
// import { CavasComp, ConfigPanel, MaterialPanel } from './index'
import { Form, FormItem, Input } from '@formily/element-plus'
import { createSchemaField } from '@formily/vue'
import { ref } from 'vue'
import fieldWrap from './fieldWrap/index.vue'

defineProps<{
  components: Record<string, FormilyComponent>
}>()

const form = createForm({
  effects() {
    onFormValuesChange((form) => {
      console.log(`表单值变化: ${JSON.stringify(form.values)}`)
    })
  },
})
const { SchemaField } = createSchemaField({
  components: {
    FormItem,
    Input,
  },
})

const activeKey = ref<string>('')
</script>

<template>
  <div>
    组件面板
    {{ activeKey || 'null' }}
    <div v-for="(component, key) in components" :key="key">
      {{ key }}
      <fieldWrap v-model:selected-key="activeKey" :field-key="key">
        <component :is="component.component" />
      </fieldWrap>
    </div>
    <div>
      属性
      <Form v-if="activeKey" :form="form">
        <SchemaField :schema="components[activeKey].setterSchema" />
      </Form>
    </div>
  </div>
</template>

<style></style>
