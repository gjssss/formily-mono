<script setup lang="ts">
import type { FormilyComponent } from '@formily-djd/component'
import { onMounted } from 'vue'
import { useCreateDesignStore } from '../core/useCreateDesignStore'
import Canvas from './canvas.vue'
import ConfigPanel from './configPanel.vue'
import Render from './render/index.vue'

defineProps<{
  components: Record<string, FormilyComponent>
}>()

// 创建设计器状态（会自动 provide 给子组件）
const store = useCreateDesignStore()

// 初始化：添加一个默认的 Input 字段用于演示
onMounted(() => {
  // 添加测试字段
  store.addField('username', {
    'type': 'string',
    'title': '用户名',
    'x-decorator': 'FormItem',
    'x-component': 'Input',
    'x-component-props': {
      placeholder: '请输入用户名',
      maxlength: 20,
    },
  })
  store.addField('array', {
    'type': 'array',
    'x-decorator': 'FormItem',
    'x-component': 'Array',
    'x-component-props': {
      title: '<Title>',
    },
    'title': 'Array',
    'x-display': 'visible',
    'x-pattern': 'editable',
    'x-validator': [],
    'items': {
      type: 'object',
      properties: {
        szcefrhl5fd: {
          'type': 'string',
          'title': 'Input',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-index': 1,
        },
      },
    },
    'x-index': 0,
    'properties': {
      // '290bcam3tir': {
      //   'type': 'void',
      //   'title': 'Addition',
      //   'x-component': 'ArrayCards.Addition',
      //   'x-designable-id': '290bcam3tir',
      //   'x-index': 0,
      // },
    },
  })

  console.log('设计器初始化完成')
})
</script>

<template>
  <div class="designer">
    <div class="designer-layout">
      <!-- 画布 -->
      <div class="designer-canvas">
        <!-- <Canvas :components="components" /> -->
        <Render :schema="store.formSchema.value" :components="components" />
      </div>

      <!-- 配置面板 -->
      <div class="designer-config">
        <ConfigPanel :components="components" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.designer {
  width: 100%;
  height: 100vh;
}

.designer-layout {
  display: flex;
  height: 100%;
}

.designer-canvas {
  flex: 1;
  padding: 16px;
  border-right: 1px solid #dcdfe6;
  overflow-y: auto;
}

.designer-config {
  width: 320px;
  padding: 16px;
  background-color: #f5f7fa;
  overflow-y: auto;
}
</style>
