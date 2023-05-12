import React, { useCallback, useEffect, useState } from "react"
import {
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  PopoverBody,
  Portal,
  Spacer,
  Text,
  useDisclosure
} from "@chakra-ui/react"
import { Popover, PopoverTrigger, PopoverContent } from "@chakra-ui/react"
import { useEditor, useZoomRatio } from "@layerhub-pro/react"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import LeftArrow from "../../../Icons/LeftArrow"
import RightArrow from "../../../Icons/RightArrow"
import DownArrow from "../../../Icons/DownArrow"
import UpArrow from "../../../Icons/UpArrow"
import Shortcuts from "../../../Icons/Shortcuts"
import Background from "../../../Icons/Background"
import Layers from "../../../Icons/Layers"
import Minus from "../../../Icons/Minus"
import Pages from "../../../Icons/Pages"
import Help from "../../../Icons/Help"
import Plus from "../../../Icons/Plus"
import Tutorials from "../../../Icons/Tutorials"
import FAQ from "../../../Icons/FAQ"
import Chat from "../../../Icons/Chat"
import Bug from "../../../Icons/Bug"
import LiveChat from "./LiveChat"
import PanningMode from "./PanningMode"
import useResourcesContext from "~/hooks/useResourcesContext"

const redirectFaq: string = import.meta.env.VITE_APP_DOMAIN + "/faq"
const redirectTutorals: string = import.meta.env.VITE_APP_DOMAIN + "/tutorials"

export default function Common() {
  const { setActivePanel, isScenesVisible, setIsScenesVisible, activePanel } = useDesignEditorContext()
  const { dimensionZoom } = useResourcesContext()
  const [zoomState, setZoomState] = useState<number>(0)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const zoomRatio = useZoomRatio() as number
  const editor = useEditor()

  useEffect(() => {
    setZoomState(dimensionZoom / zoomRatio)
  }, [dimensionZoom, zoomRatio])

  const changePanel = useCallback(
    (type: string) => {
      if (editor?.freeDrawer?.canvas?.isDrawingMode) {
        editor.freeDrawer.disable()
      }
      if (setActivePanel && activePanel !== type) {
        if (activePanel !== "Background" && activePanel !== "Layer") {
        }
        setActivePanel(type)
      } else {
        setActivePanel("")
      }
    },
    [activePanel, setActivePanel, editor]
  )

  const onOpenTutorals = () => {
    window.open(redirectTutorals, "_blank")
  }
  const onOpenFaq = () => {
    window.open(redirectFaq, "_blank")
  }

  return (
    <Flex
      sx={{
        display: "grid",
        gridTemplateColumns: "auto 1fr 400px",
        paddingX: "1rem",
        overflow: "hidden"
      }}
      height={"62px"}
      alignItems="center"
    >
      <Flex gap="1rem">
        <Button
          onClick={() => setIsScenesVisible(!isScenesVisible)}
          color={isScenesVisible ? "white" : "inherit"}
          background={isScenesVisible ? "brand.500" : "inherit"}
          _hover={{}}
          size="sm"
          leftIcon={<Pages size={24} />}
          variant={"outline"}
        >
          Pages
        </Button>
        <Button
          size="sm"
          color={activePanel === "Background" ? "white" : "inherit"}
          background={activePanel === "Background" ? "brand.500" : "inherit"}
          _hover={{}}
          leftIcon={<Background size={24} />}
          onClick={() => changePanel("Background")}
          variant={"outline"}
        >
          Background
        </Button>
        <Button
          size="sm"
          color={activePanel === "Layer" ? "white" : "inherit"}
          background={activePanel === "Layer" ? "brand.500" : "inherit"}
          _hover={{}}
          leftIcon={<Layers size={24} />}
          onClick={() => changePanel("Layer")}
          variant={"outline"}
        >
          Layers
        </Button>
      </Flex>
      <Flex alignItems={"center"} justifyContent={"center"}>
        <Flex
          sx={{
            boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.02), 0px 2px 4px rgba(0, 0, 0, 0.08)",
            borderRadius: "10px",
            padding: "0 0.45rem"
          }}
        >
          <PanningMode />
          <IconButton
            variant={"ghost"}
            aria-label="Zoom out"
            icon={<Minus size={24} />}
            onClick={() => editor.zoom.zoomOut()}
          />
          <Button variant={"ghost"}>{Math.trunc(zoomState * 100)}%</Button>
          <IconButton
            variant={"ghost"}
            aria-label="Zoom in"
            icon={<Plus size={24} />}
            onClick={() => editor.zoom.zoomIn()}
          />
        </Flex>
      </Flex>
      <Flex alignItems={"center"} justifyContent={"flex-end"}>
        <Popover placement="top-end">
          <PopoverTrigger>
            <IconButton color={"#dd6b20"} variant={"ghost"} aria-label="Help" icon={<Help size={24} />} />
          </PopoverTrigger>
          <Portal>
            <PopoverContent width={"200px"} marginRight={"1rem"}>
              <PopoverBody fontSize="15px">
                <MenuOption>
                  <Flex gap="0.25rem" alignItems={"center"}>
                    <Flex onClick={onOpen} gap="3px">
                      <Center>
                        <Shortcuts size={20} />
                      </Center>
                      Shortcuts
                    </Flex>
                    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>
                          <Text borderBottom={"1px solid rgb(232, 232, 232)"} fontWeight={"bold"}>
                            KEYBOARD SHORTCUTS
                          </Text>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <Flex flexDirection={"row"}>
                            <Box>
                              <Text fontWeight={"bold"} paddingLeft="10px">
                                Basic Actions
                              </Text>
                              <Text padding={"10px"}>
                                Ctrl +
                                <label style={{ background: "#e4e4e4", padding: "5px", fontWeight: "bold" }}>A</label>-
                                Select All Objects
                              </Text>
                              <Text padding={"10px"}>
                                Ctrl +
                                <label style={{ background: "#e4e4e4", padding: "5px", fontWeight: "bold" }}>D</label>-
                                Duplicate Selection
                              </Text>
                              <Text padding={"10px"}>
                                Ctrl +
                                <label style={{ background: "#e4e4e4", padding: "5px", fontWeight: "bold" }}>E</label>-
                                Clear All Objects
                              </Text>
                              <Text padding={"10px"}>
                                Ctrl +
                                <label style={{ background: "#e4e4e4", padding: "5px", fontWeight: "bold" }}>S</label>-
                                Save Project
                              </Text>
                              <Text padding={"10px"}>
                                Ctrl +
                                <label style={{ background: "#e4e4e4", padding: "5px", fontWeight: "bold" }}>Z</label>-
                                Undo
                              </Text>
                              <Text padding={"10px"}>
                                Ctrl +
                                <label style={{ background: "#e4e4e4", padding: "5px", fontWeight: "bold" }}>Y</label>-
                                Redo
                              </Text>
                              <Text padding={"10px"}>
                                <label style={{ background: "#e4e4e4", padding: "5px", fontWeight: "bold" }}>Del</label>{" "}
                                - Delete Object
                              </Text>
                            </Box>
                            <Flex flexDir="column" paddingLeft={"10px"} borderLeft={"2px solid rgb(232, 232, 232)"}>
                              <Text fontWeight={"bold"} paddingLeft="10px">
                                Text Formatting
                              </Text>
                              <Text padding={"10px"}>
                                Ctrl +
                                <label style={{ background: "#e4e4e4", padding: "5px", fontWeight: "bold" }}>B</label>-
                                Text Bold
                              </Text>
                              <Text padding={"10px"}>
                                Ctrl +
                                <label style={{ background: "#e4e4e4", padding: "5px", fontWeight: "bold" }}>I</label>-
                                Text Italic
                              </Text>
                              <Text padding={"10px"}>
                                Ctrl +
                                <label style={{ background: "#e4e4e4", padding: "5px", fontWeight: "bold" }}>U</label>-
                                Text Underline
                              </Text>
                              <Spacer />
                              <Text paddingTop={"10px"} fontWeight={"bold"} paddingLeft="10px">
                                Object Movement
                              </Text>
                              <Flex flexDir="column" marginLeft="10px" gap="5px">
                                <Flex flexDir="row">
                                  Arrow key
                                  <Center marginInline="5px">
                                    <UpArrow size={10} />
                                  </Center>
                                  - Object Move Up
                                </Flex>
                                <Flex flexDir="row">
                                  Arrow key
                                  <Center marginInline="5px">
                                    <DownArrow size={10} />
                                  </Center>
                                  - Object Move Down
                                </Flex>
                                <Flex flexDir="row">
                                  Arrow key
                                  <Center marginInline="5px">
                                    <LeftArrow size={20} />
                                  </Center>
                                  - Object Move Left
                                </Flex>
                                <Flex flexDir="row">
                                  Arrow key
                                  <Center marginInline="5px">
                                    <RightArrow size={20} />
                                  </Center>
                                  - Object Move Right
                                </Flex>
                                <Flex align="center" flexDir="row">
                                  Ctrl +
                                  <label
                                    style={{
                                      background: "#e4e4e4",
                                      margin: "5px",
                                      padding: "3px",
                                      alignItems: "center",
                                      justifyItems: "center",
                                      fontWeight: "bold"
                                    }}
                                  >
                                    -
                                  </label>
                                  - Zoom out
                                </Flex>
                                <Flex align="center" flexDir="row">
                                  Ctrl +
                                  <label
                                    style={{
                                      background: "#e4e4e4",
                                      margin: "5px",
                                      padding: "3px",
                                      alignItems: "center",
                                      justifyItems: "center",
                                      fontWeight: "bold"
                                    }}
                                  >
                                    +
                                  </label>
                                  - Zoom In
                                </Flex>
                              </Flex>
                            </Flex>
                          </Flex>
                        </ModalBody>
                      </ModalContent>
                    </Modal>
                  </Flex>
                </MenuOption>
                <MenuOption>
                  <Flex onClick={onOpenTutorals} gap="0.25rem" alignItems={"center"}>
                    <Tutorials size={20} />
                    Tutorials
                  </Flex>
                </MenuOption>

                <MenuOption>
                  <Flex onClick={onOpenFaq} gap="0.25rem" alignItems={"center"}>
                    <FAQ size={20} /> FAQ
                  </Flex>
                </MenuOption>
                <MenuOption>
                  <LiveChat>
                    <Flex gap="0.25rem" alignItems={"center"}>
                      <Chat size={20} /> Chat with Us
                    </Flex>
                  </LiveChat>
                </MenuOption>
                <MenuOption>
                  <LiveChat>
                    <Flex gap="0.25rem" alignItems="center">
                      <Bug size={20} /> Report a Bug
                    </Flex>
                  </LiveChat>
                </MenuOption>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </Flex>
    </Flex>
  )
}

const MenuOption = React.forwardRef(
  ({ onClick, children }: { onClick?: () => void; children: React.ReactNode }, ref: any) => {
    return (
      <Box
        ref={ref}
        onClick={onClick}
        sx={{
          height: "30px",
          paddingLeft: "0.5rem",
          alignItems: "center",
          display: "flex",
          ":hover": {
            backgroundColor: "brand.50",
            cursor: "pointer",
            color: "brand.500"
          }
        }}
      >
        {children}
      </Box>
    )
  }
)
