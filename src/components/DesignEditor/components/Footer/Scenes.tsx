import React, { useEffect } from "react"
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure
} from "@chakra-ui/react"
import { useActiveScene, useEditor, useScenes } from "@layerhub-pro/react"
import SceneItem from "./SceneItem"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import Plus from "../../../Icons/Plus"
import HorizontalScroll from "../../../../utils/HorizontaScroll"
import { DndContext, closestCenter, PointerSensor, useSensor, DragOverlay } from "@dnd-kit/core"
import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToFirstScrollableAncestor, restrictToHorizontalAxis } from "@dnd-kit/modifiers"

export default function Scenes() {
  const scenes = useScenes()
  const { setActiveScene: makeActiveScene } = useDesignEditorContext()
  const activeScene = useActiveScene()
  const editor = useEditor()
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    scenes.length >= 20 && onOpen()
  }, [scenes.length])

  const sensors = [
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    })
  ]

  const handleDragStart = (event: any) => {
    const draggedScene = scenes.find((s) => s.id === event.active.id)
    if (draggedScene) {
    }
  }

  const addScene = React.useCallback(async () => {
    if (editor) {
      editor.design.activeScene.objects.deselect()
      await editor.design.addScene()
    }
  }, [editor, scenes])

  const setActiveScene = React.useCallback(
    (id: string) => {
      if (editor) {
        editor.design.setActiveScene(id)
      }
    },
    [editor, activeScene]
  )

  const handleDragEnd = async (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = scenes.findIndex((s) => s.id === active.id)
      const newIndex = scenes.findIndex((s) => s.id === over.id)
      await editor.design.setScenes(arrayMove(scenes, oldIndex, newIndex))
    }
  }

  return (
    <Flex>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Page Limit Reached</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Uh oh! It looks like you've reached the maximum limit of 20 pages. We understand that you're eager to keep
            creating, but in order to maintain the best possible experience for everyone, we kindly ask that you remove
            a few pages before adding more.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme={"brand"} mr={3} onClick={onClose}>
              Ok
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex maxW="74vw" gap="10px" padding="1rem 0" flexDirection="column">
        <HorizontalScroll scrolls={true}>
          <DndContext
            modifiers={[restrictToFirstScrollableAncestor, restrictToHorizontalAxis]}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            <SortableContext items={scenes} strategy={horizontalListSortingStrategy}>
              {scenes.map((scene, index) => (
                <Flex
                  key={index}
                  onFocus={() => makeActiveScene(true)}
                  onBlur={() => makeActiveScene(false)}
                  sx={{
                    paddingBottom: "3px"
                  }}
                >
                  <SceneItem
                    key={index}
                    isCurrentScene={activeScene && activeScene.id === scene.id}
                    scene={scene}
                    index={index}
                    setActiveScene={setActiveScene}
                    preview={scene.preview}
                  />
                </Flex>
              ))}
            </SortableContext>
          </DndContext>
        </HorizontalScroll>
      </Flex>
      <Flex padding="26px 0 28px 0">
        <Button
          flexDir="column"
          sx={{
            cursor: "pointer",
            border: "2px solid #DDDFE5",
            borderRadius: "4px",
            width: "74px",
            height: "74px",
            alignItems: "center",
            justifyContent: "center"
          }}
          isDisabled={scenes.length >= 20 ? true : false}
          fontSize="12px"
          textAlign="center"
          onClick={addScene}
        >
          <Plus size={32} />
          <Text marginInline="10px" w="-webkit-max-content">
            Add Scene
          </Text>
        </Button>
      </Flex>
    </Flex>
  )
}
