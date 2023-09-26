import React from "react"
import { Flex } from "@chakra-ui/react"
import { useActiveScene, useEditor, useActiveObject } from "@layerhub-pro/react"
import Items from "./Items"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import getSelectionType from "~/utils/get-selection-type"

const DEFAULT_TOOLBOX = "NONE"

interface ToolboxState {
  toolbox: string
}

export default function Toolbox() {
  const { setActiveMenu, activePanel } = useDesignEditorContext()
  const [state, setState] = React.useState<ToolboxState>({ toolbox: "Text" })
  const activeScene = useActiveScene() as any
  const editor = useEditor()
  const activeObject = useActiveObject()

  React.useEffect(() => {
    const selectionType = getSelectionType(activeObject)
    if (selectionType) {
      if (selectionType.length > 1) {
        setState({ toolbox: "Multiple" })
      } else if (selectionType[0] === "Multiple") {
        setState({ toolbox: selectionType[0] })
        setActiveMenu("")
      } else {
        setState({ toolbox: selectionType[0] })
      }
    } else {
      setState({ toolbox: DEFAULT_TOOLBOX })
      setActiveMenu("")
    }
  }, [activeScene, activePanel, activeObject])

  React.useEffect(() => {
    let watcher = async () => {
      if (activePanel !== "Pencil") {
        if (activeObject) {
          // @ts-ignore
          const selectionType = getSelectionType(activeObject) as any
          if (selectionType.length > 1) {
            setState({ toolbox: "Multiple" })
          } else {
            setState({ toolbox: selectionType[0] })
          }
        }
      }
    }
    if (editor) {
      editor.on("history:changed", watcher)
    }
    return () => {
      if (editor) {
        editor.off("history:changed", watcher)
      }
    }
  }, [editor, activeScene, activeObject, activePanel])

  // @ts-ignore
  const Component = Items[state.toolbox]

  return (
    <Flex
      h={Component ? "auto" : "49px"}
      borderBottom="0.25px solid #ebebeb"
      bg="#FFFFFF"
      padding={Component ? "0.5rem" : "0"}
    >
      {Component && <Component />}
    </Flex>
  )
}
