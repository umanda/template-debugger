import { useContext } from "react"
import { ResourcesContext } from "../contexts/ResourcesContext"

export function useResourcesContext() {
  const { draw, setDraw, order, setOrder, loadCanva, setLoadCanva, previewCanva, setPreviewCanva,setDimensionZoom,dimensionZoom } =
    useContext(ResourcesContext)
  return {
    draw,
    setDraw,
    order,
    setOrder,
    loadCanva,
    setLoadCanva,
    previewCanva,
    setPreviewCanva,
    dimensionZoom,setDimensionZoom
  }
}

export default useResourcesContext
