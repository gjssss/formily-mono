import type { ISchema } from '@formily/vue'
import type { IDragNode, IPoint, IRect } from './dragon'
import type { DesignStore } from './types'
import {
  deleteByPath,
  getByPath,
  getFieldNameFromPath,
  insertFieldByPath,
  setByPath,
} from '@formily-djd/utils'
import { provide, ref } from 'vue'
import { ClosestPosition, Dragon } from './dragon'
import { DesignStoreKey } from './types'

/**
 * 创建设计器状态（在 Designer 根组件中使用）
 *
 * 用法：
 * ```vue
 * <script setup>
 * const store = useCreateDesignStore()
 * </script>
 * ```
 */
export function useCreateDesignStore(): DesignStore {
  // ========== 基础响应式状态 ==========
  const formSchema = ref<any>({
    type: 'object',
    properties: {},
  })
  const selectedFieldName = ref<string | null>(null)
  const selectedNodeId = ref<string | null>(null)
  const hoveredNodeId = ref<string | null>(null)

  // ========== 拖拽响应式状态 ==========
  const isDragging = ref(false)
  const dragNodes = ref<IDragNode[]>([])
  const touchNode = ref<string | null>(null)
  const closestNode = ref<string | null>(null)
  const closestPosition = ref<ClosestPosition>(ClosestPosition.Before)

  // ========== 获取节点矩形的辅助函数 ==========
  /**
   * 获取节点的 DOM 元素矩形（相对于画布容器）
   */
  function getNodeRect(nodePath: string): IRect | null {
    const element = document.querySelector(`[data-node-id="${nodePath}"]`)
    if (!element)
      return null

    const canvasContainer = document.querySelector('.canvas-content')
    if (!canvasContainer)
      return null

    const elementRect = element.getBoundingClientRect()
    const canvasRect = canvasContainer.getBoundingClientRect()

    return {
      x: elementRect.x - canvasRect.x,
      y: elementRect.y - canvasRect.y,
      width: elementRect.width,
      height: elementRect.height,
    }
  }

  /**
   * 获取画布容器的矩形
   */
  function getCanvasRect(): IRect {
    const canvasContainer = document.querySelector('.canvas-content')
    if (!canvasContainer) {
      return { x: 0, y: 0, width: 0, height: 0 }
    }
    const rect = canvasContainer.getBoundingClientRect()
    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    }
  }

  // ========== 初始化 Dragon 引擎 ==========
  const dragon = new Dragon(
    {
      getNodeRect,
      getNodeSchema: (nodePath: string) => {
        return getByPath(formSchema.value.properties, nodePath)
      },
      getCanvasRect,
      findChildNodes: (nodePath: string) => {
        const schema = getByPath(formSchema.value.properties, nodePath)
        if (!schema)
          return []

        const children: string[] = []

        // 处理 properties
        if (schema.properties) {
          Object.keys(schema.properties).forEach((key) => {
            children.push(`${nodePath}.properties.${key}`)
          })
        }

        // 处理 items.properties（数组类型）
        if (schema.items?.properties) {
          Object.keys(schema.items.properties).forEach((key) => {
            children.push(`${nodePath}.items.properties.${key}`)
          })
        }

        return children
      },
    },
    {
      sensitive: true,
      forceBlock: false,
    },
  )

  /**
   * 添加字段到设计器
   * @param name 字段名称（作为 schema properties 的 key）
   * @param schema 字段的 Schema 定义
   */
  function addField(name: string, schema: ISchema): void {
    if (!formSchema.value.properties) {
      formSchema.value.properties = {}
    }
    formSchema.value.properties[name] = schema
  }

  /**
   * 更新字段的 Schema
   * @param name 字段名称
   * @param newSchema 新的 Schema 定义
   */
  function updateFieldSchema(name: string, newSchema: ISchema): void {
    setByPath(formSchema.value.properties, name, newSchema)
  }

  /**
   * 选中字段
   * @param name 字段名称
   */
  function selectField(name: string | null): void {
    selectedFieldName.value = name
  }

  /**
   * 获取当前选中的字段 Schema
   */
  function getSelectedField(): ISchema | null {
    if (!selectedFieldName.value)
      return null
    return getByPath(formSchema.value.properties, selectedFieldName.value) || null
  }

  /**
   * 选中节点（通过节点 ID）
   * @param nodeId 节点 ID（完整路径）
   */
  function selectNode(nodeId: string | null): void {
    selectedNodeId.value = nodeId
    selectedFieldName.value = nodeId
  }

  /**
   * 设置悬浮的节点
   * @param nodeId 节点 ID（字段路径）
   */
  function setHover(nodeId: string | null): void {
    hoveredNodeId.value = nodeId
  }

  // ========== 拖拽方法 ==========

  /**
   * 开始拖拽
   * @param nodes 拖拽的节点数据
   */
  function startDrag(nodes: IDragNode[]): void {
    isDragging.value = true
    dragNodes.value = nodes
    dragon.setDragNodes(nodes)
  }

  /**
   * 更新拖拽位置
   * @param point 鼠标位置
   * @param touch 触摸的节点路径
   */
  function updateDragPosition(point: IPoint, touch?: string): void {
    if (!isDragging.value)
      return

    if (touch !== undefined) {
      touchNode.value = touch
    }

    // Dragon 引擎计算位置
    dragon.calculate({
      point,
      touchNode: touchNode.value || undefined,
    })

    // 同步 Dragon 的计算结果到 Store
    closestNode.value = dragon.closestNode.value
    closestPosition.value = dragon.closestPosition.value
  }

  /**
   * 执行放置（插入或移动）
   */
  function drop(): void {
    if (!isDragging.value)
      return

    const target = closestNode.value
    const position = closestPosition.value

    if (!target) {
      cancelDrag()
      return
    }

    // 检查是否为 Forbid 状态
    if (position.includes('FORBID')) {
      cancelDrag()
      return
    }

    const nodes = dragNodes.value

    if (nodes.length === 0) {
      // 从物料库拖拽（由外部处理）
      cancelDrag()
      return
    }

    // 画布内移动
    if (nodes.length === 1) {
      moveField(nodes[0].nodePath, target, position)
    }

    cancelDrag()
  }

  /**
   * 取消拖拽
   */
  function cancelDrag(): void {
    isDragging.value = false
    dragNodes.value = []
    touchNode.value = null
    closestNode.value = null
    closestPosition.value = ClosestPosition.Before
    dragon.clear()
  }

  /**
   * 移动字段到新位置
   * @param sourcePath 源路径
   * @param targetPath 目标路径
   * @param position 插入位置
   */
  function moveField(
    sourcePath: string,
    targetPath: string,
    position: ClosestPosition,
  ): void {
    // 1. 删除源节点
    const sourceSchema = deleteByPath(formSchema.value.properties, sourcePath)
    if (!sourceSchema)
      return

    // 2. 根据位置插入
    const fieldName = getFieldNameFromPath(sourcePath)

    if (
      position === ClosestPosition.Inner
      || position === ClosestPosition.InnerAfter
      || position === ClosestPosition.InnerBefore
    ) {
      // 插入到容器内部
      const targetSchema = getByPath(formSchema.value.properties, targetPath)
      if (!targetSchema)
        return

      if (!targetSchema.properties) {
        targetSchema.properties = {}
      }

      if (position === ClosestPosition.InnerBefore) {
        // 插入到第一个位置
        const newProperties = {
          [fieldName]: sourceSchema,
          ...targetSchema.properties,
        }
        targetSchema.properties = newProperties
      }
      else {
        // Inner 或 InnerAfter：插入到末尾
        targetSchema.properties[fieldName] = sourceSchema
      }
    }
    else {
      // 作为兄弟节点插入
      const insertPosition
        = position === ClosestPosition.Before || position === ClosestPosition.Upper
          ? 'before'
          : 'after'

      insertFieldByPath(
        formSchema.value.properties,
        targetPath,
        fieldName,
        sourceSchema,
        insertPosition,
      )
    }
  }

  /**
   * 在指定位置插入新字段
   * @param targetPath 目标路径（可为 null，表示插入到根）
   * @param fieldName 新字段名
   * @param schema 字段 Schema
   * @param position 插入位置
   */
  function insertField(
    targetPath: string | null,
    fieldName: string,
    schema: ISchema,
    position: ClosestPosition,
  ): void {
    if (!targetPath) {
      // 插入到根（空画布）
      if (!formSchema.value.properties) {
        formSchema.value.properties = {}
      }
      formSchema.value.properties[fieldName] = schema
      return
    }

    // 根据位置插入
    if (
      position === ClosestPosition.Inner
      || position === ClosestPosition.InnerAfter
      || position === ClosestPosition.InnerBefore
    ) {
      // 插入到容器内部
      const targetSchema = getByPath(formSchema.value.properties, targetPath)
      if (!targetSchema)
        return

      if (!targetSchema.properties) {
        targetSchema.properties = {}
      }

      if (position === ClosestPosition.InnerBefore) {
        // 插入到第一个位置
        const newProperties = {
          [fieldName]: schema,
          ...targetSchema.properties,
        }
        targetSchema.properties = newProperties
      }
      else {
        // Inner 或 InnerAfter：插入到末尾
        targetSchema.properties[fieldName] = schema
      }
    }
    else {
      // 作为兄弟节点插入
      const insertPosition
        = position === ClosestPosition.Before || position === ClosestPosition.Upper
          ? 'before'
          : 'after'

      insertFieldByPath(
        formSchema.value.properties,
        targetPath,
        fieldName,
        schema,
        insertPosition,
      )
    }
  }

  /**
   * 获取节点的 Schema
   * @param nodePath 节点路径
   */
  function getNodeSchema(nodePath: string): any {
    return getByPath(formSchema.value.properties, nodePath)
  }

  /**
   * 查找节点的所有子节点路径
   * @param nodePath 节点路径
   */
  function findChildNodes(nodePath: string): string[] {
    const schema = getByPath(formSchema.value.properties, nodePath)
    if (!schema)
      return []

    const children: string[] = []

    // 处理 properties
    if (schema.properties) {
      Object.keys(schema.properties).forEach((key) => {
        const childPath = nodePath
          ? `${nodePath}.properties.${key}`
          : key
        children.push(childPath)
      })
    }

    // 处理 items.properties（数组类型）
    if (schema.items?.properties) {
      Object.keys(schema.items.properties).forEach((key) => {
        const childPath = `${nodePath}.items.properties.${key}`
        children.push(childPath)
      })
    }

    return children
  }

  // 创建 store 对象
  const store: DesignStore = {
    // 基础状态
    formSchema,
    selectedFieldName,
    selectedNodeId,
    hoveredNodeId,
    // 拖拽状态
    dragon,
    isDragging,
    dragNodes,
    touchNode,
    closestNode,
    closestPosition,
    // 基础方法
    addField,
    updateFieldSchema,
    selectField,
    selectNode,
    getSelectedField,
    setHover,
    // 拖拽方法
    startDrag,
    updateDragPosition,
    drop,
    cancelDrag,
    moveField,
    insertField,
    getNodeSchema,
    findChildNodes,
  }

  // 提供给子组件
  provide(DesignStoreKey, store)

  return store
}
