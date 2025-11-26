import type { VNode } from 'vue'
import { PreviewText } from '@formily/element-plus'
import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { ElOption, ElSelect } from 'element-plus'
import { defineComponent, h } from 'vue'

/**
 * 兼容 Vue 3.5 对 slot 调用的严格校验。
 * 只在 render 函数内执行 slot，避免「Slot invoked outside of render」警告。
 */
const BaseSelect = defineComponent({
  name: 'CompatSelect',
  props: {
    options: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { slots, attrs }) {
    const renderOptions = (): VNode[] | VNode | undefined => {
      if (props.options && props.options.length) {
        return props.options.map((option: any) => {
          if (typeof option === 'string') {
            return h(ElOption, { key: option, value: option, label: option })
          }
          return h(ElOption, { key: option?.value ?? option?.label, ...option })
        })
      }
      return slots.default?.()
    }

    return () =>
      h(
        ElSelect,
        {
          ...attrs,
        },
        {
          default: renderOptions,
        },
      )
  },
})

export const CompatSelect = connect(
  BaseSelect,
  // 对齐 @formily/element-plus 的默认映射：value -> modelValue，dataSource -> options，readOnly -> readonly
  mapProps({ value: 'modelValue', dataSource: 'options', readOnly: 'readonly', loading: true }),
  mapReadPretty(PreviewText.Select),
)

export default CompatSelect
