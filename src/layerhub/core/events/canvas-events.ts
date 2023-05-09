import { fabric } from "fabric"
import { LayerType } from "../common/constants"
import { FabricCanvas } from "../common/interfaces"
import { type Editor } from "../editor/editor"

interface CanvasEventsOptions {
  canvas: FabricCanvas
  editor: Editor
}
class CanvasEvents {
  private canvas: FabricCanvas
  private editor: Editor
  constructor(options: CanvasEventsOptions) {
    this.canvas = options.canvas
    this.editor = options.editor
    this.initialize()
  }

  public initialize = () => {
    this.enableEvents()
  }

  public destroy = () => {
    this.disableEvents()
  }
  public enableEvents() {
    this.canvas.wrapperEl.tabIndex = 1
    this.canvas.wrapperEl.style.outline = "none"

    // @ts-ignore
    this.canvas.on({
      "mouse:dblclick": this.onDoubleClick,
      "mouse:down": this.onMouseDown,
      "mouse:up": this.handleSelection,
      "selection:cleared": this.handleSelection,
      "selection:updated": this.handleSelection,
      "object:modified": this.objectModified,
      "background:selected": this.onBackgroundSelected,
      "crop:started": this.onCropStarted,
      "crop:finished": this.onCropFinished,
      "param:selected": this.onParamSelected,
      "added:brush": this.onBrushAdded,
      "added:eraser": this.onBrushAdded,
    })
  }

  public disableEvents() {
    this.canvas.off({
      "mouse:dblclick": this.onDoubleClick,
      "mouse:down": this.onMouseDown,
      "mouse:up": this.handleSelection,
      "selection:cleared": this.handleSelection,
      "selection:updated": this.handleSelection,
      "object:modified": this.objectModified,
      "background:selected": this.onBackgroundSelected,
      "crop:started": this.onCropStarted,
      "crop:finished": this.onCropFinished,
      "param:selected": this.onParamSelected,
      "added:brush": this.onBrushAdded,
      "added:eraser": this.onBrushAdded,
    })
  }

  private onBrushAdded = () => {
    this.editor.design.activeScene.history.save()
    this.editor.design.activeScene.objects.updateContextObjects()
  }

  private onCropStarted = (object: fabric.Object) => {
    // [TODO] move is cropping to state
    // @ts-ignore
    this.canvas.isCropping = true
    this.editor.design.activeScene.cropObject = object
    this.editor.state.setIsCropping(true)
  }

  private onCropFinished = (object: fabric.Object) => {
    // @ts-ignore
    this.canvas.isCropping = false
    this.editor.state.setIsCropping(false)
  }

  private onParamSelected = (event: any) => {
    this.editor.state.setParamMenuRequest(event)
  }

  private onDoubleClick = (event: fabric.IEvent<any>) => {
    const subTarget = event.subTargets![0]
    if (subTarget) {
      this.editor.design.activeScene.objects.select(subTarget.id)
    }
  }

  private objectModified = (event: fabric.IEvent) => {
    const { target }:any = event
    if (target instanceof fabric.Textbox) {
      const scaleY= this.scaleTextbox(target)
      Object.keys(target?.styles).map((k)=> Object.entries(target.styles[k]).forEach(([key, value]:any) => {
             if(value.fontSize)value.fontSize=value.fontSize!*scaleY!
          }))
    }
    if(target?.text===""){
      this.editor.design.activeScene.objects.remove(target.id)
    }
    // @ts-ignore
    if (!target.state) {
      this.editor.design.activeScene.history.save()
    }
  }

  private scaleTextbox = (target: fabric.Textbox) => {
    const { fontSize, width, scaleX,scaleY,styles } = target
    target.set({
      fontSize: fontSize! * scaleX!,
      width: width! * scaleX!,
      scaleX: 1,
      scaleY: 1,
    })
    return scaleY
  }

  onBackgroundSelected = () => {
    const objects = this.canvas.getObjects()
    const frame = objects[0]
    this.canvas.setActiveObject(objects[0])
    this.editor.state.setActiveObject(frame)
  }

  private onMouseDown = (e: fabric.IEvent<any>) => {
    // this.editor.objects.pasteStyle();
    if (e.button === 3) {
      this.editor.state.setContextMenuRequest({
        left: e.e.offsetX,
        top: e.e.offsetY,
        target: e.target,
      })
    } else {
      this.editor.state.setContextMenuRequest(null)
    }
  }

  private handleSelection = (target: fabric.IEvent) => {
    const state = this.editor.state
    if (target) {
      state.setActiveObject(null)
      const initialSelection = this.canvas.getActiveObject() as any
      const isNotMultipleSelection =
        (initialSelection && initialSelection.type === LayerType.GROUP.toLowerCase()) ||
        (initialSelection && initialSelection.type === LayerType.STATIC_VECTOR)
      // Handle multiple selection
      if (initialSelection && !isNotMultipleSelection && initialSelection._objects) {
        const filteredObjects = (initialSelection._objects as fabric.Object[]).filter((object) => {
          if (
            object.type === LayerType.BACKGROUND ||
            object.type === LayerType.SEPARATOR ||
            object.type === LayerType.PLACEHOLDER
          ) {
            return false
          }
          return !object.locked
        })
        this.canvas.discardActiveObject()
        if (filteredObjects.length > 0) {
          if (filteredObjects.length === 1) {
            this.canvas.setActiveObject(filteredObjects[0])
            state.setActiveObject(filteredObjects[0])
          } else {
            const activeSelection = new fabric.ActiveSelection(filteredObjects, {
              canvas: this.canvas,
            }) as fabric.Object
            this.canvas.setActiveObject(activeSelection)
            state.setActiveObject(activeSelection)
          }
        }
      } else {
        if (initialSelection) {
          if (initialSelection.clipPath && initialSelection.clipPath.type === LayerType.PLACEHOLDER) {
            initialSelection.set({ hasBorders: false, hasControls: false })
          }
        }
        state.setActiveObject(initialSelection)
      }
    } else {
      state.setActiveObject(null)
    }
    this.canvas.requestRenderAll()
  }
}

export default CanvasEvents
