export interface TreeNode {
  path: string
  label: string
  title?: string
  component?: string
  isContainer: boolean
  children?: TreeNode[]
}
