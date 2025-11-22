<script setup lang="ts">
import type { ElTree } from 'element-plus'
import { Bottom, CopyDocument, Delete, Search, Top } from '@element-plus/icons-vue'
import { getFieldNameFromPath } from '@formily-djd/utils'
import { computed, nextTick, ref } from 'vue'
import { useDesignStore } from '../../core/useDesignStore'

// 获取设计器状态
const store = useDesignStore()

// 树组件引用
const treeRef = ref<InstanceType<typeof ElTree>>()

// 搜索关键词
const filterText = ref('')

// 右键菜单相关
const contextMenuVisible = ref(false)
const contextMenuStyle = ref({ top: '0px', left: '0px' })
const contextMenuNode = ref<TreeNode | null>(null)

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

/**
 * 获取组件图标（可以根据组件类型返回不同图标）
 */
function getComponentIcon(component: string): string {
  const iconMap: Record<string, string> = {
    'Input': '📝',
    'TextArea': '📄',
    'InputNumber': '🔢',
    'Select': '📋',
    'Checkbox': '☑️',
    'Radio': '⭕',
    'DatePicker': '📅',
    'Switch': '🔘',
    'Flex': '📦',
    'Grid': '🔲',
    'Space': '↔️',
    'Array': '📚',
    'ArrayItem': '📄',
  }
  return iconMap[component] || '🔧'
}

// 转换后的树数据
const treeData = computed(() => {
  return convertSchemaToTree(store.formSchema.value)
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
 * 右键菜单 - 打开
 */
function handleNodeContextMenu(event: MouseEvent, data: TreeNode, node: any, element: any) {
  event.preventDefault()
  event.stopPropagation()

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
      parentPath = pathParts.slice(0, propertiesIndex - 1).join('.')
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

  // 获取父节点信息
  const { propertiesObj, fieldName } = getNodePropertiesContext(nodePath)
  if (!propertiesObj)
    return

  // 生成新的字段名（添加 _copy 后缀）
  const newFieldName = `${fieldName}_copy`

  // 深拷贝 schema
  const newSchema = JSON.parse(JSON.stringify(schema))

  // 添加到同级
  propertiesObj[newFieldName] = newSchema

  contextMenuVisible.value = false
}

/**
 * 删除节点
 */
function handleDeleteNode() {
  if (!contextMenuNode.value)
    return

  const nodePath = contextMenuNode.value.path

  // 获取父节点信息
  const { propertiesObj, fieldName } = getNodePropertiesContext(nodePath)
  if (!propertiesObj)
    return

  // 删除节点
  delete propertiesObj[fieldName]

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

  // 更新 properties（考虑 array 类型）
  if (parentSchema.type === 'array') {
    parentSchema.items.properties = newProperties
  }
  else {
    // 检查是否为根节点
    const pathParts = nodePath.split('.')
    if (pathParts.length === 1) {
      store.formSchema.value.properties = newProperties
    }
    else {
      parentSchema.properties = newProperties
    }
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

  // 更新 properties（考虑 array 类型）
  if (parentSchema.type === 'array') {
    parentSchema.items.properties = newProperties
  }
  else {
    // 检查是否为根节点
    const pathParts = nodePath.split('.')
    if (pathParts.length === 1) {
      store.formSchema.value.properties = newProperties
    }
    else {
      parentSchema.properties = newProperties
    }
  }

  contextMenuVisible.value = false
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
    <div class="tree-content">
      <ElEmpty v-if="treeData.length === 0" description="暂无组件，请从左侧拖入" />
      <ElTree
        v-else
        ref="treeRef"
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
            <span class="node-icon">{{ getComponentIcon(data.component) }}</span>
            <span class="node-label">{{ data.label }}</span>
            <span class="node-component">({{ data.component }})</span>
          </div>
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
        <div class="menu-item" @click="handleCopyNode">
          <ElIcon><CopyDocument /></ElIcon>
          <span>复制</span>
        </div>
        <div class="menu-item" @click="handleDeleteNode">
          <ElIcon><Delete /></ElIcon>
          <span>删除</span>
        </div>
        <div class="menu-divider" />
        <div class="menu-item" @click="handleMoveUp">
          <ElIcon><Top /></ElIcon>
          <span>上移</span>
        </div>
        <div class="menu-item" @click="handleMoveDown">
          <ElIcon><Bottom /></ElIcon>
          <span>下移</span>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.schema-tree {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.tree-toolbar {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
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
  color: #3b82f6;
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
  color: #9ca3af;
}

/* 拖拽时高亮 */
:deep(.el-tree-node.is-drop-inner > .el-tree-node__content) {
  background-color: rgba(59, 130, 246, 0.1) !important;
  border: 2px dashed #3b82f6;
}

/* 选中状态 */
:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: #eff6ff;
}

/* 悬浮状态 */
:deep(.el-tree-node__content:hover) {
  background-color: #f3f4f6;
}

/* 右键菜单 */
.context-menu {
  position: fixed;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
  color: #1f2937;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.menu-item:hover {
  background-color: #f3f4f6;
  color: #3b82f6;
}

.menu-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 4px 0;
}

/* Element Plus 图标大小调整 */
.menu-item .el-icon {
  font-size: 16px;
}
</style>
