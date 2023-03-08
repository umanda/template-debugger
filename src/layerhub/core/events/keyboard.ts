import { FabricCanvas } from "../common/interfaces"
import { type Editor } from "../editor/editor"
import Shortcuts from "../utils/shortcuts"

interface Options {
  editor: Editor
  canvas: FabricCanvas
}

class Keryboard {
  private editor: Editor
  private canvas: FabricCanvas
  constructor(options: Options) {
    this.editor = options.editor
    this.canvas = options.canvas
    this.initialize()
  }

  public initialize() {
    this.enableEvents()
  }
  public destroy() {
    this.disableEvents()
  }

  public enableEvents() {
    this.editor.config.shortcuts && this.canvas.wrapperEl.addEventListener("keydown", this.onKeyDown.bind(this), false)
  }

  public disableEvents() {
    this.editor.config.shortcuts && this.canvas.wrapperEl.removeEventListener("keydown", this.onKeyDown.bind(this))
  }

  private onKeyDown(event: KeyboardEvent) {
    const shortcuts = Shortcuts()
    if (shortcuts.isCtrlZero(event)) {
      event.preventDefault()
      const fitRatio = this.editor.design.activeScene.getFitRatio()
      this.editor.zoom.zoomToFit(fitRatio)
    } else if (shortcuts.isCtrlMinus(event)) {
      event.preventDefault()
      this.editor.zoom.zoomIn()
    } else if (shortcuts.isCtrlEqual(event)) {
      event.preventDefault()
      this.editor.zoom.zoomOut()
    } else if (shortcuts.isCtrlOne(event)) {
      event.preventDefault()
      this.editor.zoom.zoomToOne()
    } else if (shortcuts.isCtrlZ(event)) {
      this.editor.design.activeScene.history.undo()
    } else if (shortcuts.isCtrlShiftZ(event)) {
      this.editor.design.activeScene.history.redo()
    } else if (shortcuts.isCtrlY(event)) {
      this.editor.design.activeScene.history.redo()
    } else if (shortcuts.isCtrlA(event)) {
      event.preventDefault()
      this.editor.design.activeScene.objects.select()
    } else if (shortcuts.isDelete(event)) {
      event.preventDefault()
      this.editor.design.activeScene.objects.remove()
    } else if (shortcuts.isCtrlC(event)) {
      event.preventDefault()
      this.editor.design.activeScene.objects.copy()
    } else if (shortcuts.isCtrlV(event)) {
      event.preventDefault()
      this.editor.design.activeScene.objects.paste()
    } else if (shortcuts.isCtrlX(event)) {
      event.preventDefault()
      this.editor.design.activeScene.objects.cut()
    }
  }
}

export default Keryboard
