import { fabric } from "fabric"
import { FabricCanvas } from "../common/interfaces"
import { type Editor } from "../editor/editor"

interface Options {
  editor: Editor
  canvas: FabricCanvas
}

class MouseWheel {
  private editor: Editor
  private canvas: FabricCanvas
  private diffTop: number
  private diffBottom: number
  private diffRight: number
  private diffLeft: number

  constructor(options: Options) {
    this.editor = options.editor
    this.canvas = options.canvas
    this.diffBottom = 0
    this.diffLeft = 0
    this.diffRight = 0
    this.diffTop = 0
    this.initialize()
  }

  public initialize() {
    this.enableEvents()
  }
  public destroy() {
    this.disableEvents()
  }

  public enableEvents() {
    this.canvas.wrapperEl.tabIndex = 1
    this.canvas.wrapperEl.style.outline = "none"

    // @ts-ignore
    this.canvas.on({
      "mouse:wheel": this.onMouseWheel
    })
  }

  public disableEvents() {
    this.canvas.off({
      "mouse:wheel": this.onMouseWheel
    })
  }

  private onMouseWheel = (event: fabric.IEvent<any>) => {
    // @ts-ignore
    if (!this.canvas.isCropping) {
      const isCtrlKey = event.e.ctrlKey
      if (isCtrlKey) {
        this.handleZoom(event)
      } else {
        this.handlePan(event)
      }
    }
  }

  public handlePan = (event: fabric.IEvent<any>) => {
    const delta = event.e.deltaY
    const isShiftKey = event.e.shiftKey
    let change = delta > 0 ? 10 : -10
    if (isShiftKey) {
      this.handleScrollX(change)
    } else if (this.editor.config.scroll.enabled) {
      this.handleScrollY(change)
    }
  }

  private handleZoom = (event: fabric.IEvent<any>) => {
    const delta = event.e.deltaY
    const canvas = this.editor.canvas.canvas
    let zoomRatio = canvas.getZoom()
    if (delta > 0) {
      zoomRatio -= 0.02
    } else {
      zoomRatio += 0.02
    }
    if (this.editor.config.zoomToMode === "CENTER") {
      this.editor.zoom.zoomToPoint(new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2), zoomRatio)
    } else {
      this.editor.zoom.zoomToPoint(new fabric.Point(event.e.offsetX, event.e.offsetY), zoomRatio)
    }

    event.e.preventDefault()
    event.e.stopPropagation()
  }

  private handleScrollX = (delta: number) => {
    if (delta > 0) {
      if (this.diffRight > this.editor.config.scroll.limit) {
        return
      }
    } else {
      if (this.diffLeft > this.editor.config.scroll.limit) {
        return
      }
    }
    let pointX = -delta
    let pointY = 0
    const point = new fabric.Point(pointX, pointY)
    this.canvas.relativePan(point)
    this.calculateScrollX()
  }

  private handleScrollY = (delta: number) => {
    if (delta > 0) {
      if (this.diffBottom > this.editor.config.scroll.limit) {
        return
      }
    } else {
      if (this.diffTop > this.editor.config.scroll.limit) {
        return
      }
    }
    let pointX = 0
    let pointY = -delta
    const point = new fabric.Point(pointX, pointY)
    this.canvas.relativePan(point)
    this.calculateScrollY()
  }

  calculateScrollY() {
    const frame = this.editor.design.activeScene.frame as any
    const zoomRatio = this.canvas.getZoom()

    const canvasHeight = this.canvas.getHeight()
    const canvasCenter = this.canvas.getCenter()

    const panningOffset = canvasCenter.top - (frame.top + frame.height / 2) * zoomRatio
    const pannintTop = this.editor.canvas.canvas.viewportTransform![5] - panningOffset

    const availableSpace = canvasHeight - frame.height * zoomRatio

    const verticalOffset = availableSpace / 2
    const offsetBottom = verticalOffset - pannintTop
    const offsetTop = verticalOffset + pannintTop

    this.diffTop = offsetTop
    this.diffBottom = offsetBottom
  }
  calculateScrollX() {
    const frame = this.editor.design.activeScene.frame as any
    const zoomRatio = this.canvas.getZoom()

    const canvasWidth = this.canvas.getWidth()
    const canvasCenter = this.canvas.getCenter()

    const panningOffset = canvasCenter.left - (frame.left + frame.width / 2) * zoomRatio
    const pannintLeft = this.editor.canvas.canvas.viewportTransform![4] - panningOffset

    const availableSpace = canvasWidth - frame.width * zoomRatio

    const horizontalOffset = availableSpace / 2
    const offsetRight = horizontalOffset - pannintLeft
    const offsetLeft = horizontalOffset + pannintLeft

    this.diffLeft = offsetLeft
    this.diffRight = offsetRight
  }
}

export default MouseWheel
