import { useContext } from "react"
import { ResourcesContext } from "../contexts/ResourcesContext"

export function useResourcesContext() {
  const { draw, setDraw, resourceDrag, setResourceDrag } = useContext(ResourcesContext)
  return {
    draw,
    setDraw,
    resourceDrag,
    setResourceDrag
  }
}

export default useResourcesContext
