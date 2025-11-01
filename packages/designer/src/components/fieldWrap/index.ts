import type { Component, Ref } from 'vue'
import { h } from 'vue'
import FieldWrapComponent from './index.vue'

export function fieldWrap(comp: Component, fieldKey: string, selectedKey: Ref<string>): Component {
  return h(FieldWrapComponent, {
    selectedKey: selectedKey.value,
    onUpdateSelected: (value: string) => {
      selectedKey.value = value
    },
    fieldKey,
  }, {
    default: () => comp,
  })
}
