<!-- eslint-disable regexp/no-super-linear-backtracking -->
<!-- eslint-disable regexp/prefer-w -->
<script setup lang="ts">
import type { ISchema } from '@formily/vue'
import { computed, getCurrentInstance, ref } from 'vue'

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

type SimpleOperator = 'eq' | 'neq' | 'includes' | 'notIncludes'
type SimpleConnector = 'and' | 'or'

interface SimpleCondition {
  field: string
  operator: SimpleOperator
  value: string
  connector?: SimpleConnector
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

// 选项卡
const activeTab = ref<'simple' | 'advanced'>('simple')

// 依赖列表
const dependencies = ref<Dependency[]>([])

// 状态规则列表
const stateRules = ref<StateRule[]>([])

// 简单配置条件
const simpleConditions = ref<SimpleCondition[]>([])

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

// 简单配置操作选项
const simpleOperatorOptions = [
  { label: '等于', value: 'eq' },
  { label: '不等于', value: 'neq' },
  { label: '包含', value: 'includes' },
  { label: '不包含', value: 'notIncludes' },
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

function createEmptyCondition(): SimpleCondition {
  return {
    field: '',
    operator: 'eq',
    value: '',
    connector: undefined,
  }
}

function resetSimpleConditions() {
  simpleConditions.value = [createEmptyCondition()]
}

// 初始化数据
function initializeData() {
  const reactions = props.initialReactions

  if (!reactions) {
    dependencies.value = []
    stateRules.value = []
    resetSimpleConditions()
    activeTab.value = 'simple'
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

  const parsedSimpleConditions = parseSimpleConditions(reactions)

  if (parsedSimpleConditions) {
    simpleConditions.value = parsedSimpleConditions
    activeTab.value = 'simple'
  }
  else {
    resetSimpleConditions()
    activeTab.value = 'advanced'
  }
}

function stripBraces(expression: any) {
  return String(expression).replace(/^\{\{|\}\}$/g, '').trim()
}

function stripOuterParentheses(expression: string) {
  let result = expression.trim()

  while (result.startsWith('(') && result.endsWith(')')) {
    let depth = 0
    let isWrapper = true

    for (let i = 0; i < result.length; i++) {
      if (result[i] === '(')
        depth++
      else if (result[i] === ')')
        depth--

      if (depth === 0 && i < result.length - 1) {
        isWrapper = false
        break
      }
    }

    if (isWrapper) {
      result = result.slice(1, -1).trim()
    }
    else {
      break
    }
  }

  return result
}

function literalToInputValue(literal: string) {
  const cleaned = literal.trim().replace(/^\(|\)$/g, '').trim()

  try {
    const parsed = JSON.parse(cleaned)
    if (typeof parsed === 'string')
      return parsed
    return String(parsed)
  }
  catch {
    return cleaned.replace(/^['"]|['"]$/g, '')
  }
}

function parseConditionExpression(expression: string, depNameToSource: Map<string, string>) {
  const normalized = stripOuterParentheses(expression)

  const equalsMatch = normalized.match(/^\$deps\.([a-zA-Z0-9_]+)\s*===\s*(.+)$/)
  if (equalsMatch) {
    const [, depName, valueLiteral] = equalsMatch
    const source = depNameToSource.get(depName)
    if (!source)
      return null

    return {
      field: source,
      operator: 'eq' as SimpleOperator,
      value: literalToInputValue(valueLiteral),
    }
  }

  const notEqualsMatch = normalized.match(/^\$deps\.([a-zA-Z0-9_]+)\s*!==\s*(.+)$/)
  if (notEqualsMatch) {
    const [, depName, valueLiteral] = notEqualsMatch
    const source = depNameToSource.get(depName)
    if (!source)
      return null

    return {
      field: source,
      operator: 'neq' as SimpleOperator,
      value: literalToInputValue(valueLiteral),
    }
  }

  const includesMatch = normalized.match(/^Array\.isArray\(\s*\$deps\.([a-zA-Z0-9_]+)\s*\)\s*&&\s*\$deps\.\1\.includes\((.+)\)$/)
  if (includesMatch) {
    const [, depName, valueLiteral] = includesMatch
    const source = depNameToSource.get(depName)
    if (!source)
      return null

    return {
      field: source,
      operator: 'includes' as SimpleOperator,
      value: literalToInputValue(valueLiteral),
    }
  }

  const notIncludesMatch = normalized.match(/^Array\.isArray\(\s*\$deps\.([a-zA-Z0-9_]+)\s*\)\s*&&\s*!\s*\$deps\.\1\.includes\((.+)\)$/)
  if (notIncludesMatch) {
    const [, depName, valueLiteral] = notIncludesMatch
    const source = depNameToSource.get(depName)
    if (!source)
      return null

    return {
      field: source,
      operator: 'notIncludes' as SimpleOperator,
      value: literalToInputValue(valueLiteral),
    }
  }

  return null
}

function splitExpressionByLogic(expression: string) {
  const segments: { expression: string, connector?: '&&' | '||' }[] = []
  let depth = 0
  let buffer = ''
  let i = 0

  while (i < expression.length) {
    const char = expression[i]

    if (char === '(') {
      depth++
    }
    else if (char === ')') {
      depth = Math.max(0, depth - 1)
    }

    if (depth === 0) {
      const maybeAnd = expression.slice(i, i + 2)
      if (maybeAnd === '&&' || maybeAnd === '||') {
        segments.push({ expression: buffer.trim(), connector: maybeAnd as '&&' | '||' })
        buffer = ''
        i += 2
        continue
      }
    }

    buffer += char
    i++
  }

  if (buffer.trim()) {
    segments.push({ expression: buffer.trim() })
  }

  return segments
}

function parseSimpleConditions(reactions: any): SimpleCondition[] | null {
  if (!reactions?.fulfill?.state?.visible || !Array.isArray(reactions.dependencies))
    return null

  const expression = stripBraces(reactions.fulfill.state.visible)
  if (!expression)
    return null

  const depNameToSource = new Map<string, string>()
  reactions.dependencies.forEach((dep: any) => {
    if (dep?.name && dep?.source && dep?.property === 'value') {
      depNameToSource.set(dep.name, dep.source)
    }
  })

  if (depNameToSource.size === 0)
    return null

  const singleParsed = parseConditionExpression(expression, depNameToSource)
  if (singleParsed) {
    return [{ ...singleParsed, connector: undefined }]
  }

  const segments = splitExpressionByLogic(expression)
  if (!segments.length)
    return null

  const conditions: SimpleCondition[] = []

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    const parsed = parseConditionExpression(segment.expression, depNameToSource)
    if (!parsed)
      return null

    conditions.push({
      ...parsed,
      connector: segment.connector ? (segment.connector === '||' ? 'or' : 'and') : undefined,
    })
  }

  if (conditions.length)
    conditions[conditions.length - 1].connector = undefined

  return conditions.length ? conditions : null
}

// 监听弹窗打开，初始化数据
function handleOpen() {
  initializeData()
}

// 添加简单条件
function addSimpleCondition() {
  if (simpleConditions.value.length > 0) {
    const last = simpleConditions.value[simpleConditions.value.length - 1]
    if (!last.connector)
      last.connector = 'and'
  }

  simpleConditions.value.push(createEmptyCondition())
}

// 删除简单条件
function removeSimpleCondition(index: number) {
  simpleConditions.value.splice(index, 1)

  if (!simpleConditions.value.length) {
    resetSimpleConditions()
    return
  }

  if (index > 0 && index === simpleConditions.value.length)
    simpleConditions.value[index - 1].connector = undefined
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

function normalizeInputValue(raw: string) {
  const trimmed = (raw ?? '').toString().trim()
  if (!trimmed)
    return ''

  try {
    return JSON.parse(trimmed)
  }
  catch {
    return trimmed.replace(/^['"]|['"]$/g, '')
  }
}

function formatValueLiteral(raw: string) {
  const normalized = normalizeInputValue(raw)
  return JSON.stringify(normalized)
}

function ensureDependencyName(source: string, nameMap: Map<string, string>, usedNames: Set<string>) {
  if (nameMap.has(source))
    return nameMap.get(source) as string

  const fieldName = source.split('.').pop() || source
  const baseName = `${fieldName}_value`
  let candidate = baseName
  let counter = 1

  while (usedNames.has(candidate)) {
    candidate = `${baseName}_${counter}`
    counter++
  }

  nameMap.set(source, candidate)
  usedNames.add(candidate)
  return candidate
}

function buildSimpleReactions() {
  const validConditions = simpleConditions.value
    .map((condition, index) => ({
      ...condition,
      connector: index < simpleConditions.value.length - 1 ? (condition.connector || 'and') : undefined,
    }))
    .filter(condition => condition.field && condition.value !== '')

  if (!validConditions.length)
    return null

  const dependenciesResult: Dependency[] = []
  const nameMap = new Map<string, string>()
  const usedNames = new Set<string>()
  const expressions: string[] = []

  validConditions.forEach((condition) => {
    const depName = ensureDependencyName(condition.field, nameMap, usedNames)
    if (!dependenciesResult.find(dep => dep.source === condition.field && dep.name === depName)) {
      dependenciesResult.push({
        source: condition.field,
        property: 'value',
        name: depName,
        type: 'any',
      })
    }

    const depRef = `$deps.${depName}`
    const valueLiteral = formatValueLiteral(condition.value)
    let expression = ''

    switch (condition.operator) {
      case 'eq':
        expression = `${depRef} === ${valueLiteral}`
        break
      case 'neq':
        expression = `${depRef} !== ${valueLiteral}`
        break
      case 'includes':
        expression = `Array.isArray(${depRef}) && ${depRef}.includes(${valueLiteral})`
        break
      case 'notIncludes':
        expression = `Array.isArray(${depRef}) && !${depRef}.includes(${valueLiteral})`
        break
    }

    expressions.push(`(${expression})`)
  })

  const expression = expressions.reduce((acc, curr, index) => {
    if (index === 0)
      return curr

    const connector = validConditions[index - 1].connector === 'or' ? '||' : '&&'
    return `${acc} ${connector} ${curr}`
  }, '')

  const reactions: any = {
    dependencies: dependenciesResult,
    fulfill: {
      state: {
        visible: `{{${expression}}}`,
      },
    },
  }

  return reactions
}

function buildAdvancedReactions() {
  const reactions: any = {}

  if (dependencies.value.length > 0) {
    reactions.dependencies = dependencies.value.filter(dep => dep.source).map(dep => ({
      source: dep.source,
      property: dep.property,
      name: dep.name,
      type: dep.type,
    }))
  }

  if (stateRules.value.length > 0) {
    reactions.fulfill = {
      state: {},
    }

    stateRules.value.forEach((rule) => {
      if (rule.state && rule.expression) {
        reactions.fulfill.state[rule.state] = `{{${rule.expression}}}`
      }
    })
  }

  return reactions
}

// 保存配置
function handleSave() {
  const reactions = activeTab.value === 'simple' ? buildSimpleReactions() : buildAdvancedReactions()

  if (activeTab.value === 'simple' && !reactions) {
    const vm = getCurrentInstance()
    const message = vm?.appContext.config.globalProperties?.$message as any

    if (typeof message === 'function') {
      message.warning?.('请至少添加一条完整的简单条件')
    }
    else if (typeof window !== 'undefined') {
      message.warning?.('请至少添加一条完整的简单条件')
    }

    return
  }

  emit('save', reactions || {})
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
      <ElTabs v-model="activeTab">
        <ElTabPane label="简单配置" name="simple">
          <div class="section">
            <div class="section-header">
              <span class="section-title">条件组合</span>
              <ElButton size="small" type="primary" @click="addSimpleCondition">
                添加条件
              </ElButton>
            </div>

            <div v-if="simpleConditions.length === 0" class="empty-tip">
              暂无条件，点击"添加条件"按钮添加
            </div>

            <div v-else class="simple-condition-list">
              <template v-for="(condition, index) in simpleConditions" :key="index">
                <div class="simple-condition-item">
                  <div class="simple-condition-header">
                    <span class="simple-condition-index">条件 {{ index + 1 }}</span>
                    <ElButton v-if="simpleConditions.length > 1" size="small" type="danger" text @click="removeSimpleCondition(index)">
                      删除
                    </ElButton>
                  </div>

                  <ElForm label-width="80px">
                    <ElFormItem label="字段">
                      <ElTreeSelect
                        v-model="condition.field" :data="fieldTree" placeholder="选择依赖的字段" clearable check-strictly
                        :render-after-expand="false"
                      />
                    </ElFormItem>

                    <ElFormItem label="操作">
                      <ElSelect v-model="condition.operator" placeholder="选择操作">
                        <ElOption v-for="opt in simpleOperatorOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                      </ElSelect>
                    </ElFormItem>

                    <ElFormItem label="值">
                      <ElInput v-model="condition.value" placeholder="输入匹配值" />
                    </ElFormItem>
                  </ElForm>
                </div>

                <div v-if="index < simpleConditions.length - 1" class="simple-connector">
                  <ElRadioGroup v-model="condition.connector" size="small">
                    <ElRadioButton label="and">
                      与
                    </ElRadioButton>
                    <ElRadioButton label="or">
                      或
                    </ElRadioButton>
                  </ElRadioGroup>
                </div>
              </template>
            </div>
          </div>
        </ElTabPane>

        <ElTabPane label="高级配置" name="advanced">
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
        </ElTabPane>
      </ElTabs>
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
.state-rule-list,
.simple-condition-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dependency-item,
.state-rule-item,
.simple-condition-item {
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.dependency-header,
.state-rule-header,
.simple-condition-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.dependency-index,
.state-rule-index,
.simple-condition-index {
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

.simple-connector {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.connector-label {
  color: #606266;
  font-size: 13px;
}
</style>
