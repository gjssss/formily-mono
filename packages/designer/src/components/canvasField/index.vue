<script setup lang="ts">
import type { FormilyComponent } from '@formily-djd/component'
import type { ISchema } from '@formily/json-schema'
import { computed, inject } from 'vue'
import { useDesignStore } from '@/core'
import { ComponentSettingsKey } from '@/shared'
import { buildComponentProps, shouldRecurse, shouldRenderArrayComponent } from './utils'

defineOptions({
  name: 'CanvasField',
})

const props = defineProps<{
  schema?: ISchema
  fieldName?: string
}>()

const store = useDesignStore()
const ComponentSettings = inject<Record<string, FormilyComponent>>(ComponentSettingsKey) ?? {}

const xComponent = computed(() => props.schema?.['x-component'])

function clickHandler() {
  if (!props.fieldName)
    return
  store.selectField(props.fieldName)
}
</script>

<template>
  <div v-if="props.schema" @click.stop="clickHandler">
    <!-- 处理外部有组件包裹的 object -->
    <component
      :is="ComponentSettings[xComponent].component"
      v-if="xComponent && ComponentSettings[xComponent]"
      v-bind="buildComponentProps(props.schema, ComponentSettings[xComponent].setterSchema)"
    >
      <template v-if="shouldRenderArrayComponent(props.schema)" #array>
        <CanvasField :schema="(props.schema.items as any)" />
      </template>
      <!-- 递归类型：object/void/array -->
      <template v-if="shouldRecurse(props.schema)">
        <template v-for="key in Object.keys(props.schema?.properties || {})" :key="key">
          <CanvasField :schema="(props.schema?.properties as any)?.[key]" :field-name="key" />
        </template>
      </template>
      <!-- 递归类型：object/void/array -->
    </component>
    <!-- 处理没有组件包裹的 object -->

    <!-- 没有组件包裹的只能是 void/object 类型 -->
    <template v-else>
      <template v-for="key in Object.keys(props.schema?.properties || {})" :key="key">
        <CanvasField :schema="(props.schema?.properties as any)?.[key]" :field-name="key" />
      </template>
    </template>
    <!-- 没有组件包裹的只能是 void/object 类型 -->
  </div>
</template>
