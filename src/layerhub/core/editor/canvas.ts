import { IConfig } from "@layerhub-pro/types"
import { fabric } from "fabric"
import { FabricCanvas } from "../common/interfaces"
import type { Editor } from "./editor"

interface CanvasOptions {
  id: string
  config: IConfig
  editor: Editor
}

const STATE_IDLE = "IDLE"
const STATE_PANNING = "PANNING"
class Canvas {
  private editor: Editor
  public container: HTMLDivElement
  public canvasContainer: HTMLDivElement
  public canvasElement: HTMLCanvasElement
  public canvas: FabricCanvas
  public id: string

  private options = {
    width: 0,
    height: 0
  }
  private config: IConfig

  constructor(options: CanvasOptions) {
    this.config = options.config
    this.editor = options.editor
    this.id = options.id
    this.initialize()
  }

  public initialize = () => {
    const canvas = new fabric.Canvas(this.id, {
      backgroundColor: this.config.canvas.color,
      preserveObjectStacking: true,
      fireRightClick: true,
      height: this.config.canvas.size!.height,
      width: this.config.canvas.size!.width
    })

    this.canvas = canvas as FabricCanvas

    this.canvas.disableEvents = function () {
      if (this.__fire === undefined) {
        this.__fire = this.fire
        // @ts-ignore
        this.fire = function () {}
      }
    }

    this.canvas.enableEvents = function () {
      if (this.__fire !== undefined) {
        this.fire = this.__fire
        this.__fire = undefined
      }
    }
  }

  public destroy = () => {}

  public resize({ width, height }: any) {
    this.canvas.setWidth(width).setHeight(height)
    this.canvas.renderAll()
    const diffWidth = width / 2 - this.options.width / 2
    const diffHeight = height / 2 - this.options.height / 2

    this.options.width = width
    this.options.height = height

    const deltaPoint = new fabric.Point(diffWidth, diffHeight)
    this.canvas.relativePan(deltaPoint)
  }

  public getBoundingClientRect() {
    const canvasEl = document.getElementById("canvas")
    const position = {
      left: canvasEl?.getBoundingClientRect().left,
      top: canvasEl?.getBoundingClientRect().top
    }
    return position
  }

  public requestRenderAll() {
    this.canvas.requestRenderAll()
  }

  public get backgroundColor() {
    return this.canvas.backgroundColor
  }

  public setBackgroundColor(color: string) {
    this.canvas.setBackgroundColor(color, () => {
      this.canvas.requestRenderAll()
      this.editor.emit("canvas:updated")
    })
  }

  public toggleDragMode(dragMode: "PANNING" | "IDDLE") {
    let lastClientX: number
    let lastClientY: number
    let state = STATE_IDLE

    const canvas = this.canvas
    if (dragMode === "PANNING") {
      // Discard any active object
      canvas.discardActiveObject()
      // Set the cursor to 'move'
      canvas.defaultCursor = "move"
      // Loop over all objects and disable events / selectable. We remember its value in a temp variable stored on each object
      canvas.forEachObject(function (object) {
        // @ts-ignore
        object.prevEvented = object.evented
        // @ts-ignore
        object.prevSelectable = object.selectable
        object.set("hoverCursor", "move")
        // object.set = "crosshair"
        object.evented = false
        object.selectable = false
      })
      // Remove selection ability on the canvas
      canvas.selection = false
      // When MouseUp fires, we set the state to idle
      canvas.on("mouse:up", function (e) {
        state = STATE_IDLE
      })
      // When MouseDown fires, we set the state to panning
      canvas.on("mouse:down", (e) => {
        state = STATE_PANNING
        lastClientX = e.e.clientX
        lastClientY = e.e.clientY
      })
      // When the mouse moves, and we're panning (mouse down), we continue
      canvas.on("mouse:move", (e) => {
        if (state === STATE_PANNING && e && e.e) {
          // let delta = new fabric.Point(e.e.movementX, e.e.movementY); // No Safari support for movementX and movementY
          // For cross-browser compatibility, I had to manually keep track of the delta

          // Calculate deltas
          let deltaX = 0
          let deltaY = 0
          if (lastClientX) {
            deltaX = e.e.clientX - lastClientX
          }
          if (lastClientY) {
            deltaY = e.e.clientY - lastClientY
          }
          // Update the last X and Y values
          lastClientX = e.e.clientX
          lastClientY = e.e.clientY

          let delta = new fabric.Point(deltaX, deltaY)
          canvas.relativePan(delta)
          canvas.fire("moved")
        }
      })
      this.editor.state.setDragMode("PANNING")
    } else {
      // When we exit dragmode, we restore the previous values on all objects
      canvas.forEachObject(function (object) {
        // @ts-ignore
        object.evented = object.prevEvented !== undefined ? object.prevEvented : object.evented
        // @ts-ignore
        object.selectable = object.prevSelectable !== undefined ? object.prevSelectable : object.selectable
        object.set("hoverCursor", "default")
      })
      // Reset the cursor
      canvas.defaultCursor = "default"
      // Remove the event listeners
      // canvas.off("mouse:up")
      // canvas.off("mouse:down")
      canvas.off("mouse:move")
      // Restore selection ability on the canvas
      canvas.selection = true
      this.editor.state.setDragMode("IDLE")
    }
    canvas.requestRenderAll()
  }
}

declare module "fabric" {
  namespace fabric {
    interface Canvas {
      __fire: any
      enableEvents: () => void
      disableEvents: () => void
    }
    interface Object {
      id: string
      name: string
      locked: boolean
      duration?: {
        start?: number
        stop?: number
      }
      _objects?: fabric.Object[]
      metadata?: Record<string, any>
      clipPath?: undefined | null | fabric.Object
      styles?:any
    }
  }
}

export default Canvas
