import React from "react"
import { Box, Flex, Input } from "@chakra-ui/react"
import { useDesign, useScenes } from "@layerhub-pro/react"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"

interface DesignNameState {
  name: string
  width: number
}
function DesignName() {
  const { setInputActive } = useDesignEditorContext()
  const [state, setState] = React.useState<DesignNameState>({ name: "My first design.", width: 0 })
  const spanRef = React.useRef<HTMLDivElement | null>(null)
  const design = useDesign()
  const scenes = useScenes()

  React.useEffect(() => {
    design && setState({ ...state, name: design?.design?.name })
  }, [scenes, design?.design?.name])

  const handleInputChange = (name: string) => {
    if (name.length <= 50) {
      setState({ ...state, name: name, width: spanRef.current?.clientWidth! })
      if (design) {
        design?.updateDesign({
          name
        })
      }
    }
  }

  React.useEffect(() => {
    setState({ ...state, width: spanRef.current?.clientWidth! + 20 })
  }, [state.name])

  return (
    <Flex
      sx={{
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Box sx={{ display: "flex", position: "absolute", top: "-10px", width: "100%", overflow: "hidden" }}>
        <Box
          sx={{
            fontFamily: "Outfit",
            position: "absolute",
            top: "-10px",
            left: "50%",
            fontSize: "14px",
            fontWeight: 500
          }}
          ref={spanRef}
        >
          {state.name}
        </Box>
      </Box>
      <Flex>
        <Input
          id="DesignNameInput"
          variant={"unstyled"}
          onFocus={() => setInputActive(true)}
          onChange={(e: any) => handleInputChange(e.target.value)}
          onBeforeInput={() => setInputActive(false)}
          sx={{
            fontSize: "14px",
            color: "#2D3748",
            borderBottom: "1px solid #e2e8f0",
            padding: "0px 5px"
          }}
          _hover={{ borderColor: "#5456F5" }}
          value={state.name}
        />
      </Flex>
    </Flex>
  )
}
export default DesignName
