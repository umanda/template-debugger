import React from "react"
import { Box, Button, Flex, Text } from "@chakra-ui/react"
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
  const [draggedScene, setDraggedScene] = React.useState<any | null>(null)

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
      setDraggedScene(draggedScene)
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
      console.log(arrayMove(scenes, oldIndex, newIndex))
      await editor.design.setScenes(arrayMove(scenes, oldIndex, newIndex))
    }
    setDraggedScene(null)
  }

  return (
    <Flex>
      <Flex maxW="75vw" gap="10px" padding="1rem 0" flexDirection="column">
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
        <Flex
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
          fontSize="12px"
          textAlign="center"
          onClick={addScene}
        >
          <Plus size={32} />
          <Text marginInline="10px" w="-webkit-max-content">
            Add Scene
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
