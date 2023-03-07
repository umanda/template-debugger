// @ts-nocheck
import { fabric } from "fabric"

export class PrintItemObject extends fabric.Image {
  static type = "PrintItem"
  //@ts-ignore
  initialize(element, options) {
    //@ts-ignore
    super.initialize(element, {
      ...options,
      selectable: false,
      hasControls: false,
      hasBorders: false,
      lockMovementY: true,
      lockMovementX: true,
      evented: false,
      excludeFromExport: true,
      // @ts-ignore
      erasable: false,
    })
    return this
  }

  static fromObject(options: any, callback: Function) {
    fabric.util.loadImage(
      options.src,
      function (img) {
        // @ts-ignore
        return callback && callback(new fabric.PrintItem(img, options))
      },
      null,
      // @ts-ignore
      { crossOrigin: "anonymous" }
    )
  }

  toObject(propertiesToInclude = []) {
    return super.toObject(propertiesToInclude)
  }
  toJSON(propertiesToInclude = []) {
    return super.toObject(propertiesToInclude)
  }
}

fabric.PrintItem = fabric.util.createClass(PrintItemObject, {
  type: PrintItemObject.type,
})
fabric.PrintItem.fromObject = PrintItemObject.fromObject

export interface PrintItemOptions extends fabric.IImageOptions {
  id: string
  name?: string
  description?: string
  src: string
}

declare module "fabric" {
  namespace fabric {
    class PrintItem extends PrintItemObject {
      constructor(element: any, options: any)
    }

    interface IUtil {
      isTouchEvent(event: Event): boolean
      getPointer(event: Event, a?: any): Point
    }
  }
}
