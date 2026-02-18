<script setup lang="ts">
import type { FormilyComponent } from '@formily-djd/component'
import { computed, inject, nextTick } from 'vue'
import { DesignerAdapterKey } from '@/core/adapter'

import { useDesignStore } from '../../../core/useDesignStore'
import ComponentPicker from './components/ComponentPicker.vue'
import ContextMenu from './components/ContextMenu.vue'
import { useContextMenu } from './composables/useContextMenu'
import { useNodeActions } from './composables/useNodeActions'
import { useSchemaTree } from './composables/useSchemaTree'
import { fallbackDesignerIcons } from './icons'

const store = useDesignStore()
const components = inject<Record<string, FormilyComponent>>('designerComponents', {})
const adapter = inject(DesignerAdapterKey, null)
const searchIcon = computed(() => adapter?.icons?.Search ?? fallbackDesignerIcons.Search)

const {
  treeRef,
  filterText,
  treeData,
  treeProps,
  filterNode,
  handleFilterChange,
  expandAll,
  collapseAll,
  handleNodeClick,
  handleAllowDrop,
  handleAllowDrag,
  handleNodeDrop,
} = useSchemaTree(store)

const {
  contextMenuVisible,
  contextMenuNode,
  contextMenuVirtualRef,
  menuItems,
  handleEmptyContextMenu,
  handleNodeContextMenu,
  closeContextMenu,
} = useContextMenu()

const {
  groupedComponents,
  componentPickerVisible,
  handleMenuClick,
  handleSelectComponent,
  handlePasteSchema,
  handleExternalDrop,
} = useNodeActions({
  store,
  components,
  contextMenuNode,
  closeContextMenu,
  treeData,
  expandAll,
})

nextTick(() => {
  expandAll()
})
</script>

<template>
  <div class="schema-tree">
    <div class="tree-toolbar">
      <ElInput
        v-model="filterText"
        placeholder="搜索组件"
        clearable
        size="small"
        @input="handleFilterChange"
      >
        <template #prefix>
          <ElIcon><component :is="searchIcon" /></ElIcon>
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
        :filter-node-method="(value: string, data: any) => filterNode(value, data)"
        default-expand-all
        highlight-current
        @node-click="handleNodeClick"
        @node-drop="handleNodeDrop"
        @node-contextmenu="(evt: any, data: any) => handleNodeContextMenu(evt, data)"
      >
        <template #default="{ data }">
          <div class="tree-node" :class="{ 'is-container': data.isContainer }">
            <span class="node-label">{{ data.label }}</span>
            <span class="node-component">({{ data.component }})</span>
          </div>
        </template>
        <template #empty>
          <ElEmpty description="暂无组件，请点击右键插入" />
        </template>
      </ElTree>
    </div>

    <ContextMenu
      v-model:visible="contextMenuVisible"
      :virtual-ref="contextMenuVirtualRef"
      :menu-items="menuItems"
      @select="handleMenuClick"
    />

    <ComponentPicker
      v-model:visible="componentPickerVisible"
      :grouped-components="groupedComponents"
      @select="handleSelectComponent"
      @paste-schema="handlePasteSchema"
    />
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

:deep(.el-tree-node.is-drop-inner > .el-tree-node__content) {
  background-color: var(--el-color-primary-light-9) !important;
  border: 2px dashed var(--el-color-primary);
}

:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: var(--el-color-primary-light-9);
}

:deep(.el-tree-node__content:hover) {
  background-color: var(--el-fill-color-light);
}
</style>
