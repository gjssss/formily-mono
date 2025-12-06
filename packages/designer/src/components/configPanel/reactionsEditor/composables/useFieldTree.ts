import type { ISchema } from '@formily/vue'
import type { MaybeRef } from 'vue'
import { computed, unref } from 'vue'

function buildTree(
  properties: Record<string, ISchema> | undefined,
  currentFieldName: string | null,
  parentPath = '',
) {
  if (!properties)
    return []

  const nodes: any[] = []

  Object.entries(properties).forEach(([key, schema]) => {
    const path = parentPath ? `${parentPath}.${key}` : key
    const title = (schema.title as string) || key

    if (currentFieldName && (path === currentFieldName || path.startsWith(`${currentFieldName}.`)))
      return

    const node: any = {
      value: path,
      label: `${title} (${key})`,
      children: undefined,
    }

    if (schema.properties) {
      const children = buildTree(schema.properties as Record<string, ISchema>, currentFieldName, path)
      if (children.length > 0)
        node.children = children
    }

    nodes.push(node)
  })

  return nodes
}

export function useFieldTree(schema: MaybeRef<ISchema | undefined>, currentFieldName: MaybeRef<string | null>) {
  const fieldTree = computed(() => {
    const schemaValue = unref(schema)
    const currentFieldNameValue = unref(currentFieldName)

    return buildTree(schemaValue?.properties as Record<string, ISchema> | undefined, currentFieldNameValue)
  })

  return { fieldTree }
}
