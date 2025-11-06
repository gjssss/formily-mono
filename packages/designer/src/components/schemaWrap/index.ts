import type { FormilyComponent } from '@formily-djd/component'
import type { Component } from 'vue'
import { getByPath, SchemaStateMap } from '@formily-djd/utils'
import { useField, useFieldSchema } from '@formily/vue'
import { computed, defineComponent, h } from 'vue'
import ArrayComponent from './array.vue'

export function schemaWrapper(comp: FormilyComponent): Component {
  return defineComponent({
    name: 'SchemaWrapper',
    setup() {
      const { setterSchema } = comp
      // const field = useField()
      const schema = useFieldSchema()
      // console.log('field', field.value)

      const bindProps = computed(() => {
        const bindProps: Record<string, any> = {}

        for (const [key, value] of Object.entries(setterSchema.properties || {})) {
          bindProps[key] = getByPath(schema.value, value['x-path'], { transformKey: (key) => {
            if (key in SchemaStateMap)
              return SchemaStateMap[key as keyof typeof SchemaStateMap]
            return key
          } })
        }
        return bindProps
      })

      return () => {
        if (schema.value?.type === 'array') {
          const renderArrayContent = h(ArrayComponent, {
            items: schema.value?.items,
          })
          return h(comp.component, bindProps.value, {
            array: () => renderArrayContent,
          })
        }
        return h(comp.component, bindProps.value)
      }
    },
  })
}
