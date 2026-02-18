import type { DesignerAdapter } from './core/adapter'
import { Bottom, CirclePlus, CopyDocument, Delete, FolderAdd, Search, Top } from '@element-plus/icons-vue'
import { ArrayItems, Checkbox, FormItem, Input, InputNumber, Radio, Select, Space, Switch } from '@formily/element-plus'

export const elementPlusAdapter: DesignerAdapter = {
  setterComponents: {
    ArrayItems,
    Checkbox,
    FormItem,
    Input,
    InputNumber,
    Radio,
    Select,
    Space,
    Switch,
  },
  icons: {
    Bottom,
    CirclePlus,
    CopyDocument,
    Delete,
    FolderAdd,
    Search,
    Top,
  },
}
