import { useContext } from "react"
import { ResourcesContext } from "../contexts/ResourcesContext"

export function useResourcesContext() {
  const { downloadCanva,setDownloadCanva, draw, setDraw, order, setOrder, loadCanva, setLoadCanva, previewCanva, setPreviewCanva,setDimensionZoom,dimensionZoom } =
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
    dimensionZoom,setDimensionZoom,downloadCanva,setDownloadCanva
  }
}

export default useResourcesContext
