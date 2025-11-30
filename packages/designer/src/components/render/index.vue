<script setup lang="ts">
import type { FormilyComponent } from '@formily-djd/component'
import type { ISchema } from '@formily/vue'
import type { Component } from 'vue'
import { createForm } from '@formily/core'
import { createSchemaField, FormProvider } from '@formily/vue'
import { schemaWrapper } from '../schemaWrap'

const props = defineProps<{
  values?: Record<string, any>
  schema: ISchema
  components: Record<string, FormilyComponent>
}>()

const form = createForm({
  values: props.values ?? {},
})

const { SchemaField } = createSchemaField({
  components: Object.keys(props.components).reduce((acc, key) => {
    acc[key] = schemaWrapper(props.components[key])
    return acc
  }, {} as Record<string, Component>),
})

// 暴露 form 实例给父组件
defineExpose({
  form,
})
</script>

<template>
  <FormProvider :form="form">
    <SchemaField :schema="schema" />
  </FormProvider>
</template>

<style></style>
