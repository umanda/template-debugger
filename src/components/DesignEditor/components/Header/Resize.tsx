import React, { useState } from "react"
import { Box, Button, Flex, Input, useDisclosure, IconButton } from "@chakra-ui/react"
import { Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger } from "@chakra-ui/react"
import { useDesign, useObjects } from "@layerhub-pro/react"
import { IFrame } from "@layerhub-pro/types"
import Lock from "../../../Icons/Lock"
import Unlock from "../../../Icons/Unlock"

type ResizeMode = "LANDSCAPE" | "PORTRAIT" | "CUSTOM" | "FACEBOOK" | "INSTAGRAM"

const PRESETS = {
  FACEBOOK: {
    width: 1200,
    height: 630
  },
  INSTAGRAM: {
    width: 1080,
    height: 1080
  }
}

const Resize = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [size, setSize] = useState<any>()
  const objects = useObjects() as any[]
  const design = useDesign()
  const [mode, setMode] = React.useState<ResizeMode>("LANDSCAPE")
  const [inputLocked, setInputLocked] = React.useState<boolean>(false)
  const [displayFrame, setDisplayFrame] = React.useState<IFrame>({
    height: 1200,
    width: 1200
  })

  React.useEffect(() => {
    setSize(objects.find((e) => e.type === "Frame"))
  }, [objects])

  React.useEffect(() => {
    if (size) {
      setDisplayFrame({
        width: size.width,
        height: size.height
      })
    }
  }, [size])

  const handleOnBlur = (prop: "width" | "height") => {
    if (size && inputLocked) {
      const change = displayFrame[prop] / size[prop]
      if (prop === "width") {
        setDisplayFrame({ ...displayFrame, height: size.height * change })
      } else {
        setDisplayFrame({ ...displayFrame, width: size.width * change })
      }
    }
  }

  const onChange = React.useCallback(
    (type: string, value: any) => {
      if (!value) {
        value = 0
      }
      value = parseInt(value)
      setDisplayFrame({ ...displayFrame, [type]: parseInt(value) })
    },
    [displayFrame]
  )

  const applyResize = React.useCallback(async () => {
    let newHeight = 0
    let newWidth = 0
    if (mode === "CUSTOM") {
      newHeight = displayFrame.height
      newWidth = displayFrame.width
    }
    const isPortrait = size?.height > size?.width
    const isLandscape = size?.width > size?.height
    if (mode === "LANDSCAPE") {
      if (isPortrait) {
        newHeight = displayFrame.width
        newWidth = displayFrame.height
      }
    }
    if (mode === "PORTRAIT") {
      if (isLandscape) {
        newHeight = displayFrame.width
        newWidth = displayFrame.height
      }
    }
    if (mode === "FACEBOOK") {
      newHeight = PRESETS.FACEBOOK.height
      newWidth = PRESETS.FACEBOOK.width
    }
    if (mode === "INSTAGRAM") {
      newHeight = PRESETS.INSTAGRAM.height
      newWidth = PRESETS.INSTAGRAM.width
    }
    if (newHeight !== 0 && newWidth !== 0) {
      if (design) {
        await design.resize({
          width: newWidth,
          height: newHeight
        })
      }
    }
  }, [displayFrame, mode, size, design])

  return (
    <Popover isOpen={isOpen} onClose={onClose} onOpen={onOpen} placement="bottom-start">
      <PopoverTrigger>
        <Button
          color={isOpen ? "white" : "inherit"}
          variant="outline"
          background={isOpen ? "brand.500" : "inherit"}
          _hover={{}}
        >
          Resize
        </Button>
      </PopoverTrigger>
      <PopoverContent w="360px">
        <PopoverArrow />
        <PopoverBody paddingBottom={"1rem"}>
          <Flex flexDirection="column">
            <Box>
              <Box color="#A9A9B2">ORIENTATION</Box>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "0.75rem 0" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Radio onClick={() => setMode("LANDSCAPE")} selected={mode === "LANDSCAPE"} />
                  <Box>Landscape</Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Radio onClick={() => setMode("PORTRAIT")} selected={mode === "PORTRAIT"} />
                  <Box>Portrait</Box>
                </Box>
              </Box>
            </Box>
            <Box>
              <Box color={"#A9A9B2"}>CUSTOM SIZE</Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 0" }}>
                <Box>
                  <Radio onClick={() => setMode("CUSTOM")} selected={mode === "CUSTOM"} />{" "}
                </Box>
                <Flex gap="10px">
                  <Flex alignItems={"center"}>
                    <Input
                      disabled={mode !== "CUSTOM"}
                      placeholder="width"
                      value={displayFrame.width}
                      onChange={(e) => onChange("width", (e.target as any).value)}
                      onBlur={() => handleOnBlur("width")}
                    />
                  </Flex>
                  <Flex alignItems={"center"}>
                    <Input
                      disabled={mode !== "CUSTOM"}
                      placeholder="Height"
                      value={displayFrame.height}
                      onChange={(e) => onChange("height", (e.target as any).value)}
                      onBlur={() => handleOnBlur("height")}
                    />
                  </Flex>
                  {inputLocked ? (
                    <IconButton
                      variant={"ghost"}
                      aria-label="lock"
                      disabled={mode !== "CUSTOM"}
                      onClick={() => setInputLocked(false)}
                      icon={<Lock size={28} />}
                    />
                  ) : (
                    <IconButton
                      variant={"ghost"}
                      aria-label="lock"
                      disabled={mode !== "CUSTOM"}
                      onClick={() => setInputLocked(true)}
                      icon={<Unlock size={28} />}
                    />
                  )}
                </Flex>
              </Box>
            </Box>
            <Box>
              <Box color={"#A9A9B2"}>SIZES</Box>
              <Box sx={{ display: "grid", gap: "0.75rem", padding: "0.75rem 0" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Radio onClick={() => setMode("FACEBOOK")} selected={mode === "FACEBOOK"} />
                  <Box>Facebook</Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Radio onClick={() => setMode("INSTAGRAM")} selected={mode === "INSTAGRAM"} />
                  <Box>Instagram</Box>
                </Box>
              </Box>
            </Box>

            <Box>
              <Button onClick={applyResize} width={"100%"} variant={"outline"}>
                Resize
              </Button>
            </Box>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

const Radio = ({ selected, onClick }: { selected: boolean; onClick?: () => void }) => {
  return (
    <Box
      onClick={onClick && onClick}
      sx={{
        border: "1px solid #DDDFE5",
        width: "22px",
        height: "22px",
        background: selected ? "#5456F5" : "#ffffff",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer"
      }}
    >
      <Box
        sx={{
          width: "12px",
          height: "12px",
          background: "#ffffff",
          borderRadius: "50%"
        }}
      ></Box>
    </Box>
  )
}

export default Resize
