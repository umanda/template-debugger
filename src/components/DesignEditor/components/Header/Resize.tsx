import React, { useState } from "react"
import { Box, Button, Flex, Input, useDisclosure, IconButton, Portal, Grid } from "@chakra-ui/react"
import { Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger } from "@chakra-ui/react"
import { useDesign, useObjects } from "@layerhub-pro/react"
import { IFrame } from "@layerhub-pro/types"
import Lock from "../../../Icons/Lock"
import Unlock from "../../../Icons/Unlock"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"

type ResizeMode =
  | "LANDSCAPE"
  | "PORTRAIT"
  | "CUSTOM"
  | "FACEBOOKCOVER"
  | "FACEBOOKPOST"
  | "INSTAGRAMPOST"
  | "TWITTERCOVER"
  | "PHOTO"
  | "LINKEDINCOVER"
  | "TWITTERPOST"
  | "LINKEDINPOST"
  | "YOUTUBECOVER"
  | "A4"
  | "A3"
  | "A5"
  | "SQUARE"
  | "SCREEN"

const PRESETS = {
  FACEBOOKCOVER: {
    width: 820,
    height: 312
  },
  FACEBOOKPOST: {
    width: 1200,
    height: 630
  },
  INSTAGRAMPOST: {
    width: 1080,
    height: 1080
  },
  TWITTERCOVER: {
    width: 1500,
    height: 500
  },
  PHOTO: {
    width: 1800,
    height: 1200
  },
  LINKEDINCOVER: {
    width: 1584,
    height: 396
  },
  TWITTERPOST: {
    width: 1024,
    height: 512
  },
  LINKEDINPOST: {
    width: 1200,
    height: 627
  },
  YOUTUBECOVER: {
    width: 1546,
    height: 360
  },
  SCREEN: {
    width: 1920,
    height: 1080
  },
  A3: { width: 3508, height: 4961 },
  SQUARE: { width: 2048, height: 2048 },
  A4: { width: 2480, height: 3508 },
  A5: { width: 1748, height: 2480 }
}

const Resize = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [size, setSize] = useState<any>()
  const objects = useObjects() as any[]
  const design = useDesign()
  const { setInputActive } = useDesignEditorContext()
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
    setInputActive(false)
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
    if (mode === "FACEBOOKCOVER") {
      newHeight = PRESETS.FACEBOOKCOVER.height
      newWidth = PRESETS.FACEBOOKCOVER.width
    }
    if (mode === "SQUARE") {
      newHeight = PRESETS.SQUARE.height
      newWidth = PRESETS.SQUARE.width
    }
    if (mode === "A4") {
      newHeight = PRESETS.A4.height
      newWidth = PRESETS.A4.width
    }
    if (mode === "A3") {
      newHeight = PRESETS.A3.height
      newWidth = PRESETS.A3.width
    }
    if (mode === "A5") {
      newHeight = PRESETS.A5.height
      newWidth = PRESETS.A5.width
    }
    if (mode === "SCREEN") {
      newHeight = PRESETS.SCREEN.height
      newWidth = PRESETS.SCREEN.width
    }
    if (mode === "FACEBOOKPOST") {
      newHeight = PRESETS.FACEBOOKPOST.height
      newWidth = PRESETS.FACEBOOKPOST.width
    }
    if (mode === "INSTAGRAMPOST") {
      newHeight = PRESETS.INSTAGRAMPOST.height
      newWidth = PRESETS.INSTAGRAMPOST.width
    }
    if (mode === "TWITTERCOVER") {
      newHeight = PRESETS.TWITTERCOVER.height
      newWidth = PRESETS.TWITTERCOVER.width
    }
    if (mode === "PHOTO") {
      newHeight = PRESETS.PHOTO.height
      newWidth = PRESETS.PHOTO.width
    }
    if (mode === "LINKEDINCOVER") {
      newHeight = PRESETS.LINKEDINCOVER.height
      newWidth = PRESETS.LINKEDINCOVER.width
    }
    if (mode === "TWITTERPOST") {
      newHeight = PRESETS.TWITTERPOST.height
      newWidth = PRESETS.TWITTERPOST.width
    }
    if (mode === "LINKEDINPOST") {
      newHeight = PRESETS.LINKEDINPOST.height
      newWidth = PRESETS.LINKEDINPOST.width
    }
    if (mode === "YOUTUBECOVER") {
      newHeight = PRESETS.YOUTUBECOVER.height
      newWidth = PRESETS.YOUTUBECOVER.width
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
      <Portal appendToParentPortal>
        <PopoverContent fontSize="14px" zIndex={100} w="360px">
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
                        onFocus={() => setInputActive(true)}
                        value={displayFrame.width}
                        onChange={(e) => onChange("width", (e.target as any).value)}
                        onBlur={() => handleOnBlur("width")}
                      />
                    </Flex>
                    <Flex alignItems={"center"}>
                      <Input
                        disabled={mode !== "CUSTOM"}
                        placeholder="Height"
                        onFocus={() => setInputActive(true)}
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
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", padding: "0.75rem 0" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Radio onClick={() => setMode("SCREEN")} selected={mode === "SCREEN"} />
                    <Box marginLeft="10px">Screen</Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Radio onClick={() => setMode("SQUARE")} selected={mode === "SQUARE"} />
                    <Box marginLeft="10px">Square</Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Radio onClick={() => setMode("PHOTO")} selected={mode === "PHOTO"} />
                    <Box marginLeft="10px">Photo</Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Radio onClick={() => setMode("A4")} selected={mode === "A4"} />
                    <Box marginLeft="10px">A4</Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Radio onClick={() => setMode("A3")} selected={mode === "A3"} />
                    <Box marginLeft="10px">A3</Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Radio onClick={() => setMode("A5")} selected={mode === "A5"} />
                    <Box marginLeft="10px">A5</Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Radio onClick={() => setMode("LINKEDINPOST")} selected={mode === "LINKEDINPOST"} />
                    <Box marginLeft="10px">Linkedin Post</Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Radio onClick={() => setMode("LINKEDINCOVER")} selected={mode === "LINKEDINCOVER"} />
                    <Box marginLeft="10px">Linkedin Cover</Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Radio onClick={() => setMode("FACEBOOKPOST")} selected={mode === "FACEBOOKPOST"} />
                    <Box marginLeft="10px">Facebook Post</Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Radio onClick={() => setMode("FACEBOOKCOVER")} selected={mode === "FACEBOOKCOVER"} />
                    <Box marginLeft="10px">Facebook Cover</Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Radio onClick={() => setMode("INSTAGRAMPOST")} selected={mode === "INSTAGRAMPOST"} />
                    <Box marginLeft="10px">Instagram Post</Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Radio onClick={() => setMode("YOUTUBECOVER")} selected={mode === "YOUTUBECOVER"} />
                    <Box marginLeft="10px">Youtube Cover</Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Radio onClick={() => setMode("TWITTERPOST")} selected={mode === "TWITTERPOST"} />
                    <Box marginLeft="10px">Twitter Post</Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Radio onClick={() => setMode("TWITTERCOVER")} selected={mode === "TWITTERCOVER"} />
                    <Box marginLeft="10px">Twitter Cover</Box>
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
      </Portal>
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
