import type { VNode } from 'vue'
import type { DesignerIcons } from '@/core/adapter'
import { defineComponent, h } from 'vue'

function createIcon(name: string, draw: () => VNode[]) {
  return defineComponent({
    name,
    setup() {
      return () =>
        h(
          'svg',
          {
            viewBox: '0 0 24 24',
            fill: 'none',
            xmlns: 'http://www.w3.org/2000/svg',
            width: '1em',
            height: '1em',
            stroke: 'currentColor',
            strokeWidth: 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          },
          draw(),
        )
    },
  })
}

const Search = createIcon('DesignerSearchIcon', () => [
  h('circle', { cx: 11, cy: 11, r: 7 }),
  h('path', { d: 'M20 20l-3.5-3.5' }),
])

const CirclePlus = createIcon('DesignerCirclePlusIcon', () => [
  h('circle', { cx: 12, cy: 12, r: 9 }),
  h('path', { d: 'M12 8v8' }),
  h('path', { d: 'M8 12h8' }),
])

const CopyDocument = createIcon('DesignerCopyDocumentIcon', () => [
  h('rect', { x: 9, y: 9, width: 10, height: 11, rx: 2 }),
  h('path', { d: 'M15 9V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2' }),
])

const Delete = createIcon('DesignerDeleteIcon', () => [
  h('path', { d: 'M3 6h18' }),
  h('path', { d: 'M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2' }),
  h('path', { d: 'M6 6l1 14a1 1 0 0 0 1 .9h8a1 1 0 0 0 1-.9l1-14' }),
  h('path', { d: 'M10 11v6' }),
  h('path', { d: 'M14 11v6' }),
])

const Top = createIcon('DesignerTopIcon', () => [
  h('path', { d: 'M12 6v12' }),
  h('path', { d: 'M8 10l4-4 4 4' }),
])

const Bottom = createIcon('DesignerBottomIcon', () => [
  h('path', { d: 'M12 6v12' }),
  h('path', { d: 'M8 14l4 4 4-4' }),
])

const FolderAdd = createIcon('DesignerFolderAddIcon', () => [
  h('path', { d: 'M3 8a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z' }),
  h('path', { d: 'M12 11v5' }),
  h('path', { d: 'M9.5 13.5h5' }),
])

export const fallbackDesignerIcons: DesignerIcons = {
  Search,
  Bottom,
  CirclePlus,
  CopyDocument,
  Delete,
  FolderAdd,
  Top,
}
