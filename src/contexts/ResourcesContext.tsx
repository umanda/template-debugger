import React from "react"

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
  order: boolean
  setOrder: React.Dispatch<React.SetStateAction<boolean>>
  loadCanva: boolean
  setLoadCanva: React.Dispatch<React.SetStateAction<boolean>>
  previewCanva: string | null
  setPreviewCanva: React.Dispatch<React.SetStateAction<string | null>>
  dimensionZoom: number | null
  setDimensionZoom: React.Dispatch<React.SetStateAction<number | null>>
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
  order: false,
  setOrder: () => {},
  loadCanva: false,
  setLoadCanva: () => {},
  previewCanva: null,
  setPreviewCanva: () => {},
  dimensionZoom: null,
  setDimensionZoom: () => {}
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
  const [order, setOrder] = React.useState<boolean>(false)
  const [loadCanva, setLoadCanva] = React.useState<boolean>(false)
  const [previewCanva, setPreviewCanva] = React.useState<string | null>(null)
  const [dimensionZoom, setDimensionZoom] = React.useState<number>(null)
  const context = {
    draw,
    setDraw,
    order,
    setOrder,
    loadCanva,
    setLoadCanva,
    previewCanva,
    setPreviewCanva,
    dimensionZoom,
    setDimensionZoom
  }
  return <ResourcesContext.Provider value={context}>{children}</ResourcesContext.Provider>
}
