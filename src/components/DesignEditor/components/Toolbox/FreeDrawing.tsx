import { Button, Flex } from "@chakra-ui/react"
import { useEditor } from "@layerhub-pro/react"
import useResourcesContext from "../../../hooks/useResourcesContext"

export default function FreeDrawing() {
  const { draw } = useResourcesContext()
  const editor = useEditor()

  const toggleDrawing = () => {
    if (editor?.freeDrawer?.canvas?.isDrawingMode) {
      editor.freeDrawer.disable()
    } else {
      editor.freeDrawer.enable(draw.type, {
        opacity: draw.opacity,
        size: draw.size,
        color: draw.color
      })
    }
  }
  return (
    <Flex flex={1} alignItems={"center"} justifyContent={"space-between"}>
      <Flex flexDir="row" gap="10px">
        <Button onClick={toggleDrawing} variant={"outline"}>
          {editor?.freeDrawer?.canvas?.isDrawingMode ? "Disable drawing" : "Enable drawing"}
        </Button>
      </Flex>
    </Flex>
  )
}
