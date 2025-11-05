# Dev Container 配置

本项目配置了 VS Code Dev Container，可以提供一致的开发环境。

## 功能特性

### 基础环境
- **Node.js 22**: 最新的 LTS 版本
- **pnpm 10**: 项目使用的包管理器
- **Git**: 版本控制工具

### VS Code 扩展

开发容器会自动安装以下扩展：

#### Vue.js 开发
- Vue.volar - Vue 语言服务
- Vue.vscode-typescript-vue-plugin - TypeScript 和 Vue 集成

#### 代码质量
- ESLint - JavaScript/TypeScript 代码检查
- Prettier - 代码格式化
- EditorConfig - 编辑器配置
- Error Lens - 实时显示错误和警告

#### Git 工具
- GitLens - Git 增强功能
- Git Graph - Git 提交图表

#### Formily 相关
- Iconify - 图标支持
- UnoCSS - 原子化 CSS

#### 实用工具
- Path Intellisense - 路径智能提示
- Auto Rename Tag - 自动重命名标签
- TODO Highlight/Tree - TODO 高亮和管理
- Markdown All in One - Markdown 支持

#### 主题
- Vitesse Theme - Anthony Fu 的主题
- Icons Carbon - 图标

## 使用方法

### 先决条件
1. 安装 [Visual Studio Code](https://code.visualstudio.com/)
2. 安装 [Docker Desktop](https://www.docker.com/products/docker-desktop)
3. 安装 VS Code 扩展: [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### 启动 Dev Container

1. 在 VS Code 中打开项目
2. 按 `F1` 或 `Ctrl+Shift+P` (macOS: `Cmd+Shift+P`) 打开命令面板
3. 输入 "Dev Containers: Reopen in Container" 并选择
4. 等待容器构建和启动（首次启动会较慢）
5. 容器启动后会自动运行 `pnpm install` 安装依赖

### 端口转发

开发容器默认转发以下端口：
- `3000` - 常用开发服务器端口
- `5173` - Vite 默认开发服务器端口
- `5174` - Vite 备用端口

### 配置说明

#### 编辑器设置
- 保存时自动格式化
- 保存时自动修复 ESLint 问题
- TypeScript 使用工作区版本
- 针对不同文件类型使用合适的格式化器

#### 用户
容器默认使用 `node` 用户运行，避免文件权限问题。

## 自定义配置

如需修改配置，编辑 `.devcontainer/devcontainer.json` 文件。

常见自定义：
- 添加更多 VS Code 扩展到 `extensions` 数组
- 修改编辑器设置在 `settings` 对象中
- 添加更多端口转发到 `forwardPorts` 数组
- 修改 `postCreateCommand` 来改变容器创建后执行的命令

## 故障排除

### 容器启动失败
- 确保 Docker Desktop 正在运行
- 检查 Docker Desktop 资源设置（建议至少 4GB 内存）
- 尝试重建容器: `Dev Containers: Rebuild Container`

### 依赖安装失败
- 检查网络连接
- 尝试手动运行 `pnpm install`
- 清除 pnpm 缓存: `pnpm store prune`

### 扩展无法加载
- 重启 VS Code
- 重建容器
- 检查扩展 ID 是否正确

## 了解更多

- [VS Code Dev Containers 文档](https://code.visualstudio.com/docs/devcontainers/containers)
- [Dev Container 规范](https://containers.dev/)
