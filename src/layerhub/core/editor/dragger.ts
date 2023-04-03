import { FabricCanvas } from "../common/interfaces"
import { type Editor } from "./editor"

interface DraggerOptions {
  canvas: FabricCanvas
  editor: Editor
}
class Dragger {
  item: any
  canvas: FabricCanvas
  editor: Editor
  options: any
  constructor(options: DraggerOptions) {
    this.canvas = options.canvas
    this.editor = options.editor
    this.init()
  }

  init = () => {
    this.canvas.wrapperEl.addEventListener("dragenter", this.onDragEnter, false)
    this.canvas.wrapperEl.addEventListener("dragover", this.onDragOver, false)
    this.canvas.wrapperEl.addEventListener("dragleave", this.onDragLeave, false)
    this.canvas.wrapperEl.addEventListener("drop", this.onDrop, false)
  }
  destroy = () => {
    this.canvas.wrapperEl.removeEventListener("dragenter", this.onDragEnter)
    this.canvas.wrapperEl.removeEventListener("dragover", this.onDragOver)
    this.canvas.wrapperEl.removeEventListener("dragleave", this.onDragLeave)
    this.canvas.wrapperEl.removeEventListener("drop", this.onDrop)
  }

  onDragStart = (item: any, options?: any) => {
    this.item = item
    this.options = options
  }

  onDrop = async (e: any) => {
    if (e.preventDefault) {
      e.preventDefault()
    }
    if (e.stopPropagation) {
      e.stopPropagation()
    }
    const { layerX, layerY } = e
    const vt = this.canvas.viewportTransform as number[]
    const top = layerY / vt[0] - vt[5] / vt[0]
    const left = layerX / vt[0] - vt[4] / vt[0]

    if (this.item) {
      const object = await this.editor.design.activeScene.objects.addOnDrag(
        {
          ...this.item,
          top,
          left,
        },
        {
          desiredSize: this.options.desiredSize ? this.options.desiredSize : 250,
        }
      )
      object.set({
        top,
        left,
        originX: "center",
        originY: "center",
      })

      this.item = null
    }
    this.editor.design.activeScene.history.save()
  }

  onDragEnter = (e: DragEvent) => {}

  onDragOver = (e: DragEvent) => {
    e.preventDefault()
  }

  onDragLeave = (e: DragEvent) => {
    e.preventDefault()
  }

  onDragEnd = () => {
    this.item = null
  }
}

export default Dragger
