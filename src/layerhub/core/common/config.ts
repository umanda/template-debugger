import { fabric } from "fabric"
import { IConfig, IFrame } from "@layerhub-pro/types"
import { defaultConfig } from "../constants/defaults"

class Config implements IConfig {
  public id: string
  public outsideVisible: boolean
  public margin: number
  public shortcuts: boolean
  public properties: string[]
  public frame: IFrame
  public guidelines: { enabled: boolean; color: string }
  public background: {
    color: string
    shadow: fabric.IShadowOptions
  }
  public canvas: { color: string; size: { width: number; height: number } }

  constructor(options?: Partial<IConfig>) {
    const config = Object.assign({}, defaultConfig, options)
    Object.keys(config).forEach((key) => {
      // @ts-ignore
      this[key] = config[key]
    })
    // @ts-ignore
    this.canvas = Object.assign({}, defaultConfig.canvas, options?.canvas)
    this.guidelines = Object.assign({}, defaultConfig.guidelines, options?.guidelines)
  }
}
export default Config
