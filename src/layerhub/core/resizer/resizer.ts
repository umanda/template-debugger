import { fabric } from "fabric"
import { IConfig, ILayer, IScene } from "@layerhub-pro/types"
import ObjectImporter from "../utils/objects-importer"
import { createFrame } from "../utils/design"
import ObjectsExporter from "../design/objects-exporter"

class Resizer {
  private canvas: fabric.Canvas
  constructor(
    public scene: IScene,
    public options: { width: number; height: number },
    public config: IConfig
  ) {}

  public async resize() {
    this.initCanvas()

    await this.importObjects()

    const group = this.group()

    this.scale(group)
    this.ungroup(group)
    this.scaleBackground()

    const resized = this.toJSON()
    return resized
  }

  public group() {
    const objects = this.canvas.getObjects()
    const selection = new fabric.ActiveSelection(objects, {
      canvas: this.canvas,
    }) as fabric.Object
    // @ts-ignore
    const grouped = selection.toGroup() as fabric.Group

    return grouped
  }

  public ungroup(group: fabric.Group) {
    const items = group._objects as any[]
    const canvas = this.canvas
    group._restoreObjectsState()
    canvas.remove(group)
    for (var i = 0; i < items.length; i++) {
      canvas.add(items[i])
    }

    canvas.renderAll()
  }

  public scale(object: fabric.Group) {
    const { width, height } = this.options
    this.canvas.setWidth(width).setHeight(height)

    object.scaleToWidth(width)

    const newTop = height / 2 - object.getScaledHeight() / 2
    const newLeft = width / 2 - object.getScaledWidth() / 2

    object.set({
      top: newTop,
      left: newLeft,
    })
    object.setCoords()
    this.canvas.requestRenderAll()
  }

  private scaleBackground = () => {
    const [background] = this.canvas.getObjects()
    // @ts-ignore
    if (background.type === "Background") {
      const backgroundOptions = background.toJSON()
      const updatedOptions = {
        ...backgroundOptions,
        width: this.options.width,
        height: this.options.height,
        scaleX: 1,
        scaleY: 1,
        top: 0,
        left: 0,
      }
      const backgroundScaled = new fabric.Background(updatedOptions)
      this.canvas.insertAt(backgroundScaled, 0, true)
    }
    this.canvas.requestRenderAll()
    // const frame = this.scene.frame
    // const zoomRatio = this.canvas.getZoom()
    // // const
    // // const object =
    // if (object.type === "BackgroundImage") {
    //   const isFramePortrait = frame.height! > frame.width!
    //   const refSize = Math.max(frame.height!, frame.width!)
    //   const refWidth = zoomRatio * refSize
    //   if (isFramePortrait) {
    //     object.scaleToHeight(refWidth)
    //   } else {
    //     object.scaleToWidth(refWidth)
    //   }
    // }
    // object.center()
  }

  private toJSON() {
    const frame = createFrame({
      frame: {
        ...this.options,
      },
    })
    const layers = this.exportObjects()

    const scene: IScene = {
      id: this.scene.id,
      name: this.scene.name,
      layers: layers,
      frame: frame,
      metadata: {},
    }
    return scene
  }

  public initCanvas = () => {
    this.canvas = new fabric.StaticCanvas(null) as fabric.Canvas
    const { width, height } = this.scene.frame
    this.canvas.setWidth(width).setHeight(height)
  }
  public exportObjects() {
    const objectExporter = new ObjectsExporter()
    const objects = this.canvas.getObjects()

    const layers = objects.map((layer) => layer.toJSON(this.config.properties))

    let exportedLayers: any[] = []
    layers.forEach((layer: ILayer) => {
      // @ts-ignore
      const exportedObject = objectExporter.export(layer, {
        top: 0,
        left: 0,
      })
      exportedLayers = exportedLayers.concat(exportedObject)
    })

    return exportedLayers
  }

  public async importObjects() {
    const objectimporter = new ObjectImporter()
    const promiseObjects: Promise<fabric.Object>[] = []
    for (const layer of this.scene.layers) {
      const importedObject = objectimporter.import({
        item: layer as Required<ILayer>,
        isInGroup: false,
        options: {
          top: 0,
          left: 0,
        } as any,
      })
      promiseObjects.push(importedObject as any)
    }
    const loadedObjects = await Promise.all(promiseObjects)

    this.canvas.add(...loadedObjects)
    this.canvas.requestRenderAll()
  }
}

export default Resizer
