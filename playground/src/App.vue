<script setup lang="ts">
import type { ISchema } from '@formily/vue'
import { Designer, Render } from '@formily-djd/designer'
import {
  components
} from '@formily-djd/component'
import { ref, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// localStorage keys
const STORAGE_KEY_SCHEMA = 'formily-designer-schema'
const STORAGE_KEY_FAVORITES = 'formily-designer-favorites'

// 模式切换
const mode = ref<'edit' | 'preview'>('edit')

// Designer 实例引用
const designerRef = ref<any>(null)
const renderRef = ref<any>(null)

// 默认空 Schema
const getEmptySchema = (): ISchema => ({
  type: 'object',
  properties: {},
})

// Schema (v-model)
const schema = ref<ISchema>(getEmptySchema())

// 弹窗控制
const schemaDialogVisible = ref(false)
const schemaEditorText = ref('')
const isEditingSchema = ref(false)
const valuesDialogVisible = ref(false)
const formValuesEditorText = ref('')
const disabled = ref(false)
// 收藏相关
const favoritesDialogVisible = ref(false)
interface Favorite {
  id: string
  name: string
  schema: ISchema
  createdAt: string
}
const favorites = ref<Favorite[]>([])

// 初始化：从 localStorage 加载 schema 和收藏列表
onMounted(() => {
  try {
    const savedSchema = localStorage.getItem(STORAGE_KEY_SCHEMA)
    if (savedSchema) {
      schema.value = JSON.parse(savedSchema)
    }
  } catch (error) {
    console.error('加载 schema 失败:', error)
  }

  try {
    const savedFavorites = localStorage.getItem(STORAGE_KEY_FAVORITES)
    if (savedFavorites) {
      favorites.value = JSON.parse(savedFavorites)
    }
  } catch (error) {
    console.error('加载收藏列表失败:', error)
  }
})

// 监听 schema 变化，自动保存到 localStorage
watch(
  () => schema.value,
  (newSchema) => {
    try {
      localStorage.setItem(STORAGE_KEY_SCHEMA, JSON.stringify(newSchema))
    } catch (error) {
      console.error('保存 schema 失败:', error)
    }
  },
  { deep: true }
)

// 切换模式
const toggleMode = () => {
  mode.value = mode.value === 'edit' ? 'preview' : 'edit'
}

watch(mode, (nextMode) => {
  if (nextMode !== 'preview') {
    valuesDialogVisible.value = false
  }
})

// 查看/编辑表单值
const openValuesDialog = () => {
  const form = renderRef.value?.form
  if (!form) {
    ElMessage({
      message: '请先切换到预览模式并等待表单加载完成',
      type: 'warning',
    })
    return
  }

  const values = form.values ?? {}
  formValuesEditorText.value = JSON.stringify(values, null, 2)
  valuesDialogVisible.value = true
}

const applyFormValues = async () => {
  const form = renderRef.value?.form
  if (!form) {
    ElMessage({
      message: '表单未初始化，请先渲染表单',
      type: 'warning',
    })
    return
  }

  try {
    const parsedValues = formValuesEditorText.value.trim()
      ? JSON.parse(formValuesEditorText.value)
      : {}
    form.setInitialValues(parsedValues, 'overwrite')
    form.setValues(parsedValues, 'overwrite')
    await form.reset('*')
    ElMessage({
      message: '表单值已更新',
      type: 'success',
    })
    valuesDialogVisible.value = false
  }
  catch (error) {
    ElMessage({
      message: '表单值格式错误，请检查 JSON',
      type: 'error',
    })
  }
}

// 打开 Schema 弹窗（查看模式）
const openSchemaDialog = () => {
  schemaEditorText.value = JSON.stringify(schema.value, null, 2)
  isEditingSchema.value = false
  schemaDialogVisible.value = true
}

// 复制 Schema
const copySchema = async () => {
  try {
    await navigator.clipboard.writeText(schemaEditorText.value)
    ElMessage({
      message: 'Schema 已复制到剪贴板',
      type: 'success',
    })
  } catch (error) {
    ElMessage({
      message: '复制失败，请手动复制',
      type: 'error',
    })
  }
}

// 进入编辑模式
const enterEditMode = () => {
  isEditingSchema.value = true
}

// 保存编辑后的 Schema
const saveSchema = () => {
  try {
    const newSchema = JSON.parse(schemaEditorText.value)
    schema.value = newSchema
    isEditingSchema.value = false
    ElMessage({
      message: 'Schema 已更新',
      type: 'success',
    })
  } catch (error) {
    ElMessage({
      message: 'Schema 格式错误，请检查 JSON 格式',
      type: 'error',
    })
  }
}

// 取消编辑
const cancelEdit = () => {
  schemaEditorText.value = JSON.stringify(schema.value, null, 2)
  isEditingSchema.value = false
}

// 清空 Schema
const clearSchema = () => {
  ElMessageBox.confirm('确定要清空当前 Schema 吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    schema.value = getEmptySchema()
    ElMessage({
      message: 'Schema 已清空',
      type: 'success',
    })
  }).catch(() => {
    // 取消操作
  })
}

// 添加收藏
const addToFavorites = () => {
  ElMessageBox.prompt('请输入收藏名称', '添加收藏', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /\S+/,
    inputErrorMessage: '收藏名称不能为空',
  }).then(({ value }) => {
    const newFavorite: Favorite = {
      id: Date.now().toString(),
      name: value,
      schema: JSON.parse(JSON.stringify(schema.value)), // 深拷贝
      createdAt: new Date().toLocaleString(),
    }
    favorites.value.push(newFavorite)
    saveFavoritesToStorage()
    ElMessage({
      message: '收藏成功',
      type: 'success',
    })
  }).catch(() => {
    // 取消操作
  })
}

// 打开收藏列表
const openFavorites = () => {
  favoritesDialogVisible.value = true
}

// 应用收藏的 Schema
const applyFavorite = (favorite: any) => {
  ElMessageBox.confirm('确定要应用此收藏吗？当前 Schema 将被替换。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    schema.value = JSON.parse(JSON.stringify(favorite.schema))
    favoritesDialogVisible.value = false
    ElMessage({
      message: '已应用收藏',
      type: 'success',
    })
  }).catch(() => {
    // 取消操作
  })
}

// 删除收藏
const deleteFavorite = (id: string) => {
  ElMessageBox.confirm('确定要删除此收藏吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    favorites.value = favorites.value.filter(f => f.id !== id)
    saveFavoritesToStorage()
    ElMessage({
      message: '删除成功',
      type: 'success',
    })
  }).catch(() => {
    // 取消操作
  })
}

// 保存收藏列表到 localStorage
const saveFavoritesToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites.value))
  } catch (error) {
    console.error('保存收藏列表失败:', error)
  }
}

// 切换禁用状态
const toggleDisabled = () => {
  disabled.value = !disabled.value
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
        <!-- Schema 管理 -->
        <ElButton type="primary" @click="openSchemaDialog">
          查看 Schema
        </ElButton>
        <ElButton @click="clearSchema">
          清空
        </ElButton>

        <!-- 收藏管理 -->
        <ElButton @click="addToFavorites">
          收藏当前 Schema
        </ElButton>
        <ElButton @click="openFavorites">
          我的收藏
        </ElButton>

        <!-- 模式切换 -->
        <ElButton :type="mode === 'edit' ? 'primary' : ''" @click="toggleMode">
          {{ mode === 'edit' ? '编辑模式' : '预览模式' }}
        </ElButton>

        <!-- 查看表单值 -->
        <ElButton v-if="mode === 'preview'" @click="openValuesDialog">
          查看表单值
        </ElButton>

        <ElButton @click="toggleDisabled">
          切换禁用状态
        </ElButton>
      </div>
    </div>

    <!-- Designer 组件 -->
    <div class="designer-wrapper">
      <Designer ref="designerRef" v-if="mode === 'edit'" v-model="schema" gap="16px" height="calc(100vh - 57px)" :components="{
        ...components
      }" />
      <div v-if="mode === 'preview'" style="padding: 16px; height: calc(100vh - 57px); overflow-y: auto; box-sizing: border-box;">
        <Render
        ref="renderRef"
          :schema="schema"
          :components="components"
          :disabled="disabled"
        />
      </div>
    </div>

    <!-- 表单值弹窗 -->
    <ElDialog v-model="valuesDialogVisible" title="表单值" width="50%" :close-on-click-modal="false">
      <ElInput
        v-model="formValuesEditorText"
        type="textarea"
        :rows="18"
        placeholder="表单值 JSON"
        style="font-family: 'Courier New', monospace; font-size: 13px;"
      />
      <template #footer>
        <div class="dialog-footer">
          <ElButton @click="valuesDialogVisible = false">取消</ElButton>
          <ElButton type="primary" @click="applyFormValues">应用</ElButton>
        </div>
      </template>
    </ElDialog>

    <!-- Schema 弹窗 -->
    <ElDialog v-model="schemaDialogVisible" title="Schema 编辑器" width="60%" :close-on-click-modal="false">
      <div class="schema-editor">
        <ElInput v-model="schemaEditorText" type="textarea" :rows="20" :readonly="!isEditingSchema"
          placeholder="Schema JSON" style="font-family: 'Courier New', monospace; font-size: 13px;" />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <div v-if="!isEditingSchema">
            <ElButton @click="copySchema">复制</ElButton>
            <ElButton type="primary" @click="enterEditMode">编辑</ElButton>
            <ElButton @click="schemaDialogVisible = false">关闭</ElButton>
          </div>
          <div v-else>
            <ElButton @click="cancelEdit">取消</ElButton>
            <ElButton type="primary" @click="saveSchema">保存</ElButton>
          </div>
        </div>
      </template>
    </ElDialog>

    <!-- 收藏列表弹窗 -->
    <ElDialog v-model="favoritesDialogVisible" title="我的收藏" width="50%">
      <div v-if="favorites.length === 0" class="empty-favorites">
        <p>暂无收藏</p>
      </div>
      <div v-else class="favorites-list">
        <div v-for="favorite in favorites" :key="favorite.id" class="favorite-item">
          <div class="favorite-info">
            <div class="favorite-name">{{ favorite.name }}</div>
            <div class="favorite-time">{{ favorite.createdAt }}</div>
          </div>
          <div class="favorite-actions">
            <ElButton size="small" type="primary" @click="applyFavorite(favorite)">
              应用
            </ElButton>
            <ElButton size="small" type="danger" @click="deleteFavorite(favorite.id)">
              删除
            </ElButton>
          </div>
        </div>
      </div>
    </ElDialog>
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

/* Schema 编辑器样式 */
.schema-editor {
  margin-bottom: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

/* 收藏列表样式 */
.empty-favorites {
  text-align: center;
  padding: 40px 0;
  color: #909399;
}

.favorites-list {
  max-height: 500px;
  overflow-y: auto;
}

.favorite-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
  transition: background-color 0.3s;
}

.favorite-item:hover {
  background-color: #f5f7fa;
}

.favorite-item:last-child {
  border-bottom: none;
}

.favorite-info {
  flex: 1;
}

.favorite-name {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.favorite-time {
  font-size: 12px;
  color: #909399;
}

.favorite-actions {
  display: flex;
  gap: 8px;
}
</style>
