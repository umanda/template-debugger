import { IDesign, IFrame } from "@layerhub-pro/types"
import { nanoid } from "nanoid"
import { defaultObjects } from "../constants/defaults"

export const createDesign = (options?: { frame?: Partial<IFrame> }) => {
  const frame = createFrame({
    frame: options && options.frame ? options.frame : {},
  })
  const initial = { ...defaultObjects["DESIGN"] }
  const scene = createScene({ frame })
  return Object.assign({}, initial, { scenes: [scene], frame })
}

export const createScene = (options: { frame: Partial<IFrame> }) => {
  const frame = createFrame({ frame: options.frame })
  const background = createBackground({ frame })
  const initial = { ...defaultObjects["SCENE"] }
  return Object.assign({}, initial, {
    id: nanoid(),
    layers: [background],
    frame,
  })
}

export const createBackground = (options: { frame: IFrame }) => {
  const initial = { ...defaultObjects["BACKGROUND"] }
  return Object.assign({}, initial, {
    width: options.frame.width,
    height: options.frame.height,
  })
}

export const createFrame = (options: { frame?: Partial<IFrame> }) => {
  const initial = { ...defaultObjects["FRAME"] }
  return Object.assign({}, initial, options.frame)
}

export const fixDesignFrame = (design: IDesign): IDesign => {
  const frame = design.frame
  const updatedScenes = design.scenes.map((scene) => {
    return {
      ...scene,
      frame: scene.frame ? scene.frame : frame,
    }
  })
  return {
    ...design,
    scenes: updatedScenes,
  }
}
