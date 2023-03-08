import keyboard from "./keyboard"
import MouseWheel from "./mouse-wheel"
import CanvasEvents from "./canvas-events"
import { FabricCanvas } from "../common/interfaces"
import { type Editor } from "../editor/editor"

interface Options {
  editor: Editor
  canvas: FabricCanvas
}
class Events {
  public canvasEvents: CanvasEvents
  public mouseWheel: MouseWheel
  public keyboard: keyboard
  constructor(options: Options) {
    this.canvasEvents = new CanvasEvents(options)
    this.mouseWheel = new MouseWheel(options)
    this.keyboard = new keyboard(options)
  }
}

export default Events
