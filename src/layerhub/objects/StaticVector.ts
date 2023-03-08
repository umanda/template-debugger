import { fabric } from "fabric"
import groupBy from "lodash/groupBy"
// https://ik.imagekit.io/scenify/drawify-small.svg"
class StaticVectorObject extends fabric.Group {
  static type = "StaticVector"
  public src: string
  public objectColors: Record<string, any[]> = {}
  public colorMap = {}
  private watermark: string
  private _watermark: fabric.Group | fabric.Object

  public updateLayerColor(prev: string, next: string) {
    const sameObjects = this.objectColors[prev]

    if (sameObjects) {
      sameObjects.forEach((c) => {
        c.fill = next
      })
      this.canvas?.requestRenderAll()
      // @ts-ignore
      this.colorMap = {
        ...this.colorMap,
        [prev]: next,
      }
    }
  }

  //@ts-ignore
  initialize(objects, options, others) {
    this.watermark = others.watermark
    // console.log({ objects, options, others })
    const existingColorMap = others.colorMap
    const objectColors = groupBy(objects, "fill")
    // set colorMap
    if (existingColorMap) {
      Object.keys(existingColorMap).forEach((color) => {
        const colorObjects = objectColors[color]
        if (colorObjects) {
          // @ts-ignore
          colorObjects.forEach((c) => {
            c.fill = existingColorMap[color]
          })
        }
      })
    }
    this.objectColors = objectColors

    const colorMap: Record<string, string> = {}

    Object.keys(objectColors).forEach((c) => {
      colorMap[c] = c
    })
    if (existingColorMap) {
      Object.keys(existingColorMap).forEach((c) => {
        colorMap[c] = existingColorMap[c]
      })
    }
    this.colorMap = colorMap

    this.set("src", others.src)
    const object = fabric.util.groupSVGElements(objects, options)

    this.on("added", () => {
      setTimeout(() => {
        if (this.watermark) {
          fabric.loadSVGFromURL(
            this.watermark,
            (watermarkObjects, waterMarkOptions) => {
              const watermarkGroup = fabric.util.groupSVGElements(watermarkObjects, {
                ...waterMarkOptions,
                opacity: 0.5,
                top: this.top! + this.getScaledHeight() / 2 - waterMarkOptions.height / 2,
                left: this.left! + this.getScaledWidth() / 2 - waterMarkOptions.width / 2,
              })
              this._watermark = watermarkGroup
              this.add(...watermarkObjects)
              this.canvas?.requestRenderAll()
            },
            // @ts-ignore
            null,
            { crossOrigin: "Anonymous" }
          )
        }
      }, 0)
    })
    // @ts-ignore
    super.initialize([object], {
      ...others,
      colorMap, // @ts-ignore
      erasable: false,
    })

    return this
  }

  clone(callback: Function, propertiesToInclude?: string[] | undefined): void {
    // @ts-ignore
    var { clipPath, ...objectForm } = this.toObject(propertiesToInclude)
    // @ts-ignore
    if (this.constructor.fromObject) {
      // @ts-ignore
      this.constructor.fromObject(objectForm, callback)
    } else {
      fabric.Object._fromObject("Object", objectForm, callback)
    }
  }
  toObject(propertiesToInclude = []) {
    // @ts-ignore
    return super.toObject(propertiesToInclude, {
      src: this.src,
      watermark: this.watermark,
    })
  }
  toJSON(propertiesToInclude = []) {
    // @ts-ignore
    return super.toObject(propertiesToInclude, {
      src: this.src,
      watermark: this.watermark,
    })
  }

  static fromObject(options: any, callback: Function) {
    fabric.loadSVGFromURL(options.src, (objects, opts) => {
      console.log({ objects, opts })
      return callback && callback(new fabric.StaticVector(objects, opts, { ...options }))
    })
  }
}

fabric.StaticVector = fabric.util.createClass(StaticVectorObject, {
  type: StaticVectorObject.type,
})

fabric.StaticVector.fromObject = StaticVectorObject.fromObject

export type SvgOptions = fabric.Group & { text: string }

declare module "fabric" {
  namespace fabric {
    class StaticVector extends StaticVectorObject {
      constructor(objects: any, options: any, others: any)
    }
  }
}

export default StaticVectorObject
