import type { FormilyComponent } from 'dist/index.mjs'
import { defineComponent, h } from 'vue'
import Comp from './index.vue'

export function wrapper(comp: FormilyComponent): FormilyComponent {
  return {
    component: defineComponent({
      name: 'FormilyWrapper',
      setup() {
        return () => h(Comp, {
          setterSchema: comp.setterSchema,
        }, {
          default: (props: Record<string, any>) => h(comp.component, props),
        })
      },
    }),
    setterSchema: comp.setterSchema,
  }
}
