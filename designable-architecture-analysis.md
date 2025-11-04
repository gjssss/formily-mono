# Alibaba Designable 架构深度分析报告

## 一、核心发现

### 关键结论

**`designable: true` 在 Designable 中的使用非常有限，并且不是设计器的核心机制！**

## 二、三个视图的实现方式

### 1. 设计视图（DESIGNABLE View） - ComponentTreeWidget

**文件**: `/packages/prototypes/src/widgets/ComponentTreeWidget/index.tsx`

#### 实现方式

```typescript
// ComponentTreeWidget 直接渲染 Vue 组件，不使用 Formily 表单系统
const renderComponent = () => {
  const componentName = node.componentName
  const Component = componentsRef.value?.[componentName]

  return (
    <Component
      {...node.props}      // 直接传递 props
      key={node.id}
      v-slots={renderSlots()}
    >
      {renderChildren()}
    </Component>
  )
}
```

#### 关键特点

- ✅ **不使用 Formily 表单系统**
- ✅ 直接操作 **TreeNode**（Designable 的数据结构）
- ✅ 组件是**普通的 Vue 组件**，不是 Formily 字段
- ✅ Form 组件虽然内部有 `designable: true`，但在这里只是**普通 Vue 组件**

### 2. 配置面板（SettingsPanel） - SettingsForm

**文件**: `/packages/settings-form/src/SettingsForm.tsx`

#### 实现方式

```typescript
formRef.value = createForm({
  initialValues: nodeRef.value?.designerProps?.defaultProps,
  values: nodeRef.value?.props,  // ⭐ 直接绑定到节点的 props
  effects(form) {
    useSnapshot(operationRef.value, keyupRef)  // 监听变化并保存快照
  },
})
```

#### 关键特点

- ✅ 使用**普通的 Formily 表单**（**没有** `designable: true`）
- ✅ `values` 直接绑定到 `node.props`
- ✅ 表单值变化自动同步到 TreeNode
- ✅ 通过 `operation.snapshot()` 保存历史记录

### 3. 预览视图（PREVIEW View） - PreviewWidget

**文件**: `/playground/src/widgets/preview-widget.tsx`

#### 实现方式

```typescript
const formRef = shallowRef<IForm>(createForm())  // ⭐ 普通表单

return (
  <Form form={form} {...formProps}>
    <SchemaField schema={schema} />  // 使用 SchemaField 渲染
  </Form>
)
```

#### 关键特点

- ✅ 使用**普通的 Formily 表单**（**没有** `designable: true`）
- ✅ 将 TreeNode 转换为 Formily Schema
- ✅ 使用标准的 SchemaField 渲染
- ✅ 这是**真实的表单**，可以输入、校验等

## 三、`designable: true` 的真实用途

### 唯一使用位置

**文件**: `/packages/renderer/src/components/Form/preview.tsx`

```typescript
const FormComponent = observer(
  defineComponent({
    setup(props, { slots, attrs }) {
      const formRef = computed(() =>
        createForm({
          designable: true,  // ⭐ 唯一使用的地方
        })
      )
      return () => {
        return (
          <FormilyForm form={formRef.value} {...attrs}>
            {slots.default?.()}
          </FormilyForm>
        )
      }
    },
  })
)
```

### 真相揭秘

这个 Form 组件虽然内部创建了带 `designable: true` 的表单，但它**实际上不是作为 Formily 表单使用的**！

**为什么？**

1. **在 ComponentTreeWidget 中**：
   - Form 组件被当作**普通 Vue 组件**渲染
   - 不是通过 SchemaField 渲染的
   - 子组件也是直接作为 Vue 组件渲染，不是 Formily 字段

2. **`designable: true` 的副作用反而有用**：
   - ❌ 禁用响应式 → 不需要，因为不依赖 Formily 的响应式
   - ❌ 禁用 reactions → 不需要，因为没有表单逻辑
   - ✅ 允许字段覆盖 → 可能有用（虽然在这个场景中几乎用不到）
   - ✅ 跳过 DevTools → 减少干扰

## 四、Designable 的真实架构

### 数据流

```
用户操作配置面板
    ↓
SettingsForm（普通 Formily 表单）
    ↓
form.values 变化
    ↓
自动同步到 node.props（因为 values 绑定到 node.props）
    ↓
TreeNode 更新
    ↓
ComponentTreeWidget 响应式重新渲染（Vue 响应式）
    ↓
设计视图更新
```

### 关键技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 数据模型 | TreeNode (@designable/core) | 设计器的核心数据结构 |
| 设计视图 | Vue 组件 + TreeNode | 直接渲染，不用 Formily |
| 配置面板 | Formily 表单（普通模式） | 使用完整的 Formily 功能 |
| 预览视图 | Formily 表单（普通模式） | 真实的表单预览 |
| 状态同步 | Vue 响应式 + Formily values 绑定 | 不依赖 Formily 响应式 |

## 五、对你的项目的启示

### 你的设计器应该如何使用 `designable: true`？

**答案：完全不需要！**

### 推荐架构

```typescript
// ❌ 错误：在画布表单使用 designable
const canvasForm = createForm({ designable: true })

// ✅ 正确方案 1：使用普通表单 + clearFormGraph
const canvasForm = createForm()

function updateCanvas(newSchema) {
  canvasForm.clearFormGraph('*')
  canvasForm.setValues({}, 'overwrite')
  currentSchema.value = newSchema
}

// ✅ 正确方案 2：使用 Vue 的 key 强制重建
<SchemaField :schema="schema" :key="schemaVersion" />

// ✅ 正确方案 3：直接渲染组件（类似 Designable）
// 不使用 SchemaField，直接渲染 Vue 组件
<component
  :is="componentMap[node.componentType]"
  v-bind="node.props"
/>
```

### Designable 的方案（不推荐照搬）

Designable 之所以在 Form 组件中使用 `designable: true`，是因为：

1. **历史原因**：可能最初设计时考虑使用 Formily 表单系统
2. **无害的副作用**：虽然禁用了响应式，但不影响，因为本来就不依赖它
3. **减少干扰**：跳过 DevTools 注入

**但这不是必要的！** 移除 `designable: true` 也完全可以工作。

## 六、最佳实践总结

### 对于表单设计器项目

#### 1. 设计视图（画布）

**方案 A：类似 Designable（直接渲染组件）**

```vue
<template>
  <div class="canvas">
    <TreeNodeRenderer :node="rootNode" />
  </div>
</template>

<script setup>
// 直接渲染组件，不使用 Formily 表单
const TreeNodeRenderer = defineComponent({
  props: ['node'],
  setup(props) {
    return () => {
      const Component = componentMap[props.node.componentType]
      return (
        <Component {...props.node.props}>
          {props.node.children.map(child =>
            <TreeNodeRenderer node={child} />
          )}
        </Component>
      )
    }
  }
})
</script>
```

**方案 B：使用 Formily（如果需要真实交互）**

```vue
<template>
  <FormProvider :form="canvasForm">
    <SchemaField :schema="currentSchema" :key="schemaKey" />
  </FormProvider>
</template>

<script setup>
// 使用普通 Formily 表单（不要 designable: true）
const canvasForm = createForm()

function switchSchema(newSchema) {
  schemaKey.value++  // 强制重建
  currentSchema.value = newSchema
}
</script>
```

#### 2. 配置面板

```typescript
// ✅ 使用普通 Formily 表单
const settingsForm = createForm({
  values: selectedNode.value?.props,  // 绑定到节点属性
  effects() {
    onFormValuesChange((form) => {
      // 自动同步到节点
      selectedNode.value.props = form.values
    })
  }
})
```

#### 3. 预览视图

```typescript
// ✅ 使用普通 Formily 表单
const previewForm = createForm()

// 转换 TreeNode 为 Schema
const schema = computed(() => {
  return treeNodeToSchema(designerTree.value)
})
```

## 七、结论

### `designable: true` 的真相

1. **不是 Designable 的核心机制**
2. **只在一个 Form 组件中使用**
3. **即使在那里，也不是必需的**
4. **真正的核心是 TreeNode + Vue 组件直接渲染**

### 你的项目建议

**不要使用 `designable: true`！**

选择以下方案之一：

- **方案 1**：完全模仿 Designable，直接渲染 Vue 组件（不用 Formily 表单系统）
- **方案 2**：使用普通 Formily 表单 + `clearFormGraph` 或 `key`
- **方案 3**：混合方案，设计视图用方案 1，预览视图用方案 2

推荐**方案 2**，因为：
- ✅ 更简单
- ✅ 可以复用 Formily 的所有功能
- ✅ 不需要手动管理组件树
- ✅ 预览和设计视图可以共享代码

---

**最重要的一点**：Alibaba Designable 之所以复杂，是因为它是一个**通用的可视化编辑器框架**，不仅用于表单，还可以用于任意 Vue 组件的可视化编辑。如果你只是做表单设计器，完全不需要那么复杂！
