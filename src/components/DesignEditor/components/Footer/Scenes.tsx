import React from "react"
import { Flex } from "@chakra-ui/react"
import { useActiveScene, useEditor, useScenes } from "@layerhub-pro/react"
import SceneItem from "./SceneItem"
import useDesignEditorContext from "../../../hooks/useDesignEditorContext"
import Plus from "../../../Icons/Plus"

export default function Scenes() {
  const scenes = useScenes()
  const { setNamesPages, namesPages } = useDesignEditorContext()
  const activeScene = useActiveScene()
  const editor = useEditor()

  const addScene = React.useCallback(() => {
    if (editor) {
      editor.design.activeScene.objects.deselect()
      editor.design.addScene()
      setNamesPages(namesPages.concat(["Untitled design"]))
    }
  }, [editor, namesPages])

  const setActiveScene = React.useCallback(
    (id: string) => {
      if (editor) {
        editor.design.setActiveScene(id)
      }
    },
    [editor, activeScene]
  )

  return (
    <Flex
      sx={{
        overflow: "hidden",
        padding: "0.5rem",
        gap: "0.5rem",
        borderTop: "1px solid #DDDFE5",
        position: "relative"
      }}
    >
      {scenes.map((scene, index) => (
        <Flex key={index} position="relative">
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
        sx={{
          cursor: "pointer",
          position: "relative",
          border: "1px solid #DDDFE5",
          borderRadius: "4px",
          width: "74px",
          height: "74px",
          alignItems: "center",
          justifyContent: "center"
        }}
        onClick={addScene}
      >
        <Plus size={32} />
      </Flex>
    </Flex>
  )
}
