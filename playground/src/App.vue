<script setup lang="ts">
import type { ISchema } from '@formily/vue'
import { Designer } from '@formily-djd/designer'
import {
  Array,
  ArrayItem,
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  TextArea,
} from '@formily-djd/component'
import { ref } from 'vue'

// 模式切换
const mode = ref<'edit' | 'preview'>('edit')

// Designer 实例引用
const designerRef = ref<any>(null)

// Schema (v-model)
const schema = ref<ISchema>({
  type: 'object',
  properties: {},
})

// 切换模式
const toggleMode = () => {
  mode.value = mode.value === 'edit' ? 'preview' : 'edit'
}

// 获取表单值
const getValues = () => {
  const values = designerRef.value?.getFormValues()
  console.log('表单值:', values)
  alert(JSON.stringify(values, null, 2))
}

// 获取 Schema
const getSchema = () => {
  console.log('Schema:', schema.value)
  alert(JSON.stringify(schema.value, null, 2))
}

// 测试 Schemas
const testSchemas = {
  basic: {
    type: 'object',
    properties: {
      username: {
        'type': 'string',
        'title': '用户名',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入用户名',
          maxlength: 20,
        },
      },
      password: {
        'type': 'string',
        'title': '密码',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入密码',
          maxlength: 50,
        },
      },
    },
  },
  comprehensive: {
    type: 'object',
    properties: {
      // Input
      username: {
        'type': 'string',
        'title': '用户名',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入用户名',
          maxlength: 20,
        },
      },
      // TextArea
      description: {
        'type': 'string',
        'title': '描述',
        'x-decorator': 'FormItem',
        'x-component': 'TextArea',
        'x-component-props': {
          placeholder: '请输入描述',
          rows: 4,
          maxlength: 200,
          showWordLimit: true,
        },
      },
      // Select (可以通过设计器配置 options)
      city: {
        'type': 'string',
        'title': '城市',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: '请选择城市',
          clearable: true,
          filterable: true,
          options: [
            { label: '北京', value: 'beijing' },
            { label: '上海', value: 'shanghai' },
            { label: '广州', value: 'guangzhou' },
            { label: '深圳', value: 'shenzhen' },
          ],
        },
      },
      // Radio
      gender: {
        'type': 'string',
        'title': '性别',
        'x-decorator': 'FormItem',
        'x-component': 'Radio',
        'x-component-props': {
          options: [
            { label: '男', value: 'male' },
            { label: '女', value: 'female' },
          ],
        },
      },
      // Checkbox
      hobbies: {
        'type': 'array',
        'title': '爱好',
        'x-decorator': 'FormItem',
        'x-component': 'Checkbox',
        'x-component-props': {
          options: [
            { label: '读书', value: 'reading' },
            { label: '运动', value: 'sports' },
            { label: '音乐', value: 'music' },
          ],
        },
      },
      // InputNumber
      age: {
        'type': 'number',
        'title': '年龄',
        'x-decorator': 'FormItem',
        'x-component': 'InputNumber',
        'x-component-props': {
          min: 0,
          max: 150,
          placeholder: '请输入年龄',
        },
      },
      // Switch
      active: {
        'type': 'boolean',
        'title': '是否激活',
        'x-decorator': 'FormItem',
        'x-component': 'Switch',
        'x-component-props': {
          activeText: '是',
          inactiveText: '否',
        },
      },
      // DatePicker
      birthday: {
        'type': 'string',
        'title': '生日',
        'x-decorator': 'FormItem',
        'x-component': 'DatePicker',
        'x-component-props': {
          placeholder: '请选择日期',
          format: 'YYYY-MM-DD',
          type: 'date',
        },
      },
    },
  },
  arrayTest: {
    type: 'object',
    properties: {
      users: {
        'type': 'array',
        'title': '用户列表',
        'x-decorator': 'FormItem',
        'x-component': 'Array',
        'x-component-props': {
          title: '用户数组',
        },
        'items': {
          'type': 'object',
          'x-component': 'ArrayItem',
          'properties': {
            name: {
              'type': 'string',
              'title': '姓名',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '请输入姓名',
              },
            },
            email: {
              'type': 'string',
              'title': '邮箱',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '请输入邮箱',
              },
            },
          },
        },
      },
    },
  },
}

// 加载测试 Schema
const loadTestSchema = (schemaName: keyof typeof testSchemas) => {
  schema.value = testSchemas[schemaName] as ISchema
}
</script>

<template>
  <div class="app-container">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <h2>Formily Designer Playground</h2>
      </div>
      <div class="toolbar-right">
        <!-- 测试 Schema 按钮 -->
        <ElButton @click="loadTestSchema('basic')">
          基础表单
        </ElButton>
        <ElButton @click="loadTestSchema('comprehensive')">
          综合示例
        </ElButton>
        <ElButton @click="loadTestSchema('arrayTest')">
          数组测试
        </ElButton>

        <!-- 模式切换 -->
        <ElButton :type="mode === 'edit' ? 'primary' : ''" @click="toggleMode">
          {{ mode === 'edit' ? '编辑模式' : '预览模式' }}
        </ElButton>

        <!-- 获取数据 -->
        <ElButton v-if="mode === 'preview'" @click="getValues">
          获取表单值
        </ElButton>
        <ElButton @click="getSchema">
          获取 Schema
        </ElButton>
      </div>
    </div>

    <!-- Designer 组件 -->
    <div class="designer-wrapper">
      <Designer
        ref="designerRef"
        v-model="schema"
        :mode="mode"
        :components="{
          Input,
          Array,
          ArrayItem,
          Select,
          Checkbox,
          Radio,
          DatePicker,
          TextArea,
          Switch,
          InputNumber,
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.toolbar-left h2 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.designer-wrapper {
  flex: 1;
  overflow: hidden;
}
</style>
