# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Formily 的动态表单设计器 Monorepo 项目，使用 pnpm workspace 管理。项目包含表单组件库、设计器引擎、工具函数和演示应用。

## 常用命令

### 构建命令
```bash
# 构建所有包（按依赖顺序）
pnpm build

# 单独构建各包
pnpm build:utils       # 构建工具包
pnpm build:component   # 构建组件包
pnpm build:designer    # 构建设计器包
pnpm build:playground  # 构建演示应用

# 开发模式（监听文件变化）
pnpm --filter @formily-djd/utils dev
pnpm --filter @formily-djd/component dev
pnpm --filter @formily-djd/designer dev
```

### 运行应用
```bash
# 启动 playground 演示应用
pnpm --filter playground dev

# 构建并预览 playground
pnpm --filter playground build
pnpm --filter playground preview
```

### 代码质量
```bash
# Lint 修复所有包
pnpm lint:fix

# 单独 lint 某个包
pnpm --filter @formily-djd/component lint
pnpm --filter @formily-djd/component lint:fix

# 类型检查
pnpm --filter @formily-djd/component typecheck
pnpm --filter @formily-djd/designer typecheck

# 运行测试
pnpm --filter @formily-djd/utils test
```

## 核心架构

### Monorepo 包结构

```
packages/
├── utils/        - 通用工具函数（如 getByPath）
├── component/    - Formily 表单组件库
└── designer/     - 可视化表单设计器引擎
playground/       - 演示和开发应用
```

**依赖关系：** utils → component → designer → playground

### 关键设计模式

#### 1. **组件四件套（FormilyComponent）**
每个组件必须包含四个部分：

```typescript
interface FormilyComponent {
  component: Component        // UI 组件（纯 Vue 组件）
  setterSchema: ISchema      // 属性配置器 Schema
  config: ComponentConfig    // 组件元数据
  defaultSchema: ISchema     // 默认 Schema 模板
}
```

**重要规则：**
- UI 组件必须是纯展示组件，只能通过 props 接收数据
- UI 组件不能直接使用 Formily API（如 useField, useForm）
- 所有 Formily 逻辑都在 SchemaWrapper 层处理

#### 2. **SchemaWrapper 机制**
SchemaWrapper 是连接 UI 组件和 Formily 的关键桥梁：

- **x-path 绑定**：使用字符串路径（如 `'title'`, `'x-component-props.placeholder'`）从 schema 提取值并绑定到组件 props
- **双向数据流**：自动处理 `value` 和 `onChange` 的绑定
- **状态映射**：将 Formily Field 状态（disabled, readOnly, pattern, errors）映射到组件 props
- **Array 操作注入**：自动注入 `onAdd`, `onRemove`, `onMoveUp` 等数组操作方法

**工作原理：**
```typescript
// 1. setter 中定义 x-path
{
  placeholder: {
    'x-component': 'Input',
    'x-path': 'x-component-props.placeholder',  // 提取路径
  }
}

// 2. SchemaWrapper 自动提取值并绑定
const bindProps = {
  placeholder: getByPath(schema, 'x-component-props.placeholder')
}

// 3. 渲染到 UI 组件
h(component, bindProps)
```

#### 3. **CanvasField 机制**
CanvasField 是设计器中的可交互节点包装器：

- **节点路径（nodePath）**：使用点分隔的路径唯一标识节点（如 `"username"`, `"array.items.properties.input"`）
- **拖拽支持**：实现拖拽移动、插入和排序功能
- **选中/悬浮状态**：与 DesignStore 同步，用于渲染选择框和悬浮框
- **容器判断**：通过 `x-droppable` 属性控制是否可以接受子组件

#### 4. **Setter Schema 规范**

**关键点：**
- Select/Radio 的选项列表必须放在 `enum` 字段（Formily 标准）
- 其他组件配置放在 `x-component-props`
- 所有 setter 字段必须使用 **直接 ISchema 定义**，不使用辅助函数封装

```typescript
// ✅ 正确：Select 选项在 enum
{
  type: {
    'x-component': 'Select',
    'x-path': 'x-component-props.type',
    'enum': [
      { label: '主要', value: 'primary' },
      { label: '成功', value: 'success' }
    ]
  }
}

// ✅ 正确：其他配置在 x-component-props
{
  maxlength: {
    'x-component': 'InputNumber',
    'x-path': 'x-component-props.maxlength',
    'x-component-props': {
      min: 0
    }
  }
}

// ❌ 错误：Select 选项不应放在 x-component-props.options
{
  type: {
    'x-component': 'Select',
    'x-path': 'x-component-props.type',
    'x-component-props': {
      options: [...]  // 错误！
    }
  }
}
```

#### 5. **DesignStore 状态管理**
设计器的核心状态管理，包含：

- **Schema 管理**：`formSchema` 是唯一数据源，所有修改都需更新此对象
- **选中状态**：`selectedNodeId` 用于选择框，`selectedFieldName` 用于配置面板
- **拖拽引擎**：Dragon 实例处理所有拖拽逻辑
- **增删改查**：`addField`, `updateFieldSchema`, `moveField`, `insertField` 等方法

### 组件开发规范

**添加新组件时必须：**

1. 创建 `packages/component/src/components/[name]/` 目录
2. 创建 `ui.vue` - 纯 UI 组件，只用 props，不用 Formily API
3. 创建 `setter.ts` - 使用 `createSetterSchema()` 定义配置器
4. 创建 `index.ts` - 导出 FormilyComponent 对象
5. 在 `packages/component/src/components/index.ts` 中导出

**Setter 编写规范：**
- 使用 `createSetterSchema()` 辅助函数统一管理通用配置
- 直接写 ISchema 对象，不使用 `createSetterItem` 等封装
- Select/Radio 选项必须在 `enum`，不在 `x-component-props`
- 必须明确指定 `x-path` 字段

**组件配置（ComponentConfig）：**
- `name`: 显示名称
- `icon`: Element Plus Icon 名称
- `category`: 分类（如 "基础", "布局", "数据录入"）
- `description`: 简短描述
- `hidden`: 设为 true 可在设计器物料面板中隐藏组件

**默认 Schema 规范：**
- 必须包含 `type` 字段（string/number/boolean/array/object/void）
- 必须包含 `x-component` 字段指向组件名
- 必须包含 `x-decorator: 'FormItem'`（除非是布局组件）
- 可选 `x-droppable: false` 标记不可接受子组件（如 Space）

### 工具函数

**`getByPath(obj, path)`** - 关键工具，SchemaWrapper 依赖此函数：
```typescript
// 支持点分隔路径访问嵌套对象
getByPath(schema, 'x-component-props.placeholder')
// 等价于 schema['x-component-props']?.placeholder
```

### 技术栈

- **构建工具**: tsdown（基于 unbuild）
- **UI 框架**: Vue 3 + Element Plus
- **表单引擎**: Formily Vue 2.x
- **样式方案**: UnoCSS + SASS
- **代码规范**: ESLint (Antfu Config)
- **类型检查**: TypeScript 5.9
- **包管理**: pnpm workspace
- **Git Hooks**: simple-git-hooks + lint-staged

## 关键注意事项

1. **x-path 绑定正确性**：修改 setter 或 defaultSchema 时，确保 x-path 路径与实际 schema 结构一致

2. **UI 组件规范**：绝不在 UI 组件中直接调用 useField/useForm，所有数据必须通过 props 传递

3. **enum vs x-component-props**：Select/Radio 的选项必须在 enum，其他配置在 x-component-props

4. **Setter 直接定义**：不使用 createSetterItem 等封装函数，直接写 ISchema 对象更清晰

5. **构建顺序**：修改 utils 后需重新构建 component 和 designer

6. **nodePath 完整性**：在 CanvasField 和 DesignStore 中，nodePath 必须完整且唯一

7. **x-droppable 标记**：容器组件可省略（默认 true），Space 等叶子组件需显式设为 false

8. **Array 组件处理**：Array 类型组件需要特殊的渲染逻辑，SchemaWrapper 会自动注入操作方法

## 常见任务

### 添加新组件
1. 在 `packages/component/src/components/` 创建组件目录
2. 实现四件套：ui.vue, setter.ts, index.ts
3. 在 `components/index.ts` 导出
4. 运行 `pnpm build:component` 构建
5. 在 playground 中测试

### 修改 Setter 配置
1. 直接修改 `setter.ts` 中的 ISchema 定义
2. 检查 x-path 是否与 defaultSchema 匹配
3. Select/Radio 选项放 enum，其他配置放 x-component-props
4. 重新构建测试

### 调试设计器
1. 启动 playground: `pnpm --filter playground dev`
2. 检查 DesignStore 状态（Vue DevTools）
3. 验证 nodePath 路径是否正确
4. 确认 SchemaWrapper 的 bindProps 是否正确映射

### 修复 x-path 问题
1. 对比 setter 中的 x-path 与 defaultSchema 结构
2. 使用 getByPath 测试路径是否能正确提取值
3. 确保 enum 用于 Select/Radio，其他用 x-component-props
4. 检查 UI 组件 props 定义是否与绑定的 key 一致
