<script setup lang="ts">
import type { FormilyComponent } from '@formily-djd/component'
import { createForm } from '@formily/core'
// import { CavasComp, ConfigPanel, MaterialPanel } from './index'
import { Form, Input } from '@formily/element-plus'
import { createSchemaField } from '@formily/vue'
import { ref } from 'vue'

defineProps<{
  components: Record<string, FormilyComponent>
}>()

const form = createForm()
const { SchemaField } = createSchemaField({
  components: {
    Input,
  },
})

const activeKey = ref<string | null>(null)
</script>

<template>
  <div>
    组件面板
    <div v-for="(component, key) in components" :key="key" @click="activeKey = key">
      {{ key }}
      <component :is="component.component" />
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
