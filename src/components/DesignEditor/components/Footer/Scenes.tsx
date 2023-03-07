import React from "react"
import { Box, Button, Flex, Text } from "@chakra-ui/react"
import { useActiveScene, useEditor, useScenes } from "@layerhub-pro/react"
import SceneItem from "./SceneItem"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import Plus from "../../../Icons/Plus"
import HorizontalScroll from "../../../../utils/HorizontaScroll"

export default function Scenes() {
  const scenes = useScenes()
  const { setNamesPages, namesPages, setActiveScene: makeActiveScene } = useDesignEditorContext()
  const activeScene = useActiveScene()
  const editor = useEditor()

  const addScene = React.useCallback(async () => {
    if (editor) {
      editor.design.activeScene.objects.deselect()
      await editor.design.addScene()
      setNamesPages(namesPages.concat(["Untitled design"]))
    }
  }, [editor, namesPages, scenes])

  const setActiveScene = React.useCallback(
    (id: string) => {
      if (editor) {
        editor.design.setActiveScene(id)
      }
    },
    [editor, activeScene]
  )

  return (
    <Flex w="78vw" gap="10px" padding="1rem 0" flexDirection="column">
      <HorizontalScroll scrolls={true}>
        {scenes.map((scene, index) => (
          <Flex key={index} onFocus={() => makeActiveScene(true)} onBlur={() => makeActiveScene(false)}>
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
        <Flex
          flexDir="column"
          sx={{
            cursor: "pointer",
            border: "1px solid #DDDFE5",
            borderRadius: "4px",
            width: "74px",
            alignItems: "center",
            justifyContent: "center"
          }}
          fontSize="12px"
          textAlign="center"
          onClick={addScene}
        >
          <Text marginInline="10px" w="-webkit-max-content">
            Add Scene
          </Text>
          <Plus size={32} />
        </Flex>
      </HorizontalScroll>
    </Flex>
  )
}
