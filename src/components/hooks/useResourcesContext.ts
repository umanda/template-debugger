import { useContext } from "react"
import { ResourcesContext } from "../contexts/ResourcesContext"

export function useResourcesContext() {
  const { draw, setDraw, resourceDrag, setResourceDrag, order, setOrder } = useContext(ResourcesContext)
  return {
    draw,
    setDraw,
    resourceDrag,
    setResourceDrag,
    order,
    setOrder
  }
}

export default useResourcesContext
