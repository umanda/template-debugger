import { Dimension, RotationControlPosition } from "./common"
import { IFrame, IScene } from "./scene"

export interface IConfig {
  id: string
  outsideVisible: boolean
  guidelines: {
    enabled: boolean
    color: string
  }
  zoomToMode: "POINT" | "CENTER"
  margin: number
  shortcuts: boolean
  properties: string[]
  frame: IFrame
  scroll: {
    enabled: boolean
    limit: number
  }
  canvas: {
    color: string
    size: {
      width: number
      height: number
    }
  }
  background: {
    color: string
    shadow: any
  }
}

export interface ControlsPosition {
  rotation: RotationControlPosition
}

export interface IDesign {
  id: string
  name: string
  frame: IFrame
  type: string
  scenes: IScene[]
  previews: { id: string; src: string }[]
  metadata: {}
  published?: boolean
}
