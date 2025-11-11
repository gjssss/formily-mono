<script setup lang="ts">
import type { FormilyComponent } from '@formily-djd/component'
import type { ISchema } from '@formily/json-schema'
import { computed, inject } from 'vue'
import { ComponentSettingsKey } from '@/shared'
import { buildComponentProps, shouldRecurse, shouldRenderArrayComponent } from './utils'

defineOptions({
  name: 'CanvasField',
})

const props = defineProps<{
  schema?: ISchema
  fieldName?: string
  nodePath?: string // 节点路径，用于唯一标识组件（如 "username" 或 "array.items.properties.input"）
}>()

const ComponentSettings = inject<Record<string, FormilyComponent>>(ComponentSettingsKey) ?? {}

const xComponent = computed(() => props.schema?.['x-component'])

// 当前节点的完整路径
const currentNodePath = computed(() => {
  if (!props.nodePath)
    return props.fieldName || ''
  if (!props.fieldName)
    return props.nodePath
  return props.nodePath ? `${props.nodePath}.${props.fieldName}` : props.fieldName
})

// 用于生成子节点路径的基础路径
function getChildBasePath(): string {
  if (props.schema?.type === 'array')
    return currentNodePath.value ? `${currentNodePath.value}.items` : ''
  else
    return currentNodePath.value ? `${currentNodePath.value}.properties` : ''
}
</script>

<template>
  <div v-if="props.schema" :data-node-id="currentNodePath">
    <!-- 处理外部有组件包裹的 object -->
    <component
      :is="ComponentSettings[xComponent].component" v-if="xComponent && ComponentSettings[xComponent]"
      v-bind="buildComponentProps(props.schema, ComponentSettings[xComponent].setterSchema)"
    >
      <template v-if="shouldRenderArrayComponent(props.schema)">
        <CanvasField :schema="(props.schema.items as any)" :node-path="`${getChildBasePath()}`" />
      </template>
      <!-- 递归类型：object/void/array -->
      <template v-if="shouldRecurse(props.schema)">
        <template v-for="key in Object.keys(props.schema?.properties || {})" :key="key">
          <CanvasField
            :schema="(props.schema?.properties as any)?.[key]" :field-name="key"
            :node-path="getChildBasePath()"
          />
        </template>
      </template>
      <!-- 递归类型：object/void/array -->
    </component>
    <!-- 处理没有组件包裹的 object -->

    <!-- 没有组件包裹的只能是 void/object 类型 -->
    <template v-else>
      <template v-for="key in Object.keys(props.schema?.properties || {})" :key="key">
        <CanvasField
          :schema="(props.schema?.properties as any)?.[key]" :field-name="key"
          :node-path="getChildBasePath()"
        />
      </template>
    </template>
    <!-- 没有组件包裹的只能是 void/object 类型 -->
  </div>
</template>
