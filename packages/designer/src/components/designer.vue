<script setup lang="ts">
import type { FormilyComponent } from '@formily-djd/component'
import type { Form } from '@formily/core'
import type { ISchema } from '@formily/vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useCreateDesignStore } from '../core/useCreateDesignStore'
import Canvas from './canvas.vue'
import ConfigPanel from './configPanel.vue'
import Render from './render/index.vue'

const props = withDefaults(defineProps<{
  components: Record<string, FormilyComponent>
  mode?: 'edit' | 'preview'
  modelValue?: ISchema
}>(), {
  mode: 'edit',
})

const emit = defineEmits<{
  'update:modelValue': [schema: ISchema]
}>()

// 创建设计器状态（会自动 provide 给子组件）
const store = useCreateDesignStore()

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

// 初始化：添加一个默认的 Input 字段用于演示
onMounted(() => {
  // 添加测试字段
  store.addField('username', {
    type: 'object',
    properties: {
      input: {
        'type': 'string',
        'title': '用户名',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入用户名',
          maxlength: 20,
        },
      },
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
      'type': 'object',
      'x-component': 'ArrayItem',
      'properties': {
        szcefrhl5fd: {
          'type': 'string',
          'title': 'Input',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-designable-id': 'szcefrhl5fd',
          'x-index': 1,
        },
      },
    },
    'x-index': 0,
    'properties': {},
  })

  console.log('设计器初始化完成')
})
</script>

<template>
  <div class="designer">
    <div v-if="props.mode === 'edit'" class="designer-layout">
      <!-- 画布（编辑模式） -->
      <div class="designer-canvas">
        <Canvas :components="components" />
      </div>

      <!-- 配置面板 -->
      <div class="designer-config">
        <ConfigPanel :components="components" />
      </div>
    </div>

    <!-- 预览模式 -->
    <div v-else class="designer-preview">
      <Render ref="renderRef" :schema="store.formSchema.value" :components="components" />
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
  width: 520px;
  padding: 16px;
  background-color: #f5f7fa;
  overflow-y: auto;
}

.designer-preview {
  width: 100%;
  height: 100%;
  padding: 16px;
  overflow-y: auto;
}
</style>
