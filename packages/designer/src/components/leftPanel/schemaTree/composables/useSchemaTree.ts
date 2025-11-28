import type { ElTree } from 'element-plus'
import type { TreeNode } from '../types'

import type { ClosestPosition } from '@/core/dragon'
import { computed, ref } from 'vue'
import { useDesignStore } from '@/core/useDesignStore'
import { convertSchemaToTree, getAllNodeKeys } from '../utils/treeUtils'

export function useSchemaTree(store = useDesignStore()) {
  const treeRef = ref<InstanceType<typeof ElTree>>()
  const filterText = ref('')

  const treeData = computed(() => convertSchemaToTree(store.formSchema.value))

  const treeProps = {
    children: 'children',
    label: 'label',
  }

  const filterNode = (value: string, data: TreeNode) => {
    if (!value)
      return true
    return data.label.toLowerCase().includes(value.toLowerCase())
  }

  const handleFilterChange = (value: string) => {
    treeRef.value?.filter(value)
  }

  const expandAll = () => {
    const allKeys = getAllNodeKeys(treeData.value)
    allKeys.forEach((key) => {
      const node = treeRef.value?.getNode(key)
      if (node)
        node.expanded = true
    })
  }

  const collapseAll = () => {
    const allKeys = getAllNodeKeys(treeData.value)
    allKeys.forEach((key) => {
      const node = treeRef.value?.getNode(key)
      if (node)
        node.expanded = false
    })
  }

  const handleNodeClick = (data: TreeNode) => {
    store.selectNode(data.path)
  }

  const handleAllowDrag = (_draggingNode: any) => {
    return true
  }

  const handleAllowDrop = (_draggingNode: any, dropNode: any, type: 'prev' | 'inner' | 'next') => {
    const targetData: TreeNode = dropNode.data

    if (type === 'inner')
      return targetData.isContainer

    return true
  }

  const handleNodeDrop = (draggingNode: any, dropNode: any, dropType: 'before' | 'after' | 'inner', _event: any) => {
    const sourceData: TreeNode = draggingNode.data
    const targetData: TreeNode = dropNode.data

    let position: string
    if (dropType === 'inner')
      position = 'INNER'
    else if (dropType === 'before')
      position = 'BEFORE'
    else
      position = 'AFTER'

    store.moveField(sourceData.path, targetData.path, position as ClosestPosition)
  }

  return {
    treeRef,
    filterText,
    treeData,
    treeProps,
    filterNode,
    handleFilterChange,
    expandAll,
    collapseAll,
    handleNodeClick,
    handleAllowDrag,
    handleAllowDrop,
    handleNodeDrop,
  }
}
