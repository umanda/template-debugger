import { useContext } from "react"
import { ResourcesContext } from "../contexts/ResourcesContext"

export function useResourcesContext() {
  const { draw, setDraw, order, setOrder, loadCanva, setLoadCanva, previewCanva, setPreviewCanva } =
    useContext(ResourcesContext)
  return {
    draw,
    setDraw,
    order,
    setOrder,
    loadCanva,
    setLoadCanva,
    previewCanva,
    setPreviewCanva
  }
}

export default useResourcesContext
