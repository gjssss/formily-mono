<script setup lang="ts">
import type { FormilyComponent } from '@formily-djd/component'
import type { ISchema } from '@formily/json-schema'
import { computed, inject } from 'vue'
import { useDesignStore } from '@/core'
import { ComponentSettingsKey } from '@/shared'
import { buildComponentProps, shouldRecurse } from './utils'

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
    <component
      :is="ComponentSettings[xComponent].component"
      v-if="xComponent && ComponentSettings[xComponent]"
      v-bind="buildComponentProps(props.schema, ComponentSettings[xComponent].setterSchema)"
    >
      <template v-if="shouldRecurse(props.schema)">
        <template v-for="key in Object.keys(props.schema?.properties || {})" :key="key">
          <CanvasField :schema="(props.schema?.properties as any)?.[key]" :field-name="key" />
        </template>
      </template>
    </component>
    <template v-else>
      <template v-for="key in Object.keys(props.schema?.properties || {})" :key="key">
        <CanvasField :schema="(props.schema?.properties as any)?.[key]" :field-name="key" />
      </template>
    </template>
  </div>
</template>
