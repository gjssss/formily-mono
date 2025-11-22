<script setup lang="ts">
import type { FormilyComponent } from '@formily-djd/component'
import { ref } from 'vue'
import MaterialPanel from '../materialPanel.vue'
import SchemaTree from './SchemaTree.vue'

defineProps<{
  components: Record<string, FormilyComponent>
}>()

// Tab 激活状态
const activeTab = ref('materials')
</script>

<template>
  <div class="left-panel">
    <ElTabs v-model="activeTab" class="panel-tabs">
      <ElTabPane label="组件库" name="materials">
        <MaterialPanel :components="components" />
      </ElTabPane>
      <ElTabPane label="组件树" name="tree">
        <SchemaTree />
      </ElTabPane>
    </ElTabs>
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
}

:deep(.el-tab-pane) {
  height: 100%;
}
</style>
