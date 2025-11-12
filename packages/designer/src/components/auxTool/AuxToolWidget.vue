<script setup lang="ts">
import HoverBox from './HoverBox.vue'
import Insertion from './Insertion.vue'
import SelectionBox from './SelectionBox.vue'

/**
 * 辅助工具层
 * 使用绝对定位覆盖在 Canvas 上方，用于渲染选中框、悬浮框和插入指示器
 */
</script>

<template>
  <div class="aux-tool-widget">
    <!-- 悬浮虚线框（zIndex: 2） -->
    <HoverBox />

    <!-- 选中实线框（zIndex: 4） -->
    <SelectionBox />

    <!-- 插入指示器（zIndex: 10） -->
    <Insertion />
  </div>
</template>

<style scoped>
.aux-tool-widget {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none; /* 整个层不拦截鼠标事件 */
  z-index: 1000;
  overflow: hidden;
}
</style>
