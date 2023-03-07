// @ts-nocheck
import { fabric } from "fabric"

export function loadImageFromURL(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const image = new Image()
    image.src = src
    image.crossOrigin = "Anonymous"
    image.onload = () => {
      resolve(image)
    }
  })
}
const loadImage = (url): Promise<fabric.Image> => {
  return new Promise((resolve) => {
    fabric.Image.fromURL(
      url,
      (img) => {
        resolve(img)
      },
      { crossOrigin: "anonymous" }
    )
  })
}

function rotatedPoint(point, angle, center) {
  angle = (Math.PI / 180) * angle
  return {
    x: (point.x - center.x) * Math.cos(angle) - (point.y - center.y) * Math.sin(angle) + center.x,
    y: (point.x - center.x) * Math.sin(angle) + (point.y - center.y) * Math.cos(angle) + center.y,
  }
}

const multiply = fabric.util.multiplyTransformMatrices
const invert = fabric.util.invertTransform

export class StaticImageObject extends fabric.Image {
  static type = "StaticImage"
  public role: string = "regular"
  _cropInfo
  _cropper
  _isCropping
  _background

  registerEventListeners() {
    this.on("mousedblclick", () => {
      this.cropInit()
    })
  }

  initialize(element, options) {
    this.role = element.role
    options.type = "StaticImage"
    super.initialize(element, {
      ...options, // @ts-ignore
    })
    this.prepare()
    this.registerEventListeners()
    return this
  }

  async prepare() {
    const cropInfo = {
      top: 0,
      left: 0,
      width: this.width,
      height: this.height,
      initiated: false,
    }
    this._cropInfo = cropInfo
  }

  async cropInit() {
    this._isCropping = true
    const canvas = this.canvas!
    const zoomRatio = canvas.getZoom()
    canvas!.fire("crop:started", this)
    canvas._isCropping = true
    const cropped = this
    const cropInfo = cropped._cropInfo
    const np = rotatedPoint(
      {
        x: cropped.left - cropInfo.left * cropped.scaleX,
        y: cropped.top - cropInfo.top * cropped.scaleY,
      },
      cropped.angle,
      { x: cropped.left, y: cropped.top }
    )

    const background = await loadImage(this.src)
    const nextCropped = await loadImage(this.src)

    const overlay = new fabric.Rect({
      id: "overlay",
      state: "crop_middleman",
      width: canvas.width / zoomRatio,
      height: canvas.height / zoomRatio,
      fill: "#000000",
      opacity: 0.25,
      selectable: false,
      evented: false,
      top: 0,
      left: 0,
    })

    background.set({
      id: "background",
      state: "crop_middleman",
      left: np.x,
      top: np.y,
      scaleX: cropped.scaleX,
      scaleY: cropped.scaleY,
      angle: cropped.angle,
    })

    cropped.set({
      selectable: false,
      lockMovementX: true,
      lockMovementY: true,
      evented: false,
    })

    nextCropped.set({
      id: "nextCropped",
      state: "cropped",
      left: np.x,
      top: np.y,
      width: background.width,
      height: background.height,
      scaleX: cropped.scaleX,
      scaleY: cropped.scaleY,
      angle: cropped.angle,
      opacity: 1,
    })

    const cropper = new fabric.Rect({
      id: "cropper",
      state: "crop_middleman",
      absolutePositioned: true,
      backgroundColor: "rgba(0,0,0,0)",
      opacity: 0.00001,
      lockScalingFlip: true,
      lockMovementX: true,
      lockMovementY: true,
      top: cropped.top,
      left: cropped.left,
      width: cropped.width,
      height: cropped.height,
      scaleX: cropped.scaleX,
      scaleY: cropped.scaleY,
      angle: cropped.angle,
      selectable: false,
    })

    cropper.setControlsVisibility({
      mtr: false,
    })

    nextCropped.setControlsVisibility({
      mtr: false,
      mt: false,
      ml: false,
      mr: false,
      mb: false,
    })

    const updateBackground = () => {
      nextCropped.setCoords()
      let relationship = background.relationship
      let newTransform = multiply(nextCropped.calcTransformMatrix(), relationship)
      let opt = fabric.util.qrDecompose(newTransform)
      background.set({
        flipX: false,
        flipY: false,
      })
      background.setPositionByOrigin({ x: opt.translateX, y: opt.translateY }, "center", "center")

      background.set(opt)
      background.setCoords()

      background.setCoords()
      cropper.setCoords()

      const isIn = cropper.isContainedWithinObject(background)
      if (!isIn) {
        if (background._stateProperties) {
          background.left = background._stateProperties.left
          background.top = background._stateProperties.top
          nextCropped.left = background.left
          nextCropped.top = background.top
        }
      } else {
        background.setCoords()
        background.saveState()
      }
    }

    nextCropped.on("moving", updateBackground)
    nextCropped.on("rotating", updateBackground)
    nextCropped.on("scaling", updateBackground)

    let bossTransform = nextCropped.calcTransformMatrix()
    let invertedBossTransform = invert(bossTransform)

    // background
    let desiredTransform = multiply(invertedBossTransform, background.calcTransformMatrix())
    // save the desired relation here.
    background.relationship = desiredTransform

    nextCropped.clipPath = cropper

    canvas.add(background)
    canvas.add(overlay)
    overlay.center()
    background.setCoords()
    background.saveState()

    canvas.add(nextCropped)

    nextCropped.bringToFront()

    canvas.requestRenderAll()

    canvas.on("mouse:up", this.onMouseUp.bind(this))

    cropper._cropped = nextCropped

    cropped.set({
      top: -100000,
      left: -100000,
    })
    canvas.setActiveObject(cropper)
    this._cropper = cropper
    this._background = background
    canvas.croppingObject = this
    this.canvas = canvas
  }

  onMouseUp(e) {
    if (this._cropper && this._background) {
      const isInCropper = this._cropper.containsPoint(e.pointer)
      const isInBackground = this._background.containsPoint(e.pointer)
      const canvas = this.canvas
      if (isInCropper && canvas) {
        canvas.discardActiveObject()
        canvas.setActiveObject(this._cropper)
        canvas.requestRenderAll()
      }
      if (!isInBackground && !isInCropper) {
        this.cropApply()
      }
    }
  }

  async cropApply() {
    const canvas = this.canvas!
    if (!this._isCropping) return
    canvas!.fire("crop:finished", this)

    canvas.off("mouse:up", this.onMouseUp.bind(this))
    this._isCropping = false
    canvas._isCropping = false

    const cropper = this._cropper
    const cropped = cropper._cropped

    const sX = cropped.scaleX
    const sY = cropped.scaleY

    cropper.set({
      width: cropper.width * cropper.scaleX, //this.width * this.scaleX
      height: cropper.height * cropper.scaleY,
      scaleX: 1,
      scaleY: 1,
    })

    canvas.remove(cropped)

    const np = rotatedPoint({ x: cropper.left, y: cropper.top }, -cropper.angle, {
      x: cropped.left,
      y: cropped.top,
    })

    const cropInfo = {
      top: (np.y - cropped.top) / sY,
      left: (np.x - cropped.left) / sX,
      width: cropper.width / cropped.scaleX,
      height: cropper.height / cropped.scaleY,
    }

    this.set({
      left: cropper.left,
      top: cropper.top,
      angle: cropper.angle,
      lockScalingFlip: true,
      scaleX: sX,
      scaleY: sY,
      width: cropper.width / sX,
      height: cropper.height / sY,
      cropX: cropInfo.left,
      cropY: cropInfo.top,
    })

    this._cropInfo = { ...cropInfo, initiated: true }

    canvas.getObjects().forEach((o) => {
      if (o.state === "crop_middleman") {
        canvas.remove(o)
      }
    })

    this.set({
      selectable: true,
      lockMovementX: false,
      lockMovementY: false,
      evented: true,
    })

    canvas.setActiveObject(this)
    canvas.remove(cropper)
    if (cropper) {
      cropper.set({
        width: 0,
        height: 0,
        opacity: 0,
        controls: false,
        top: -1000,
        left: -1000,
      })
    }
  }

  cropCancel() {}

  static fromObject(options: any, callback: Function) {
    fabric.util.loadImage(
      options.src,
      function (img) {
        return callback && callback(new fabric.StaticImage(img, options))
      },
      null,
      { crossOrigin: "anonymous" }
    )
  }

  toObject(propertiesToInclude = []) {
    return fabric.util.object.extend(super.toObject(propertiesToInclude), {
      cropInfo: this._cropInfo,
    })
  }
  toJSON(propertiesToInclude = []) {
    return fabric.util.object.extend(super.toJSON(propertiesToInclude), {
      cropInfo: this._cropInfo,
    })
  }
}

fabric.StaticImage = fabric.util.createClass(StaticImageObject, {
  type: StaticImageObject.type,
})
fabric.StaticImage.fromObject = StaticImageObject.fromObject

export interface StaticImageOptions extends fabric.IImageOptions {
  id: string
  name?: string
  description?: string
  subtype: string
  src: string
}

declare module "fabric" {
  namespace fabric {
    class StaticImage extends StaticImageObject {
      constructor(element: any, options: any)
    }
  }
}
