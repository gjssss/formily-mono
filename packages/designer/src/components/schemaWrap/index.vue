<script setup lang="ts">
import type { ISchema } from '@formily/vue'
import { getByPath, SchemaStateMap } from '@formily-djd/utils'
import { useField } from '@formily/vue'
import { computed } from 'vue'

const props = defineProps<{
  setterSchema: ISchema
}>()

const field = useField()

const bindProps = computed(() => {
  const bindProps: Record<string, any> = {}

  for (const [key, value] of Object.entries(props.setterSchema.properties || {})) {
    bindProps[key] = getByPath(field.value, value['x-path'], { transformKey: (key) => {
      if (key in SchemaStateMap)
        return SchemaStateMap[key as keyof typeof SchemaStateMap]
      return key
    } })
  }
  return bindProps
})
</script>

<template>
  <slot v-bind="bindProps" />
</template>

<style>

</style>
