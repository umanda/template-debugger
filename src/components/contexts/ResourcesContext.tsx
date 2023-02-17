import React from "react"
import { IResource } from "../interfaces/editor"

interface IFont {
  id: string
  width: number
  type: string
  textAlign: string
  text: string
  fontFamily: string
  fontURL: string
  fontSize: number
  metadata: {}
}

interface IResourcesContext {
  draw: BrushOptions
  setDraw: React.Dispatch<React.SetStateAction<BrushOptions>>
  resourceDrag: IResource
  setResourceDrag: React.Dispatch<React.SetStateAction<IResource | IFont>>
  order: boolean
  setOrder: React.Dispatch<React.SetStateAction<boolean>>
}

export type BrushType =
  | "CrayonBrush"
  | "SpraypaintBrush"
  | "MarkerBrush"
  | "RibbonBrush"
  | "PencilBrush"
  | "EraserBrush"
  | null

export interface BrushOptions {
  size: number
  color: any
  opacity: number
  type: BrushType
  shadeDistance?: number
  sizePrev: number
  colorPrev: any
  opacityPrev: number
  shadeDistancePrev?: number
}

export const ResourcesContext = React.createContext<IResourcesContext>({
  draw: {
    opacity: 100,
    size: 14,
    color: "#000000",
    type: null,
    opacityPrev: 100,
    sizePrev: 14,
    colorPrev: "#000000"
  },
  setDraw: () => {},
  resourceDrag: {
    drawifier: {
      name: "",
      avatar: "",
      id: ""
    },
    id: "",
    license: "",
    name: "",
    created_at: "",
    url: "",
    color: [],
    updated_at: "",
    category: "",
    visibility: "",
    preview: "",
    tags: []
  },
  setResourceDrag: () => {},
  order: false,
  setOrder: () => {}
})

export const ResourcesContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [draw, setDraw] = React.useState<BrushOptions>({
    opacity: 100,
    size: 14,
    color: "#000000",
    type: null,
    opacityPrev: 100,
    sizePrev: 14,
    colorPrev: "#000000"
  })
  const [resourceDrag, setResourceDrag] = React.useState<IResource>({
    drawifier: {
      name: "",
      avatar: "",
      id: ""
    },
    id: "",
    license: "",
    name: "",
    created_at: "",
    url: "",
    color: [],
    updated_at: "",
    category: "",
    visibility: "",
    preview: "",
    tags: []
  })
  const [order, setOrder] = React.useState<boolean>(false)
  const context = {
    draw,
    setDraw,
    resourceDrag,
    setResourceDrag,
    order,
    setOrder
  }
  return <ResourcesContext.Provider value={context}>{children}</ResourcesContext.Provider>
}
