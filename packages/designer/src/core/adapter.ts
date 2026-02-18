import type { Component, InjectionKey } from 'vue'

export interface DesignerSetterComponents {
  ArrayItems: Component
  Checkbox: Component
  FormItem: Component
  Input: Component
  InputNumber: Component
  Radio: Component
  Select: Component
  Space: Component
  Switch: Component
}

export interface DesignerIcons {
  Bottom: Component
  CirclePlus: Component
  CopyDocument: Component
  Delete: Component
  FolderAdd: Component
  Search: Component
  Top: Component
}

export interface DesignerAdapter {
  setterComponents?: Partial<DesignerSetterComponents>
  icons?: Partial<DesignerIcons>
}

export const DesignerAdapterKey: InjectionKey<DesignerAdapter | null> = Symbol('DesignerAdapter')
