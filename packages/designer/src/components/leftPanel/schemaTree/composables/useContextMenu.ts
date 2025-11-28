import type { VirtualElement } from '@popperjs/core'
import type { TreeNode } from '../types'
import { Bottom, CirclePlus, CopyDocument, Delete, FolderAdd, Top } from '@element-plus/icons-vue'

import { computed, onBeforeUnmount, ref } from 'vue'

export function useContextMenu() {
  const contextMenuVisible = ref(false)
  const contextMenuNode = ref<TreeNode | null>(null)
  const contextMenuMode = ref<'node' | 'empty'>('node')
  const contextMenuVirtualRef = ref<VirtualElement | null>(null)
  const outsideClickHandler = ref<((event: MouseEvent) => void) | null>(null)

  const menuItems = computed(() => {
    if (contextMenuMode.value === 'empty') {
      return [
        { type: 'insertRoot', label: '插入组件', icon: CirclePlus },
      ]
    }

    const node = contextMenuNode.value
    if (!node)
      return []

    const items: any[] = [
      { type: 'copy', label: '复制', icon: CopyDocument },
      { type: 'copyTemplate', label: '复制模板', icon: CopyDocument },
      { type: 'delete', label: '删除', icon: Delete },
      'divider',
      { type: 'moveUp', label: '上移', icon: Top },
      { type: 'moveDown', label: '下移', icon: Bottom },
      'divider',
      { type: 'insertBefore', label: '上方插入', icon: CirclePlus },
      { type: 'insertAfter', label: '下方插入', icon: CirclePlus },
    ]

    if (node.isContainer)
      items.push({ type: 'insertInner', label: '插入内部', icon: FolderAdd })

    return items
  })

  const updateContextMenuVirtualRef = (event: MouseEvent): void => {
    const rect = new DOMRect(event.clientX, event.clientY, 0, 0)
    contextMenuVirtualRef.value = {
      getBoundingClientRect: () => rect,
      contextElement: document.body,
    } as VirtualElement
  }

  const removeOutsideClickListener = (): void => {
    if (outsideClickHandler.value) {
      document.removeEventListener('click', outsideClickHandler.value)
      outsideClickHandler.value = null
    }
  }

  const closeContextMenu = (): void => {
    contextMenuVisible.value = false
    removeOutsideClickListener()
  }

  const bindOutsideClickListener = (): void => {
    removeOutsideClickListener()
    const handler = (): void => {
      closeContextMenu()
    }
    outsideClickHandler.value = handler
    document.addEventListener('click', handler)
  }

  const openContextMenu = (event: MouseEvent, mode: 'node' | 'empty', node: TreeNode | null): void => {
    event.preventDefault()
    event.stopPropagation()

    contextMenuMode.value = mode
    contextMenuNode.value = node
    updateContextMenuVirtualRef(event)
    contextMenuVisible.value = true

    setTimeout(() => {
      bindOutsideClickListener()
    }, 0)
  }

  const handleEmptyContextMenu = (event: MouseEvent): void => {
    openContextMenu(event, 'empty', null)
  }

  const handleNodeContextMenu = (event: MouseEvent, data: TreeNode): void => {
    openContextMenu(event, 'node', data)
  }

  onBeforeUnmount(() => {
    removeOutsideClickListener()
  })

  return {
    contextMenuVisible,
    contextMenuNode,
    contextMenuMode,
    contextMenuVirtualRef,
    menuItems,
    handleEmptyContextMenu,
    handleNodeContextMenu,
    closeContextMenu,
  }
}
