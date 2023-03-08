import { fabric } from "fabric"

// @ts-ignore
export class PrintAreaObject extends fabric.Rect {
  static type = "PrintArea"
  initialize(options: PrintAreaOptions) {
    super.initialize({
      ...options,
      selectable: false,
      hasControls: false,
      hasBorders: false,
      lockMovementY: true,
      lockMovementX: true,
      strokeWidth: 3,
      stroke: "#2980b9",
      evented: false,
      hoverCursor: "default",
      // @ts-ignore
      fill: null,
      excludeFromExport: true,
      strokeDashArray: [15, 15],
      // @ts-ignore
      erasable: false,
    })

    return this
  }

  toObject(propertiesToInclude: string[] = []) {
    return super.toObject(propertiesToInclude)
  }
  toJSON(propertiesToInclude: string[] = []) {
    return super.toObject(propertiesToInclude)
  }

  static fromObject(options: PrintAreaOptions, callback: Function) {
    return callback && callback(new fabric.PrintArea(options))
  }
}

fabric.PrintArea = fabric.util.createClass(PrintAreaObject, {
  type: PrintAreaObject.type,
})
fabric.PrintArea.fromObject = PrintAreaObject.fromObject

export interface PrintAreaOptions extends fabric.IRectOptions {
  id: string
  name: string
  description?: string
}

declare module "fabric" {
  namespace fabric {
    class PrintArea extends PrintAreaObject {
      constructor(options: PrintAreaOptions)
    }
  }
}
