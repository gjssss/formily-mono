<script setup lang="ts">
import type { FormilyComponent } from '@formily-djd/component'
import type { ElTree } from 'element-plus'
import { Bottom, CirclePlus, CopyDocument, Delete, FolderAdd, Search, Top } from '@element-plus/icons-vue'
import { uid } from '@formily/shared'
import { deleteByPath, setByPath } from '@formily-djd/utils'
import { computed, inject, nextTick, ref } from 'vue'
import { ClosestPosition } from '../../core/dragon'
import { useDesignStore } from '../../core/useDesignStore'

// 获取设计器状态
const store = useDesignStore()

// 注入 components（用于组件选择弹窗）
const components = inject<Record<string, FormilyComponent>>('designerComponents', {})

// 树组件引用
const treeRef = ref<InstanceType<typeof ElTree>>()

// 搜索关键词
const filterText = ref('')

// 右键菜单相关
const contextMenuVisible = ref(false)
const contextMenuStyle = ref({ top: '0px', left: '0px' })
const contextMenuNode = ref<TreeNode | null>(null)
const contextMenuMode = ref<'node' | 'empty'>('node')

// 组件选择弹窗相关
const componentPickerVisible = ref(false)
const insertContext = ref<{
  targetNode: TreeNode | null
  position: 'before' | 'after' | 'inner' | 'root'
} | null>(null)

// 树节点数据类型
interface TreeNode {
  path: string
  label: string
  title?: string
  component?: string
  isContainer: boolean
  children?: TreeNode[]
}

/**
 * 将 schema 转换为树形数据结构
 */
function convertSchemaToTree(schema: any, parentPath = ''): TreeNode[] {
  const nodes: TreeNode[] = []

  if (!schema || typeof schema !== 'object') {
    return nodes
  }

  // 处理 properties
  if (schema.properties && typeof schema.properties === 'object') {
    Object.entries(schema.properties).forEach(([key, fieldSchema]: [string, any]) => {
      const path = parentPath ? `${parentPath}.properties.${key}` : key
      const component = fieldSchema['x-component'] || 'Unknown'
      const title = fieldSchema.title || key
      const isContainer = checkIsContainer(fieldSchema)

      const node: TreeNode = {
        path,
        label: title,
        title,
        component,
        isContainer,
        children: convertSchemaToTree(fieldSchema, path),
      }

      nodes.push(node)
    })
  }

  // 处理 items.properties（数组类型）
  if (schema.items?.properties) {
    Object.entries(schema.items.properties).forEach(([key, fieldSchema]: [string, any]) => {
      const path = `${parentPath}.items.properties.${key}`
      const component = fieldSchema['x-component'] || 'Unknown'
      const title = fieldSchema.title || key
      const isContainer = checkIsContainer(fieldSchema)

      const node: TreeNode = {
        path,
        label: title,
        title,
        component,
        isContainer,
        children: convertSchemaToTree(fieldSchema, path),
      }

      nodes.push(node)
    })
  }

  return nodes
}

/**
 * 检查节点是否为容器
 */
function checkIsContainer(schema: any): boolean {
  if (schema['x-droppable'] === false)
    return false

  // Object/Void/Array 类型是容器
  if (['object', 'void', 'array'].includes(schema.type)) {
    return true
  }

  return false
}

// 转换后的树数据
const treeData = computed(() => {
  return convertSchemaToTree(store.formSchema.value)
})

// 组件分组（用于组件选择弹窗）
const groupedComponents = computed(() => {
  const groups: Record<string, Array<{ key: string, component: FormilyComponent }>> = {}

  Object.entries(components).forEach(([key, component]) => {
    // 过滤隐藏的组件
    if (component.config?.hidden === true) {
      return
    }

    const category = component.config?.category || '其他'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push({ key, component })
  })

  return groups
})

// 树配置
const treeProps = {
  children: 'children',
  label: 'label',
}

/**
 * 过滤树节点
 */
function filterNode(value: string, data: TreeNode) {
  if (!value)
    return true
  return data.label.toLowerCase().includes(value.toLowerCase())
}

/**
 * 监听搜索关键词变化
 */
function handleFilterChange(value: string) {
  treeRef.value?.filter(value)
}

/**
 * 全部展开
 */
function expandAll() {
  // 获取所有节点的 key
  const allKeys = getAllNodeKeys(treeData.value)
  allKeys.forEach((key) => {
    const node = treeRef.value?.getNode(key)
    if (node) {
      node.expanded = true
    }
  })
}

/**
 * 全部折叠
 */
function collapseAll() {
  const allKeys = getAllNodeKeys(treeData.value)
  allKeys.forEach((key) => {
    const node = treeRef.value?.getNode(key)
    if (node) {
      node.expanded = false
    }
  })
}

/**
 * 获取所有节点的 key
 */
function getAllNodeKeys(nodes: TreeNode[]): string[] {
  const keys: string[] = []
  nodes.forEach((node) => {
    keys.push(node.path)
    if (node.children && node.children.length > 0) {
      keys.push(...getAllNodeKeys(node.children))
    }
  })
  return keys
}

/**
 * 节点点击 - 选中节点
 */
function handleNodeClick(data: TreeNode) {
  store.selectNode(data.path)
}

/**
 * 判断是否允许拖拽
 */
function handleAllowDrag(draggingNode: any) {
  // 不允许拖拽根节点（这里可以根据实际需求调整）
  return true
}

/**
 * 判断是否允许放置（智能边缘判断 - 20% 边缘）
 */
function handleAllowDrop(draggingNode: any, dropNode: any, type: 'prev' | 'inner' | 'next') {
  const targetData: TreeNode = dropNode.data

  // 检查目标是否为容器
  if (type === 'inner') {
    // 只有容器节点才允许内部插入
    return targetData.isContainer
  }

  // prev 和 next 总是允许（兄弟插入）
  return true
}

/**
 * 节点拖拽成功后的处理
 */
function handleNodeDrop(draggingNode: any, dropNode: any, dropType: 'before' | 'after' | 'inner', event: any) {
  const sourceData: TreeNode = draggingNode.data
  const targetData: TreeNode = dropNode.data

  // 映射 ElTree 的 dropType 到 ClosestPosition
  let position: string
  if (dropType === 'inner') {
    position = 'INNER'
  }
  else if (dropType === 'before') {
    position = 'BEFORE'
  }
  else {
    position = 'AFTER'
  }

  // 调用 store 的移动方法
  store.moveField(sourceData.path, targetData.path, position as any)
}

/**
 * 动态菜单项计算
 */
const menuItems = computed(() => {
  // 空白区域：只显示"插入组件"
  if (contextMenuMode.value === 'empty') {
    return [
      { type: 'insertRoot', label: '插入组件', icon: CirclePlus },
    ]
  }

  const node = contextMenuNode.value
  if (!node)
    return []

  // 节点菜单：原有菜单项 + 插入选项
  const items: any[] = [
    { type: 'copy', label: '复制', icon: CopyDocument },
    { type: 'delete', label: '删除', icon: Delete },
    'divider',
    { type: 'moveUp', label: '上移', icon: Top },
    { type: 'moveDown', label: '下移', icon: Bottom },
    'divider',
    { type: 'insertBefore', label: '上方插入', icon: CirclePlus },
    { type: 'insertAfter', label: '下方插入', icon: CirclePlus },
  ]

  // 容器节点：额外显示"插入内部组件"
  if (node.isContainer) {
    items.push({ type: 'insertInner', label: '插入内部组件', icon: FolderAdd })
  }

  return items
})

/**
 * 空白区域右键菜单
 */
function handleEmptyContextMenu(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()

  contextMenuMode.value = 'empty'
  contextMenuNode.value = null
  contextMenuStyle.value = {
    top: `${event.clientY}px`,
    left: `${event.clientX}px`,
  }
  contextMenuVisible.value = true

  // 点击其他地方关闭菜单
  const closeMenu = () => {
    contextMenuVisible.value = false
    document.removeEventListener('click', closeMenu)
  }
  setTimeout(() => {
    document.addEventListener('click', closeMenu)
  }, 0)
}

/**
 * 右键菜单 - 打开
 */
function handleNodeContextMenu(event: MouseEvent, data: TreeNode, node: any, element: any) {
  event.preventDefault()
  event.stopPropagation()

  contextMenuMode.value = 'node'
  contextMenuNode.value = data
  contextMenuStyle.value = {
    top: `${event.clientY}px`,
    left: `${event.clientX}px`,
  }
  contextMenuVisible.value = true

  // 点击其他地方关闭菜单
  const closeMenu = () => {
    contextMenuVisible.value = false
    document.removeEventListener('click', closeMenu)
  }
  setTimeout(() => {
    document.addEventListener('click', closeMenu)
  }, 0)
}

/**
 * 打开组件选择器
 */
function openComponentPicker(targetNode: TreeNode | null, position: 'before' | 'after' | 'inner' | 'root') {
  insertContext.value = { targetNode, position }
  componentPickerVisible.value = true
}

/**
 * 菜单点击处理
 */
function handleMenuClick(type: string) {
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
  contextMenuVisible.value = false
}

/**
 * 组件选择处理
 */
function handleSelectComponent(componentKey: string, component: FormilyComponent) {
  if (!insertContext.value)
    return

  const { targetNode, position } = insertContext.value
  const dragData = {
    componentKey,
    defaultSchema: component.defaultSchema,
  }

  // 复用现有插入逻辑
  if (position === 'root') {
    insertNewComponentToRoot(dragData)
  }
  else if (targetNode) {
    insertNewComponent(dragData, targetNode, position)
  }

  // 关闭弹窗
  componentPickerVisible.value = false
  insertContext.value = null
}

/**
 * 获取节点所在的 properties 对象（考虑 array 类型的 items.properties）
 */
function getNodePropertiesContext(nodePath: string) {
  const pathParts = nodePath.split('.')
  const fieldName = pathParts[pathParts.length - 1]

  // 检查路径中是否包含 items.properties
  const isInArrayItems = pathParts.includes('items') && pathParts.includes('properties')

  // 获取父路径
  let parentPath = ''
  if (isInArrayItems) {
    // 如果在 items.properties 中，父路径需要去掉 .items.properties.fieldName
    const itemsIndex = pathParts.lastIndexOf('items')
    parentPath = pathParts.slice(0, itemsIndex).join('.')
  }
  else {
    // 普通 properties，去掉 .properties.fieldName
    const propertiesIndex = pathParts.lastIndexOf('properties')
    if (propertiesIndex > 0) {
      // 修复：应该是 propertiesIndex 而不是 propertiesIndex - 1
      // 例如：f_grid.properties.f_input -> parentPath 应该是 'f_grid'
      parentPath = pathParts.slice(0, propertiesIndex).join('.')
    }
  }

  let parentSchema: any
  let propertiesObj: any

  if (parentPath) {
    parentSchema = store.getNodeSchema(parentPath)
    if (parentSchema) {
      if (parentSchema.type === 'array') {
        propertiesObj = parentSchema.items?.properties
      }
      else {
        propertiesObj = parentSchema.properties
      }
    }
  }
  else {
    // 根级别
    parentSchema = store.formSchema.value
    propertiesObj = parentSchema.properties
  }

  return { parentSchema, propertiesObj, fieldName }
}

/**
 * 复制节点
 */
function handleCopyNode() {
  if (!contextMenuNode.value)
    return

  const nodePath = contextMenuNode.value.path
  const schema = store.getNodeSchema(nodePath)
  if (!schema)
    return

  // 使用 uid 生成唯一的字段名，添加前缀确保不以数字开头
  const newFieldName = `f_${uid()}`

  // 深拷贝 schema
  const newSchema = JSON.parse(JSON.stringify(schema))

  // 计算新节点的完整路径
  const pathParts = nodePath.split('.')
  const parentParts = pathParts.slice(0, -1)
  const newNodePath = [...parentParts, newFieldName].join('.')

  // 使用 setByPath 添加到 formSchema，触发响应式更新
  setByPath(store.formSchema.value.properties, newNodePath, newSchema)

  contextMenuVisible.value = false
}

/**
 * 删除节点
 */
function handleDeleteNode() {
  if (!contextMenuNode.value)
    return

  const nodePath = contextMenuNode.value.path

  // 使用 deleteByPath 从 formSchema.value.properties 中删除，触发响应式更新
  deleteByPath(store.formSchema.value.properties, nodePath)

  contextMenuVisible.value = false
}

/**
 * 上移节点
 */
function handleMoveUp() {
  if (!contextMenuNode.value)
    return

  const nodePath = contextMenuNode.value.path

  // 获取父节点信息
  const { parentSchema, propertiesObj, fieldName } = getNodePropertiesContext(nodePath)
  if (!propertiesObj || !parentSchema)
    return

  // 将 properties 转换为数组
  const entries = Object.entries(propertiesObj)
  const currentIndex = entries.findIndex(([key]) => key === fieldName)

  if (currentIndex <= 0)
    return // 已经是第一个，无法上移

  // 交换位置
  const temp = entries[currentIndex]
  entries[currentIndex] = entries[currentIndex - 1]
  entries[currentIndex - 1] = temp

  // 重建 properties 对象
  const newProperties: any = {}
  entries.forEach(([key, value]) => {
    newProperties[key] = value
  })

  // 计算父节点路径并使用 setByPath 更新，触发响应式更新
  const pathParts = nodePath.split('.')

  // 检查是否为根节点
  if (pathParts.length === 1) {
    store.formSchema.value.properties = newProperties
  }
  else {
    // 计算父节点的 properties 路径
    const isInArrayItems = pathParts.includes('items')
    let parentPropertiesPath: string

    if (isInArrayItems) {
      // 在 array 的 items.properties 中
      const itemsIndex = pathParts.lastIndexOf('items')
      const parentPath = pathParts.slice(0, itemsIndex).join('.')
      parentPropertiesPath = `${parentPath}.items.properties`
    }
    else {
      // 在普通 properties 中
      const propertiesIndex = pathParts.lastIndexOf('properties')
      parentPropertiesPath = pathParts.slice(0, propertiesIndex + 1).join('.')
    }

    // 使用 setByPath 更新父节点的 properties，触发响应式
    setByPath(store.formSchema.value.properties, parentPropertiesPath, newProperties)
  }

  contextMenuVisible.value = false
}

/**
 * 下移节点
 */
function handleMoveDown() {
  if (!contextMenuNode.value)
    return

  const nodePath = contextMenuNode.value.path

  // 获取父节点信息
  const { parentSchema, propertiesObj, fieldName } = getNodePropertiesContext(nodePath)
  if (!propertiesObj || !parentSchema)
    return

  // 将 properties 转换为数组
  const entries = Object.entries(propertiesObj)
  const currentIndex = entries.findIndex(([key]) => key === fieldName)

  if (currentIndex === -1 || currentIndex >= entries.length - 1)
    return // 已经是最后一个，无法下移

  // 交换位置
  const temp = entries[currentIndex]
  entries[currentIndex] = entries[currentIndex + 1]
  entries[currentIndex + 1] = temp

  // 重建 properties 对象
  const newProperties: any = {}
  entries.forEach(([key, value]) => {
    newProperties[key] = value
  })

  // 计算父节点路径并使用 setByPath 更新，触发响应式更新
  const pathParts = nodePath.split('.')

  // 检查是否为根节点
  if (pathParts.length === 1) {
    store.formSchema.value.properties = newProperties
  }
  else {
    // 计算父节点的 properties 路径
    const isInArrayItems = pathParts.includes('items')
    let parentPropertiesPath: string

    if (isInArrayItems) {
      // 在 array 的 items.properties 中
      const itemsIndex = pathParts.lastIndexOf('items')
      const parentPath = pathParts.slice(0, itemsIndex).join('.')
      parentPropertiesPath = `${parentPath}.items.properties`
    }
    else {
      // 在普通 properties 中
      const propertiesIndex = pathParts.lastIndexOf('properties')
      parentPropertiesPath = pathParts.slice(0, propertiesIndex + 1).join('.')
    }

    // 使用 setByPath 更新父节点的 properties，触发响应式
    setByPath(store.formSchema.value.properties, parentPropertiesPath, newProperties)
  }

  contextMenuVisible.value = false
}

/**
 * 处理从组件库拖入到树容器
 */
function handleExternalDrop(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()

  if (!event.dataTransfer)
    return

  try {
    const dataStr = event.dataTransfer.getData('application/json')
    if (!dataStr)
      return

    const dragData = JSON.parse(dataStr)

    // 只处理从组件库拖入的新组件
    if (dragData.type !== 'new-component')
      return

    const { componentKey, defaultSchema } = dragData

    if (!defaultSchema) {
      console.warn('组件缺少 defaultSchema:', componentKey)
      return
    }

    // 获取鼠标位置对应的树节点
    const targetNode = getTreeNodeAtPosition(event.clientX, event.clientY)
    console.log('targetNode', targetNode)

    if (targetNode) {
      // 有目标节点，使用智能插入
      const position = calculateDropPosition(event, targetNode.element)
      insertNewComponent(dragData, targetNode.data, position)
    }
    else {
      // 空树或空白区域，插入到根级别
      insertNewComponentToRoot(dragData)
    }
  }
  catch (error) {
    console.error('解析拖拽数据失败:', error)
  }
}

/**
 * 获取鼠标位置的树节点
 */
function getTreeNodeAtPosition(x: number, y: number): { element: Element, data: TreeNode } | null {
  const element = document.elementFromPoint(x, y)
  const nodeElement = element?.closest('.el-tree-node')

  if (nodeElement) {
    // 通过 DOM 查找对应的节点数据
    const nodeContentElement = nodeElement.querySelector('.el-tree-node__content')
    if (nodeContentElement) {
      // 从节点内容中提取路径信息
      const treeNodeData = (nodeElement as any).__vnode?.props?.['node-key']

      // 通过路径在 treeData 中查找节点
      const findNodeByPath = (nodes: TreeNode[], path: string): TreeNode | null => {
        for (const node of nodes) {
          if (node.path === path)
            return node
          if (node.children) {
            const found = findNodeByPath(node.children, path)
            if (found)
              return found
          }
        }
        return null
      }

      // 尝试从 DOM 的 data-path 属性获取路径
      const pathFromDom = nodeElement.getAttribute('data-path')
        || nodeContentElement.getAttribute('data-path')

      if (pathFromDom) {
        const nodeData = findNodeByPath(treeData.value, pathFromDom)
        if (nodeData) {
          return { element: nodeElement, data: nodeData }
        }
      }

      // 如果没有找到，尝试通过索引查找
      const allNodes = document.querySelectorAll('.el-tree-node')
      const index = Array.from(allNodes).indexOf(nodeElement)
      if (index >= 0 && index < treeData.value.length) {
        return { element: nodeElement, data: treeData.value[index] }
      }
    }
  }

  return null
}

/**
 * 计算放置位置（20% 边缘阈值）
 */
function calculateDropPosition(event: DragEvent, nodeElement: Element): 'before' | 'after' | 'inner' {
  const rect = nodeElement.getBoundingClientRect()
  const relativeY = event.clientY - rect.top
  const threshold = rect.height * 0.2

  if (relativeY < threshold) {
    return 'before'
  }
  else if (relativeY > rect.height - threshold) {
    return 'after'
  }
  else {
    return 'inner'
  }
}

/**
 * 插入新组件到指定位置
 */
function insertNewComponent(dragData: any, targetNode: TreeNode, position: 'before' | 'after' | 'inner') {
  const { componentKey, defaultSchema } = dragData
  // 使用 uid 生成唯一的字段名，添加前缀确保不以数字开头
  const fieldName = `f_${uid()}`

  // 映射位置到 ClosestPosition
  let closestPosition: any
  if (position === 'inner') {
    closestPosition = ClosestPosition.Inner
  }
  else if (position === 'before') {
    closestPosition = ClosestPosition.Before
  }
  else {
    closestPosition = ClosestPosition.After
  }

  // 调用 store 的 insertField 方法
  store.insertField(targetNode.path, fieldName, defaultSchema, closestPosition)

  // 选中新添加的节点
  nextTick(() => {
    let newPath: string
    if (position === 'inner') {
      // 插入为子节点
      const targetSchema = store.getNodeSchema(targetNode.path)
      if (targetSchema?.type === 'array') {
        newPath = `${targetNode.path}.items.properties.${fieldName}`
      }
      else {
        newPath = `${targetNode.path}.properties.${fieldName}`
      }
    }
    else {
      // 插入为兄弟节点
      const pathParts = targetNode.path.split('.')
      const parentPath = pathParts.slice(0, -1).join('.')
      if (parentPath) {
        newPath = `${parentPath}.${fieldName}`
      }
      else {
        newPath = fieldName
      }
    }
    store.selectNode(newPath)
    expandAll()
  })
}

/**
 * 插入到根级别
 */
function insertNewComponentToRoot(dragData: any) {
  const { componentKey, defaultSchema } = dragData
  // 使用 uid 生成唯一的字段名，添加前缀确保不以数字开头
  const fieldName = `f_${uid()}`

  store.addField(fieldName, defaultSchema)
  store.selectNode(fieldName)

  nextTick(() => {
    expandAll()
  })
}

// 初始化时全部展开
nextTick(() => {
  expandAll()
})
</script>

<template>
  <div class="schema-tree">
    <!-- 工具栏 -->
    <div class="tree-toolbar">
      <ElInput
        v-model="filterText"
        placeholder="搜索组件"
        clearable
        size="small"
        @input="handleFilterChange"
      >
        <template #prefix>
          <ElIcon><Search /></ElIcon>
        </template>
      </ElInput>
      <div class="toolbar-buttons">
        <ElButton size="small" text @click="expandAll">
          全部展开
        </ElButton>
        <ElButton size="small" text @click="collapseAll">
          全部折叠
        </ElButton>
      </div>
    </div>

    <!-- 树形结构 -->
    <div
      class="tree-content"
      @drop="handleExternalDrop"
      @dragover.prevent
      @contextmenu="handleEmptyContextMenu"
    >
      <ElTree
        ref="treeRef"
        style="height: 100%;"
        :data="treeData"
        :props="treeProps"
        node-key="path"
        draggable
        :allow-drop="handleAllowDrop"
        :allow-drag="handleAllowDrag"
        :filter-node-method="filterNode"
        default-expand-all
        highlight-current
        @node-click="handleNodeClick"
        @node-drop="handleNodeDrop"
        @node-contextmenu="handleNodeContextMenu"
      >
        <template #default="{ node, data }">
          <div class="tree-node" :class="{ 'is-container': data.isContainer }">
            <span class="node-label">{{ data.label }}</span>
            <span class="node-component">({{ data.component }})</span>
          </div>
        </template>
        <template #empty>
          <ElEmpty description="暂无组件，请从左侧拖入" />
        </template>
      </ElTree>
    </div>

    <!-- 右键菜单 -->
    <Teleport to="body">
      <div
        v-show="contextMenuVisible"
        class="context-menu"
        :style="contextMenuStyle"
      >
        <template v-for="(item, index) in menuItems" :key="index">
          <div v-if="item === 'divider'" class="menu-divider" />
          <div v-else class="menu-item" @click="handleMenuClick(item.type)">
            <ElIcon><component :is="item.icon" /></ElIcon>
            <span>{{ item.label }}</span>
          </div>
        </template>
      </div>
    </Teleport>

    <!-- 组件选择弹窗 -->
    <ElDialog
      v-model="componentPickerVisible"
      title="选择组件"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="component-picker-content">
        <div
          v-for="(items, category) in groupedComponents"
          :key="category"
          class="picker-category-group"
        >
          <div class="picker-category-title">
            {{ category }}
          </div>
          <div class="picker-component-grid">
            <div
              v-for="{ key, component } in items"
              :key="key"
              class="picker-component-item"
              @click="handleSelectComponent(key, component)"
            >
              <div class="picker-component-icon">
                {{ component.config?.icon?.slice(0, 3) }}
              </div>
              <div class="picker-component-name">
                {{ component.config?.name || key }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ElDialog>
  </div>
</template>

<style scoped>
.schema-tree {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color);
}

.tree-toolbar {
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.toolbar-buttons {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.tree-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  padding: 4px 0;
}

.tree-node.is-container {
  font-weight: 600;
  color: var(--el-color-primary);
}

.node-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.node-label {
  flex: 1;
  font-size: 14px;
}

.node-component {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

/* 拖拽时高亮 */
:deep(.el-tree-node.is-drop-inner > .el-tree-node__content) {
  background-color: var(--el-color-primary-light-9) !important;
  border: 2px dashed var(--el-color-primary);
}

/* 选中状态 */
:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: var(--el-color-primary-light-9);
}

/* 悬浮状态 */
:deep(.el-tree-node__content:hover) {
  background-color: var(--el-fill-color-light);
}

/* 右键菜单 */
.context-menu {
  position: fixed;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  box-shadow: var(--el-box-shadow-light);
  padding: 4px;
  min-width: 140px;
  z-index: 9999;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 14px;
  color: var(--el-text-color-primary);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.menu-item:hover {
  background-color: var(--el-fill-color-light);
  color: var(--el-color-primary);
}

.menu-divider {
  height: 1px;
  background-color: var(--el-border-color-light);
  margin: 4px 0;
}

/* Element Plus 图标大小调整 */
.menu-item .el-icon {
  font-size: 16px;
}

/* 组件选择器弹窗 */
.component-picker-content {
  max-height: 70vh;
  overflow-y: auto;
  padding: 16px;
}

.picker-category-group {
  margin-bottom: 24px;
}

.picker-category-group:last-child {
  margin-bottom: 0;
}

.picker-category-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.picker-component-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.picker-component-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 8px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: var(--el-bg-color);
}

.picker-component-item:hover {
  border-color: var(--el-color-primary);
  box-shadow: var(--el-box-shadow-light);
  transform: translateY(-2px);
}

.picker-component-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--el-color-primary);
  color: var(--el-color-white);
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.picker-component-name {
  font-size: 12px;
  color: var(--el-text-color-regular);
  text-align: center;
  word-break: break-word;
}
</style>
