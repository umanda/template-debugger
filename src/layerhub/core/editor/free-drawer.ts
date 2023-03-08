import { fabric } from "fabric"
import { FabricCanvas } from "../common/interfaces"
import * as brushes from "./brushes"
import { type Editor } from "./editor"

type BrushType = "CrayonBrush" | "SpraypaintBrush" | "MarkerBrush" | "RibbonBrush" | "PencilBrush" | "EraserBrush"

interface BrushOptions {
  size: number
  color: string
  opacity: number
  shadeDistance?: number
}

class FreeDrawer {
  constructor(public canvas: FabricCanvas, private editor: Editor) {}
  public enable(type: BrushType, options: Partial<BrushOptions>) {
    if (type === "EraserBrush") {
      // @ts-ignore
      this.canvas.freeDrawingBrush = new fabric.EraserBrush(this.canvas)
      //  optional
      this.canvas.freeDrawingBrush.width = options.size!
      this.canvas.isDrawingMode = true
    } else {
      const Brush = brushes[type]
      this.canvas.freeDrawingBrush = new Brush(
        this.canvas,
        Object.assign({}, { width: 1, color: "#000", opacity: 1 }, { ...options, width: options.size })
      )

      this.canvas.isDrawingMode = true
      this.canvas.discardActiveObject()
      this.canvas.requestRenderAll()
      this.editor.state.setIsFreeDrawing(true)
    }
  }
  public disable() {
    this.canvas.isDrawingMode = false
    this.editor.state.setIsFreeDrawing(false)
    this.canvas.requestRenderAll()
    this.editor.design.activeScene.history.save()
  }
}

export default FreeDrawer
