import React, { useCallback, useEffect, useState } from "react"
import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useDisclosure
} from "@chakra-ui/react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useActiveScene, useDesign, useEditor, useFrame, useScenes } from "@layerhub-pro/react"
import { useSelector } from "react-redux"
import useDesignEditorContext from "../../../hooks/useDesignEditorContext"
import { selectUser } from "../../../store/user/selector"
import Trash from "../../../Icons/Trash"
import OptionsScenes from "../../../Icons/OptionsScenes"
import Rename from "../../../Icons/Rename"
import Duplicate2 from "../../../Icons/Copy"

interface Props {
  isCurrentScene: boolean
  scene: any
  preview: string
  index: number
  setActiveScene: (p: any) => void
}

export default function SceneItem({ index, isCurrentScene, preview, setActiveScene, scene }: Props) {
  const {
    setNamesPages,
    namesPages,
    setInputActive,
    setActiveScene: makeActiveScene,
    activeScene
  } = useDesignEditorContext()
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: scene.id! })
  const { onOpen, onClose, isOpen } = useDisclosure()
  const currentScene = useActiveScene()
  const [nameInput, setNameInput] = useState<string>("")
  const [disableDelete, setDisableDelete] = useState(false)
  const [viewInput, setViewInput] = useState<boolean>(false)
  const inputRef = React.useRef<any>()
  const editor = useEditor()
  //@ts-ignore
  const frame = useFrame()
  const design = useDesign()
  const scenes = useScenes()

  useEffect(() => {
    setViewInput(false)
    setNameInput("")
  }, [isOpen])

  useEffect(() => {
    scenes.length === 1 ? setDisableDelete(true) : setDisableDelete(false)
  }, [scenes.length])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "pointer"
  }

  const handleDeleteScene = useCallback(
    async (id: string) => {
      design.deleteScene(id)
      setNamesPages(namesPages.filter((e, i: number) => i !== index))
      editor.design.activeScene.objects.deselect()
      onClose()
    },
    [namesPages, design, index]
  )

  const blurInput = useCallback(() => {
    setNamesPages(Object.values({ ...namesPages, [index]: nameInput }) as string[])
    onClose()
    setInputActive(false)
  }, [nameInput, namesPages])

  const handleDuplicateScene = useCallback(
    async (id: string) => {
      if (editor?.freeDrawer?.canvas?.isDrawingMode) {
        editor.freeDrawer.disable()
        editor.design.activeScene.objects.deselect()
      }
      namesPages.splice(index + 1, 0, namesPages[index])
      setNamesPages(namesPages)
      design.duplicateScene(id)
      onClose()
    },
    [namesPages, design, index]
  )

  return (
    <Box ref={setNodeRef} key={`scene${index}`} position="relative" {...attributes} {...listeners} sx={style}>
      <Box
        sx={{
          position: "absolute",
          fontSize: "13px",
          bottom: "8px",
          right: "12px",
          zIndex: 100
        }}
      >
        {namesPages[index] === "Untitled design" || namesPages[index] === undefined
          ? index + 1
          : namesPages[index]?.substring(0, 4)}
      </Box>
      <Box
        sx={{
          cursor: "pointer",
          position: "relative",
          border:
            activeScene && currentScene.id === scene.id
              ? "2px solid #DD6B20"
              : isCurrentScene
              ? "2px solid #5456F5"
              : "2px solid #DDDFE5",
          borderRadius: "4px"
        }}
        onClick={() => setActiveScene(scene.id)}
      >
        <Image
          src={preview}
          sx={{
            display: "flex",
            width: `${frame ? (frame.width * 70) / frame.height : 70}px`,
            height: "70px"
          }}
        />
      </Box>
      <Box position="absolute" top="5px" right="8px">
        <Popover placement="top-start" isOpen={isOpen} onOpen={onOpen} onClose={onClose} initialFocusRef={inputRef}>
          <PopoverTrigger>
            <IconButton
              size="xs"
              _hover={{}}
              variant="unstyled"
              aria-label="Comment"
              icon={<OptionsScenes size={20} />}
            />
          </PopoverTrigger>
          <Portal>
            <PopoverContent width={"140px"}>
              <PopoverBody flexDir="column" gap={"0.25rem"} fontSize="14px">
                <Flex flexDir="column" gap={"0.25rem"} fontSize="14px">
                  {viewInput ? (
                    <Input
                      ref={inputRef}
                      onKeyDown={(e) => e.key === "Enter" && inputRef.current.blur()}
                      onChange={(e) => setNameInput(e.target.value)}
                      onBlur={blurInput}
                      onFocus={() => setInputActive(true)}
                      value={nameInput}
                    />
                  ) : (
                    <Button
                      justifyContent="left"
                      size="xs"
                      variant="ghost"
                      leftIcon={<Rename size={20} />}
                      onClick={() => {
                        setViewInput(true)
                        setTimeout(() => {
                          inputRef.current.focus()
                        }, 10)
                      }}
                    >
                      Rename
                    </Button>
                  )}
                  <Button
                    justifyContent="left"
                    leftIcon={<Duplicate2 size={20} />}
                    size="xs"
                    variant="ghost"
                    onClick={() => handleDuplicateScene(scene.id!)}
                  >
                    Duplicate
                  </Button>
                  <Button
                    isDisabled={disableDelete}
                    justifyContent="left"
                    leftIcon={<Trash size={20} />}
                    w="full"
                    size="xs"
                    variant="ghost"
                    onClick={() => handleDeleteScene(scene.id!)}
                  >
                    Delete
                  </Button>
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </Box>
      {/* <Box position="absolute" visibility={user ? "visible" : "hidden"} top="40px" right="40px">
        <Comments index={index} />
      </Box> */}
    </Box>
  )
}
