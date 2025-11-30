<script setup lang="ts">
import type { FormilyComponent } from '@formily-djd/component'
import type { Form } from '@formily/core'
import type { ISchema } from '@formily/vue'
import { computed, provide, ref, watch } from 'vue'
import { useCreateDesignStore } from '../core/useCreateDesignStore'
import Canvas from './canvas.vue'
import ConfigPanel from './configPanel/index.vue'
import LeftPanel from './leftPanel/index.vue'
import Render from './render/index.vue'

const props = withDefaults(defineProps<{
  components: Record<string, FormilyComponent>
  mode?: 'edit' | 'preview'
  modelValue?: ISchema
  draggable?: boolean
  height?: string
}>(), {
  mode: 'edit',
  draggable: false,
  height: '100vh',
})

const emit = defineEmits<{
  'update:modelValue': [schema: ISchema]
}>()

// 创建设计器状态（会自动 provide 给子组件）
const store = useCreateDesignStore(props.draggable)

// Provide components 给子组件使用（用于组件选择弹窗）
provide('designerComponents', props.components)

// 表单实例引用
const renderRef = ref<{ form: Form } | null>(null)

// 同步外部 schema 到内部 store
watch(() => props.modelValue, (newSchema) => {
  if (newSchema && JSON.stringify(newSchema) !== JSON.stringify(store.formSchema.value)) {
    store.formSchema.value = newSchema
  }
}, { immediate: true, deep: true })

// 同步内部 store 到外部（v-model）
watch(() => store.formSchema.value, (newSchema) => {
  emit('update:modelValue', newSchema)
}, { deep: true })

// 获取表单值
function getFormValues() {
  return renderRef.value?.form?.values || {}
}

// 暴露给父组件
defineExpose({
  getFormValues,
  schema: computed(() => store.formSchema.value),
  store,
})
</script>

<template>
  <div class="designer" :style="{ height: props.height }">
    <div v-if="props.mode === 'edit'" class="designer-layout">
      <!-- 左侧面板（组件库 + 组件树） -->
      <div class="designer-material">
        <LeftPanel :components="components" :draggable="draggable" />
      </div>

      <!-- 画布（中间） -->
      <div class="designer-canvas">
        <Canvas :components="components" />
      </div>

      <!-- 配置面板（右侧） -->
      <div class="designer-config">
        <ConfigPanel :components="components" />
      </div>
    </div>

    <!-- 预览模式 -->
    <div v-else class="designer-preview">
      <Render
        ref="renderRef" :schema="store.formSchema.value" :components="components"
      />
    </div>
  </div>
</template>

<style scoped>
.designer {
  width: 100%;
  /* height 通过 style 绑定设置 */
}

.designer-layout {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.designer-material {
  width: 280px;
  height: 100%;
  overflow-y: auto;
  flex-shrink: 0;
}

.designer-canvas {
  flex: 1;
  height: 100%;
  border-left: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;
  overflow: hidden;
}

.designer-config {
  width: 300px;
  height: 100%;
  background-color: #f5f7fa;
  overflow: hidden;
  flex-shrink: 0;
}

.designer-preview {
  width: 100%;
  height: 100%;
  padding: 16px;
  overflow-y: auto;
}
</style>
