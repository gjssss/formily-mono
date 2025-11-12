<script setup lang="ts">
import type { ISchema } from '@formily/vue'
import { computed, ref } from 'vue'

interface Dependency {
  source: string // 依赖的字段路径
  property: string // 依赖的属性（value/display/pattern等）
  name: string // 变量名
  type: string // 类型
}

interface StateRule {
  state: string // 状态属性（visible/disabled/readOnly/value等）
  expression: string // JS 表达式
}

const props = defineProps<{
  modelValue: boolean
  schema: ISchema // 整个表单的 schema
  currentFieldName: string | null // 当前选中的字段名
  initialReactions?: any // 初始的 x-reactions 配置
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'save': [reactions: any]
}>()

// 弹窗显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

// 依赖列表
const dependencies = ref<Dependency[]>([])

// 状态规则列表
const stateRules = ref<StateRule[]>([])

// 状态属性选项
const stateOptions = [
  { label: '显示/隐藏 (visible)', value: 'visible' },
  { label: '禁用 (disabled)', value: 'disabled' },
  { label: '只读 (readOnly)', value: 'readOnly' },
  { label: '值 (value)', value: 'value' },
  { label: '显示模式 (display)', value: 'display' },
  { label: '模式 (pattern)', value: 'pattern' },
  { label: '必填 (required)', value: 'required' },
  { label: '标题 (title)', value: 'title' },
  { label: '描述 (description)', value: 'description' },
]

// 属性选项
const propertyOptions = [
  { label: '值 (value)', value: 'value' },
  { label: '显示模式 (display)', value: 'display' },
  { label: '模式 (pattern)', value: 'pattern' },
  { label: '初始值 (initialValue)', value: 'initialValue' },
  { label: '错误信息 (errors)', value: 'errors' },
  { label: '验证状态 (valid)', value: 'valid' },
]

// 类型选项
const typeOptions = [
  { label: '任意类型 (any)', value: 'any' },
  { label: '字符串 (string)', value: 'string' },
  { label: '数字 (number)', value: 'number' },
  { label: '布尔值 (boolean)', value: 'boolean' },
  { label: '数组 (array)', value: 'array' },
  { label: '对象 (object)', value: 'object' },
]

// 构建字段树（用于字段选择器）
const fieldTree = computed(() => {
  function buildTree(properties: Record<string, ISchema> | undefined, parentPath = '') {
    if (!properties)
      return []

    const nodes: any[] = []

    Object.entries(properties).forEach(([key, schema]) => {
      const path = parentPath ? `${parentPath}.${key}` : key
      const title = (schema.title as string) || key

      // 排除当前字段及其子字段
      if (path === props.currentFieldName || path.startsWith(`${props.currentFieldName}.`)) {
        return
      }

      const node: any = {
        value: path,
        label: `${title} (${key})`,
        children: undefined,
      }

      // 如果有子字段，递归构建
      if (schema.properties) {
        const children = buildTree(schema.properties as Record<string, ISchema>, path)
        if (children.length > 0) {
          node.children = children
        }
      }

      nodes.push(node)
    })

    return nodes
  }

  return buildTree(props.schema?.properties as Record<string, ISchema>)
})

// 初始化数据
function initializeData() {
  const reactions = props.initialReactions

  if (!reactions) {
    dependencies.value = []
    stateRules.value = []
    return
  }

  // 解析 dependencies
  if (reactions.dependencies && Array.isArray(reactions.dependencies)) {
    dependencies.value = reactions.dependencies.map((dep: any) => ({
      source: dep.source || '',
      property: dep.property || 'value',
      name: dep.name || '',
      type: dep.type || 'any',
    }))
  }

  // 解析 fulfill.state
  if (reactions.fulfill?.state) {
    stateRules.value = Object.entries(reactions.fulfill.state).map(([state, expression]) => ({
      state,
      expression: String(expression).replace(/^\{\{|\}\}$/g, '').trim(),
    }))
  }
}

// 监听弹窗打开，初始化数据
function handleOpen() {
  initializeData()
}

// 添加依赖
function addDependency() {
  dependencies.value.push({
    source: '',
    property: 'value',
    name: '',
    type: 'any',
  })
}

// 删除依赖
function removeDependency(index: number) {
  dependencies.value.splice(index, 1)
}

// 当选择字段时，自动生成变量名
function handleFieldChange(dep: Dependency) {
  if (!dep.name && dep.source) {
    // 自动生成变量名：fieldName_property
    const fieldName = dep.source.split('.').pop() || dep.source
    dep.name = `${fieldName}_${dep.property}`
  }
}

// 添加状态规则
function addStateRule() {
  stateRules.value.push({
    state: 'visible',
    expression: '',
  })
}

// 删除状态规则
function removeStateRule(index: number) {
  stateRules.value.splice(index, 1)
}

// 保存配置
function handleSave() {
  // 构建 x-reactions 配置
  const reactions: any = {}

  // 构建 dependencies
  if (dependencies.value.length > 0) {
    reactions.dependencies = dependencies.value.filter(dep => dep.source).map(dep => ({
      source: dep.source,
      property: dep.property,
      name: dep.name,
      type: dep.type,
    }))
  }

  // 构建 fulfill.state
  if (stateRules.value.length > 0) {
    reactions.fulfill = {
      state: {},
    }

    stateRules.value.forEach((rule) => {
      if (rule.state && rule.expression) {
        // 添加 {{ }} 包裹表达式
        reactions.fulfill.state[rule.state] = `{{${rule.expression}}}`
      }
    })
  }

  emit('save', reactions)
  dialogVisible.value = false
}

// 取消
function handleCancel() {
  dialogVisible.value = false
}
</script>

<template>
  <ElDialog v-model="dialogVisible" title="条件渲染配置" width="800px" @open="handleOpen">
    <div class="reactions-editor">
      <!-- 依赖字段配置 -->
      <div class="section">
        <div class="section-header">
          <span class="section-title">依赖字段</span>
          <ElButton size="small" type="primary" @click="addDependency">
            添加依赖
          </ElButton>
        </div>

        <div v-if="dependencies.length === 0" class="empty-tip">
          暂无依赖字段，点击"添加依赖"按钮添加
        </div>

        <div v-else class="dependency-list">
          <div v-for="(dep, index) in dependencies" :key="index" class="dependency-item">
            <div class="dependency-header">
              <span class="dependency-index">依赖 {{ index + 1 }}</span>
              <ElButton size="small" type="danger" text @click="removeDependency(index)">
                删除
              </ElButton>
            </div>

            <ElForm label-width="80px">
              <ElFormItem label="字段">
                <ElTreeSelect
                  v-model="dep.source" :data="fieldTree" placeholder="选择依赖的字段" clearable check-strictly
                  :render-after-expand="false" @change="handleFieldChange(dep)"
                />
              </ElFormItem>

              <ElFormItem label="属性">
                <ElSelect v-model="dep.property" placeholder="选择属性" @change="handleFieldChange(dep)">
                  <ElOption v-for="opt in propertyOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                </ElSelect>
              </ElFormItem>

              <ElFormItem label="变量名">
                <ElInput v-model="dep.name" placeholder="在表达式中使用的变量名" />
              </ElFormItem>

              <ElFormItem label="类型">
                <ElSelect v-model="dep.type" placeholder="选择类型">
                  <ElOption v-for="opt in typeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                </ElSelect>
              </ElFormItem>
            </ElForm>
          </div>
        </div>
      </div>

      <!-- 状态控制配置 -->
      <div class="section">
        <div class="section-header">
          <span class="section-title">状态控制</span>
          <ElButton size="small" type="primary" @click="addStateRule">
            添加规则
          </ElButton>
        </div>

        <div v-if="stateRules.length === 0" class="empty-tip">
          暂无状态规则，点击"添加规则"按钮添加
        </div>

        <div v-else class="state-rule-list">
          <div v-for="(rule, index) in stateRules" :key="index" class="state-rule-item">
            <div class="state-rule-header">
              <span class="state-rule-index">规则 {{ index + 1 }}</span>
              <ElButton size="small" type="danger" text @click="removeStateRule(index)">
                删除
              </ElButton>
            </div>

            <ElForm label-width="80px">
              <ElFormItem label="状态属性">
                <ElSelect v-model="rule.state" placeholder="选择要控制的状态">
                  <ElOption v-for="opt in stateOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                </ElSelect>
              </ElFormItem>

              <ElFormItem label="表达式">
                <ElInput
                  v-model="rule.expression" type="textarea" :rows="2"
                  placeholder="输入 JS 表达式，如：$deps.username_value === '123'"
                />
                <div class="expression-tip">
                  使用 $deps.变量名 访问依赖字段的值
                </div>
              </ElFormItem>
            </ElForm>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <ElButton @click="handleCancel">
        取消
      </ElButton>
      <ElButton type="primary" @click="handleSave">
        保存
      </ElButton>
    </template>
  </ElDialog>
</template>

<style scoped>
.reactions-editor {
  max-height: 600px;
  overflow-y: auto;
}

.section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.empty-tip {
  padding: 20px;
  text-align: center;
  color: #909399;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.dependency-list,
.state-rule-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dependency-item,
.state-rule-item {
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.dependency-header,
.state-rule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.dependency-index,
.state-rule-index {
  font-weight: 600;
  color: #606266;
}

.expression-tip {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}

.reactions-editor :deep(.el-form-item) {
  margin-bottom: 12px;
}

.reactions-editor :deep(.el-form-item:last-child) {
  margin-bottom: 0;
}
</style>
