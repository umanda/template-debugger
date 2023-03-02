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
        overflowX: "auto",
        overflowY: "hidden",
        padding: "0.5rem",
        gap: "0.5rem",
        borderTop: "1px solid #DDDFE5",
        position: "relative",
        flexWrap: "nowrap",
        width: "100%",
        '::-webkit-scrollbar': {
          height: '4px',
          
        },
        '::-webkit-scrollbar-track': {
          height: '4px',
        },
        '::-webkit-scrollbar-thumb': {
          background: "#DDDFE5",
          borderRadius: '2px',
        },
      }}
    >
      {scenes.map((scene, index) => (
        <Flex key={index} position="relative"
          sx={{
            width: "70px",
          }}>
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
          border: "2px solid #DDDFE5",
          borderRadius: "4px",
          width: "74px",
          height: "74px",
          alignItems: "center",
          justifyContent: "center"
        }}
        onClick={addScene}
      >
        <Flex position="relative"
          sx={{
            width: "70px",
            justifyContent : "center"
          }}>
          <Plus size={32} />
        </Flex>
      </Flex>
    </Flex>
  )
}
