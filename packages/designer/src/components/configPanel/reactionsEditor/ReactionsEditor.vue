<script setup lang="ts">
import type { ISchema } from '@formily/vue'
import { computed, getCurrentInstance, ref, toRef } from 'vue'
import { useAdvancedRules } from './composables/useAdvancedRules'
import { useFieldTree } from './composables/useFieldTree'
import { useSimpleConditions } from './composables/useSimpleConditions'
import { propertyOptions, simpleOperatorOptions, stateOptions, typeOptions } from './constants'

const props = defineProps<{
  modelValue: boolean
  schema: ISchema
  currentFieldName: string | null
  initialReactions?: any
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'save': [reactions: any]
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const activeTab = ref<'simple' | 'advanced'>('simple')

const { fieldTree } = useFieldTree(toRef(props, 'schema'), toRef(props, 'currentFieldName'))

const {
  dependencies,
  stateRules,
  loadAdvancedConfig,
  addDependency,
  removeDependency,
  handleFieldChange,
  addStateRule,
  removeStateRule,
  buildAdvancedReactions,
} = useAdvancedRules()

const {
  simpleConditions,
  addSimpleCondition,
  removeSimpleCondition,
  resetSimpleConditions,
  loadSimpleConditions,
  buildSimpleReactions,
} = useSimpleConditions()

function initializeData() {
  const reactions = props.initialReactions
  loadAdvancedConfig(reactions)

  if (!reactions) {
    resetSimpleConditions()
    activeTab.value = 'simple'
    return
  }

  const hasSimpleConditions = loadSimpleConditions(reactions)
  activeTab.value = hasSimpleConditions ? 'simple' : 'advanced'
}

function handleOpen() {
  initializeData()
}

function handleSave() {
  const reactions = activeTab.value === 'simple'
    ? buildSimpleReactions()
    : buildAdvancedReactions()

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

<style scoped lang="scss" src="./styles/reactionsEditor.scss"></style>
