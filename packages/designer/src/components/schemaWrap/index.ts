import type { FormilyComponent } from '@formily-djd/component'
import type { ArrayField } from '@formily/core'
import type { Component } from 'vue'
import { getByPath, SchemaStateMap } from '@formily-djd/utils'
import { RecursionField, useField, useFieldSchema } from '@formily/vue'
import { computed, defineComponent, h, inject } from 'vue'
import { ArrayFieldKey, ArrayItemKey } from '@/shared'
import ArrayInner from './arrayInner.vue'
import ArrayItemInner from './arrayItemInner.vue'

export function schemaWrapper(comp: FormilyComponent): Component {
  return defineComponent({
    name: 'SchemaWrapper',
    setup(props: any, context) {
      const { setterSchema } = comp
      const field = useField()
      const schema = useFieldSchema()
      const arrayField = inject<ArrayField | undefined>(ArrayFieldKey, undefined)
      const arrayItemIndex = inject<{ index?: number } | undefined>(ArrayItemKey, undefined)
      // console.log('field', field.value)

      const bindProps = computed(() => {
        const bindProps: Record<string, any> = {
          value: props.value,
          onChange: props.onChange,
        }

        for (const [key, value] of Object.entries(setterSchema.properties || {})) {
          bindProps[key] = getByPath(schema.value, value['x-path'], { transformKey: (key) => {
            if (key in SchemaStateMap)
              return SchemaStateMap[key as keyof typeof SchemaStateMap]
            return key
          } })
        }

        const arrayFieldValue = schema.value?.type === 'array'
          ? field.value as ArrayField
          : arrayField?.value as unknown as ArrayField

        if (arrayFieldValue) {
          bindProps.onAdd = () => arrayFieldValue.push({})
        }

        if (arrayItemIndex?.index !== undefined) {
          bindProps.arrayIndex = arrayItemIndex.index
        }

        return bindProps
      })

      return () => {
        if (schema.value?.type === 'array') {
          const arrayField = field.value as ArrayField
          const items = arrayField?.value || []

          const renderItems = items.length > 0
            ? items.map((_item, index) =>
                h(ArrayItemInner, {
                  index,
                }, {
                  default: () => h(RecursionField, {
                    key: index,
                    schema: schema.value.items,
                    name: index,
                  }),
                }),
              )
            : null

          return h(ArrayInner, {}, {
            default: () => h(comp.component, bindProps.value, {
              default: () => renderItems,
            }),
          })
        }
        // 关键：传递 context.slots，让 ObjectField 生成的 properties slots 能够渲染
        return h(comp.component, bindProps.value, context.slots)
      }
    },
  })
}
