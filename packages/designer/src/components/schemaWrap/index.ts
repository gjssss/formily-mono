import type { FormilyComponent } from '@formily-djd/component'
import type { ArrayField } from '@formily/core'
import type { Component } from 'vue'
import { getByPath } from '@formily-djd/utils'
import { isVoidField } from '@formily/core'
import { observer } from '@formily/reactive-vue'
import { RecursionField, useField, useFieldSchema } from '@formily/vue'
import { computed, defineComponent, h, inject } from 'vue'
import { ArrayFieldKey, ArrayItemKey } from '@/shared'
import ArrayInner from './arrayInner.vue'
import ArrayItemInner from './arrayItemInner.vue'
import { useKey } from './composable'

export function schemaWrapper(comp: FormilyComponent): Component {
  return observer(
    defineComponent({
      name: 'SchemaWrapper',
      props: {
        value: {
          type: [String, Number, Boolean, Array, Object],
          default: undefined,
        },
        onChange: {
          type: Function,
          default: undefined,
        },
      },
      setup(props: any, context) {
        const { setterSchema } = comp
        const field = useField()
        const schema = useFieldSchema()
        const arrayField = inject<ArrayField | undefined>(ArrayFieldKey, undefined)
        const arrayItemIndex = inject<{ index?: number } | undefined>(ArrayItemKey, undefined)

        const { getKey } = useKey(schema.value)

        const bindProps = computed(() => {
          const currentField = field.value
          const _bindProps: Record<string, any> = {
            value: props.value,
            onChange: props.onChange,
          }

          // 映射 field 的状态到组件 props（支持 x-reactions 的状态控制）
          if (currentField && !isVoidField(currentField)) {
            // 处理 pattern 模式：disabled, readOnly, readPretty
            if (currentField.pattern === 'disabled' || currentField.pattern === 'readPretty') {
              _bindProps.disabled = true
            }
            if (currentField.pattern === 'readOnly') {
              _bindProps.readOnly = true
            }

            // 直接映射状态属性
            if (currentField.disabled !== undefined) {
              _bindProps.disabled = currentField.disabled
            }
            if (currentField.readOnly !== undefined) {
              _bindProps.readOnly = currentField.readOnly
            }
          }

          // 映射 setterSchema 中的属性（包含 basicSetter 和组件特定配置）
          // 遍历 basicSetter
          if (setterSchema.basicSetter) {
            for (const [key, value] of Object.entries(setterSchema.basicSetter)) {
              const path = value['x-path']
              if (path) {
                _bindProps[key] = getByPath(schema.value, path)
              }
            }
          }
          // 遍历 componentSetter
          if (setterSchema.componentSetter?.properties) {
            for (const [key, value] of Object.entries(setterSchema.componentSetter.properties)) {
              const path = value['x-path']
              if (path) {
                _bindProps[key] = getByPath(schema.value, path)
              }
            }
          }

          const arrayFieldValue = schema.value?.type === 'array'
            ? field.value as ArrayField
            : arrayField?.value as unknown as ArrayField

          if (arrayFieldValue) {
            // 添加到末尾
            _bindProps.onAdd = () => arrayFieldValue.push({})
            _bindProps.onPush = () => arrayFieldValue.push({})

            // 添加到开头
            _bindProps.onUnshift = () => arrayFieldValue.unshift({})

            // 删除指定项
            _bindProps.onRemove = (index: number) => arrayFieldValue.remove(index)

            // 移动项
            _bindProps.onMove = (from: number, to: number) => arrayFieldValue.move(from, to)

            // 上移
            _bindProps.onMoveUp = (index: number) => {
              if (index > 0) {
                arrayFieldValue.move(index, index - 1)
              }
            }

            // 下移
            _bindProps.onMoveDown = (index: number) => {
              if (index < arrayFieldValue.value.length - 1) {
                arrayFieldValue.move(index, index + 1)
              }
            }

            // ArrayItem 继承父 Array 的 disabled 状态
            if (arrayItemIndex?.index !== undefined && arrayFieldValue.disabled) {
              _bindProps.disabled = arrayFieldValue.disabled
            }
          }

          if (arrayItemIndex?.index !== undefined) {
            _bindProps.arrayIndex = arrayItemIndex.index
          }

          return _bindProps
        })

        return () => {
          const currentField = field.value

          // 检查字段的显示状态 - 支持 x-reactions 的 visible 控制
          if (!currentField) {
            return h('template', {}, {})
          }

          // 如果字段不可见，返回空模板
          if (currentField.display !== 'visible') {
            return h('template', {}, {})
          }

          // 渲染验证错误信息
          const renderErrors = (): any => {
            if (!currentField || isVoidField(currentField)) {
              return null
            }

            const errors = currentField.errors || []
            if (errors.length === 0) {
              return null
            }

            return h('div', {
              class: 'formily-validation-errors',
              style: {
                color: '#f56c6c',
                fontSize: '12px',
                marginTop: '4px',
                lineHeight: '1.5',
              },
            }, h('div', {
              class: 'formily-validation-error-item',
            }, errors[0].messages))
          }

          if (schema.value?.type === 'array') {
            const arrayField = currentField as ArrayField
            const items = arrayField?.value || []

            const renderItems = items.length > 0
              ? items.map((item, index) =>
                  h(ArrayItemInner, {
                    index,
                  }, {
                    default: () => h(RecursionField, {
                      key: getKey(item, index),
                      schema: schema.value.items,
                      name: index,
                    }),
                  }),
                )
              : null

            return h('div', {}, [
              h(ArrayInner, {}, {
                default: () => h(comp.component, bindProps.value, {
                  default: () => renderItems,
                }),
              }),
              renderErrors(),
            ])
          }

          return h('div', {}, [
            h(comp.component, bindProps.value, context.slots),
            renderErrors(),
          ])
        }
      },
    }),
  )
}
