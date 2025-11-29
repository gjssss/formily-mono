import CanvasComponent from './canvas.vue'
import ConfigPanelComponent from './configPanel/index.vue'
import DesignerComponent from './designer.vue'
import MaterialPanelComponent from './materialPanel.vue'
import RenderComponent from './render/index.vue'

export const Canvas = CanvasComponent
export const ConfigPanel = ConfigPanelComponent
export const MaterialPanel = MaterialPanelComponent
export const Designer = DesignerComponent
export const Render = RenderComponent

// 导出 core
export * from '../core'
