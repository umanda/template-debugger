import { IconButton } from "@chakra-ui/react"
import { useDragMode, useEditor } from "@layerhub-pro/react"
import Hand from "../../../Icons/Hand"

const PanningMode = () => {
  const editor = useEditor()
  const dragMode = useDragMode()
  return (
    <IconButton
      onClick={() => {
        if (dragMode === "IDLE") {
          editor?.canvas.toggleDragMode("PANNING")
        } else {
          editor?.canvas.toggleDragMode("IDDLE")
        }
      }}
      background={dragMode !== "IDLE" && "#5456F5"}
      color={dragMode !== "IDLE" && "white"}
      variant="ghost"
      aria-label="Panning Mode"
      icon={<Hand size={15} />}
    />
  )
}

export default PanningMode
