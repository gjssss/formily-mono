<script setup lang="ts">
import type { FormilyComponent } from '@formily-djd/component'
import { provide, ref } from 'vue'
import { LeftPanelKey } from '../../shared'
import MaterialPanel from '../materialPanel.vue'
import SchemaTree from './schemaTree/SchemaTree.vue'

const props = withDefaults(defineProps<{
  components: Record<string, FormilyComponent>
  draggable?: boolean
}>(), {
  draggable: false,
})

// Tab 激活状态
const activeTab = ref('materials')

/**
 * 切换到组件树 tab
 */
function switchToTreeTab() {
  if (activeTab.value !== 'tree') {
    activeTab.value = 'tree'
  }
}

// 提供给子组件使用
provide(LeftPanelKey, {
  switchToTreeTab,
})
</script>

<template>
  <div class="left-panel">
    <!-- draggable = true：显示 tabs -->
    <ElTabs v-if="props.draggable" v-model="activeTab" class="panel-tabs">
      <ElTabPane label="组件库" name="materials">
        <MaterialPanel :components="components" />
      </ElTabPane>
      <ElTabPane label="组件树" name="tree">
        <SchemaTree />
      </ElTabPane>
    </ElTabs>

    <!-- draggable = false：直接显示组件树 -->
    <SchemaTree v-else />
  </div>
</template>

<style scoped>
.left-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.panel-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.el-tabs__header) {
  margin: 0;
  padding: 0 16px;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.el-tabs__content) {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

:deep(.el-tab-pane) {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
