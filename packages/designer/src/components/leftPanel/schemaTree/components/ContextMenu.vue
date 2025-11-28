<script setup lang="ts">
import type { VirtualElement } from '@popperjs/core'

interface MenuItem {
  type: string
  label: string
  icon: any
}

const props = defineProps<{
  visible: boolean
  virtualRef: VirtualElement | null
  menuItems: Array<MenuItem | 'divider'>
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'select', type: string): void
}>()
</script>

<template>
  <ElPopover
    :visible="props.visible"
    :virtual-ref="props.virtualRef"
    virtual-triggering
    :show-arrow="false"
    popper-class="schema-tree-context-menu"
    placement="bottom-start"
    :offset="6"
    @update:visible="emit('update:visible', $event)"
  >
    <template #default>
      <div class="context-menu">
        <template v-for="(item, index) in props.menuItems" :key="index">
          <div v-if="item === 'divider'" class="menu-divider" />
          <div v-else class="menu-item" @click="emit('select', item.type)">
            <ElIcon><component :is="item.icon" /></ElIcon>
            <span>{{ item.label }}</span>
          </div>
        </template>
      </div>
    </template>
  </ElPopover>
</template>

<style scoped>
:deep(.schema-tree-context-menu) {
  min-width: 160px;
  padding: 4px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  box-shadow: var(--el-box-shadow-light);
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

.menu-item :deep(.el-icon) {
  font-size: 16px;
}
</style>
