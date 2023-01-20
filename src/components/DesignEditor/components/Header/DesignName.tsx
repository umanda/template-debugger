import React from "react"
import { Box, Flex, Input } from "@chakra-ui/react"

interface DesignNameState {
  name: string
  width: number
}
function DesignName() {
  const [state, setState] = React.useState<DesignNameState>({ name: "My first design.", width: 0 })
  const spanRef = React.useRef<HTMLDivElement | null>(null)

  const handleInputChange = (name: string) => {
    setState({ ...state, name: name, width: spanRef.current?.clientWidth! })
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
      <Flex width={`${state.width}px`}>
        <Input
          id="DesignNameInput"
          variant={"unstyled"}
          onChange={(e: any) => handleInputChange(e.target.value)}
          sx={{
            padding: 0,
            fontSize: "14px",
            color: "#A9A9B2"
          }}
          value={state.name}
        />
      </Flex>
    </Flex>
  )
}
export default DesignName
