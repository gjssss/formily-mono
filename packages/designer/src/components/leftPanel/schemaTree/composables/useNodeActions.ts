import type { FormilyComponent } from '@formily-djd/component'
import type { Ref } from 'vue'
import type { TreeNode } from '../types'
import type { useDesignStore } from '@/core/useDesignStore'
import { deleteByPath, setByPath } from '@formily-djd/utils'

import { uid } from '@formily/shared'
import { computed, nextTick, ref } from 'vue'
import { ClosestPosition } from '@/core/dragon'
import { calculateDropPosition, cloneSchemaWithNewIds, findTreeNodeAtPosition } from '../utils/treeUtils'

interface InsertContext {
  targetNode: TreeNode | null
  position: 'before' | 'after' | 'inner' | 'root'
}

interface UseNodeActionsOptions {
  store: ReturnType<typeof useDesignStore>
  components: Record<string, FormilyComponent>
  contextMenuNode: Ref<TreeNode | null>
  closeContextMenu: () => void
  treeData: Ref<TreeNode[]>
  expandAll: () => void
}

export function useNodeActions(options: UseNodeActionsOptions) {
  const { components, contextMenuNode, closeContextMenu, treeData, expandAll, store } = options

  const componentPickerVisible = ref(false)
  const insertContext = ref<InsertContext | null>(null)

  const groupedComponents = computed(() => {
    const groups: Record<string, Array<{ key: string, component: FormilyComponent }>> = {}

    Object.entries(components || {}).forEach(([key, component]) => {
      if (component.config?.hidden === true)
        return

      const category = component.config?.category || '其他'
      if (!groups[category])
        groups[category] = []
      groups[category].push({ key, component })
    })

    return groups
  })

  const insertNewComponent = (dragData: any, targetNode: TreeNode, position: 'before' | 'after' | 'inner') => {
    const { defaultSchema } = dragData
    const fieldName = `f_${uid()}`

    let closestPosition: ClosestPosition
    if (position === 'inner')
      closestPosition = ClosestPosition.Inner
    else if (position === 'before')
      closestPosition = ClosestPosition.Before
    else
      closestPosition = ClosestPosition.After

    store.insertField(targetNode.path, fieldName, defaultSchema, closestPosition)

    nextTick(() => {
      let newPath: string
      if (position === 'inner') {
        const targetSchema = store.getNodeSchema(targetNode.path)
        if (targetSchema?.type === 'array')
          newPath = `${targetNode.path}.items.properties.${fieldName}`
        else
          newPath = `${targetNode.path}.properties.${fieldName}`
      }
      else {
        const pathParts = targetNode.path.split('.')
        const parentPath = pathParts.slice(0, -1).join('.')
        newPath = parentPath ? `${parentPath}.${fieldName}` : fieldName
      }
      store.selectNode(newPath)
      expandAll()
    })
  }

  const insertNewComponentToRoot = (dragData: any) => {
    const { defaultSchema } = dragData
    const fieldName = `f_${uid()}`

    store.addField(fieldName, defaultSchema)
    store.selectNode(fieldName)

    nextTick(() => {
      expandAll()
    })
  }

  const openComponentPicker = (targetNode: TreeNode | null, position: InsertContext['position']) => {
    insertContext.value = { targetNode, position }
    componentPickerVisible.value = true
  }

  const handleSelectComponent = (componentKey: string, component: FormilyComponent) => {
    if (!insertContext.value)
      return

    const { targetNode, position } = insertContext.value
    const dragData = {
      componentKey,
      defaultSchema: JSON.parse(JSON.stringify(component.defaultSchema)),
    }

    if (position === 'root') {
      insertNewComponentToRoot(dragData)
    }
    else if (targetNode) {
      insertNewComponent(dragData, targetNode, position)
    }

    componentPickerVisible.value = false
    insertContext.value = null
  }

  const getNodePropertiesContext = (nodePath: string) => {
    const pathParts = nodePath.split('.')
    const fieldName = pathParts[pathParts.length - 1]

    const isInArrayItems = pathParts.includes('items') && pathParts.includes('properties')

    let parentPath = ''
    if (isInArrayItems) {
      const itemsIndex = pathParts.lastIndexOf('items')
      parentPath = pathParts.slice(0, itemsIndex).join('.')
    }
    else {
      const propertiesIndex = pathParts.lastIndexOf('properties')
      if (propertiesIndex > 0)
        parentPath = pathParts.slice(0, propertiesIndex).join('.')
    }

    let parentSchema: any
    let propertiesObj: any

    if (parentPath) {
      parentSchema = store.getNodeSchema(parentPath)
      if (parentSchema) {
        if (parentSchema.type === 'array')
          propertiesObj = parentSchema.items?.properties
        else
          propertiesObj = parentSchema.properties
      }
    }
    else {
      parentSchema = store.formSchema.value
      propertiesObj = parentSchema.properties
    }

    return { parentSchema, propertiesObj, fieldName }
  }

  const handleCopyNode = () => {
    if (!contextMenuNode.value)
      return

    const nodePath = contextMenuNode.value.path
    const schema = store.getNodeSchema(nodePath)
    if (!schema)
      return

    const { parentSchema, propertiesObj, fieldName } = getNodePropertiesContext(nodePath)
    if (!parentSchema || !propertiesObj)
      return

    const newFieldName = `f_${uid()}`
    const newSchema = cloneSchemaWithNewIds(schema, nodePath, newFieldName)

    const entries = Object.entries(propertiesObj)
    const currentIndex = entries.findIndex(([key]) => key === fieldName)
    const insertIndex = currentIndex >= 0 ? currentIndex + 1 : entries.length
    entries.splice(insertIndex, 0, [newFieldName, newSchema])

    const newProperties: any = {}
    entries.forEach(([key, value]) => {
      newProperties[key] = value
    })

    const pathParts = nodePath.split('.')

    if (pathParts.length === 1) {
      store.formSchema.value.properties = newProperties
    }
    else {
      const isInArrayItems = pathParts.includes('items')
      let parentPropertiesPath: string

      if (isInArrayItems) {
        const itemsIndex = pathParts.lastIndexOf('items')
        const parentPath = pathParts.slice(0, itemsIndex).join('.')
        parentPropertiesPath = `${parentPath}.items.properties`
      }
      else {
        const propertiesIndex = pathParts.lastIndexOf('properties')
        parentPropertiesPath = pathParts.slice(0, propertiesIndex + 1).join('.')
      }

      setByPath(store.formSchema.value.properties, parentPropertiesPath, newProperties)
    }

    closeContextMenu()
  }

  const handleCopyTemplate = () => {
    if (!contextMenuNode.value)
      return

    const nodePath = contextMenuNode.value.path
    const schema = store.getNodeSchema(nodePath)
    if (!schema)
      return

    const temp = JSON.stringify(schema)
    navigator.clipboard.writeText(temp)
    closeContextMenu()
  }

  const handleDeleteNode = () => {
    if (!contextMenuNode.value)
      return

    const nodePath = contextMenuNode.value.path
    deleteByPath(store.formSchema.value.properties, nodePath)

    closeContextMenu()
  }

  const handleMoveUp = () => {
    if (!contextMenuNode.value)
      return

    const nodePath = contextMenuNode.value.path

    const { parentSchema, propertiesObj, fieldName } = getNodePropertiesContext(nodePath)
    if (!propertiesObj || !parentSchema)
      return

    const entries = Object.entries(propertiesObj)
    const currentIndex = entries.findIndex(([key]) => key === fieldName)

    if (currentIndex <= 0)
      return

    const temp = entries[currentIndex]
    entries[currentIndex] = entries[currentIndex - 1]
    entries[currentIndex - 1] = temp

    const newProperties: any = {}
    entries.forEach(([key, value]) => {
      newProperties[key] = value
    })

    const pathParts = nodePath.split('.')

    if (pathParts.length === 1) {
      store.formSchema.value.properties = newProperties
    }
    else {
      const isInArrayItems = pathParts.includes('items')
      let parentPropertiesPath: string

      if (isInArrayItems) {
        const itemsIndex = pathParts.lastIndexOf('items')
        const parentPath = pathParts.slice(0, itemsIndex).join('.')
        parentPropertiesPath = `${parentPath}.items.properties`
      }
      else {
        const propertiesIndex = pathParts.lastIndexOf('properties')
        parentPropertiesPath = pathParts.slice(0, propertiesIndex + 1).join('.')
      }

      setByPath(store.formSchema.value.properties, parentPropertiesPath, newProperties)
    }

    closeContextMenu()
  }

  const handleMoveDown = () => {
    if (!contextMenuNode.value)
      return

    const nodePath = contextMenuNode.value.path

    const { parentSchema, propertiesObj, fieldName } = getNodePropertiesContext(nodePath)
    if (!propertiesObj || !parentSchema)
      return

    const entries = Object.entries(propertiesObj)
    const currentIndex = entries.findIndex(([key]) => key === fieldName)

    if (currentIndex === -1 || currentIndex >= entries.length - 1)
      return

    const temp = entries[currentIndex]
    entries[currentIndex] = entries[currentIndex + 1]
    entries[currentIndex + 1] = temp

    const newProperties: any = {}
    entries.forEach(([key, value]) => {
      newProperties[key] = value
    })

    const pathParts = nodePath.split('.')

    if (pathParts.length === 1) {
      store.formSchema.value.properties = newProperties
    }
    else {
      const isInArrayItems = pathParts.includes('items')
      let parentPropertiesPath: string

      if (isInArrayItems) {
        const itemsIndex = pathParts.lastIndexOf('items')
        const parentPath = pathParts.slice(0, itemsIndex).join('.')
        parentPropertiesPath = `${parentPath}.items.properties`
      }
      else {
        const propertiesIndex = pathParts.lastIndexOf('properties')
        parentPropertiesPath = pathParts.slice(0, propertiesIndex + 1).join('.')
      }

      setByPath(store.formSchema.value.properties, parentPropertiesPath, newProperties)
    }

    closeContextMenu()
  }

  const handleExternalDrop = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (!event.dataTransfer)
      return

    try {
      const dataStr = event.dataTransfer.getData('application/json')
      if (!dataStr)
        return

      const dragData = JSON.parse(dataStr)

      if (dragData.type !== 'new-component')
        return

      const { componentKey, defaultSchema } = dragData

      if (!defaultSchema) {
        console.warn('组件缺少 defaultSchema:', componentKey)
        return
      }

      const targetNode = findTreeNodeAtPosition(treeData.value, event.clientX, event.clientY)
      console.log('targetNode', targetNode)

      if (targetNode) {
        const position = calculateDropPosition(event, targetNode.element)
        insertNewComponent(dragData, targetNode.data, position)
      }
      else {
        insertNewComponentToRoot(dragData)
      }
    }
    catch (error) {
      console.error('解析拖拽数据失败:', error)
    }
  }

  const handleMenuClick = (type: string) => {
    switch (type) {
      case 'insertRoot':
        openComponentPicker(null, 'root')
        break
      case 'insertBefore':
        openComponentPicker(contextMenuNode.value, 'before')
        break
      case 'insertAfter':
        openComponentPicker(contextMenuNode.value, 'after')
        break
      case 'insertInner':
        openComponentPicker(contextMenuNode.value, 'inner')
        break
      case 'copy':
        handleCopyNode()
        return
      case 'copyTemplate':
        handleCopyTemplate()
        return
      case 'delete':
        handleDeleteNode()
        return
      case 'moveUp':
        handleMoveUp()
        return
      case 'moveDown':
        handleMoveDown()
        return
    }
    closeContextMenu()
  }

  return {
    groupedComponents,
    componentPickerVisible,
    handleMenuClick,
    handleSelectComponent,
    handleExternalDrop,
  }
}
