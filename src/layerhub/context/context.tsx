import * as React from "react"
import { IState, Scene } from "@layerhub-pro/core"
import { DragMode } from "@layerhub-pro/types"

const Context = React.createContext<IState>({
  zoomRatio: 1,
  activeObject: null,
  activeScene: null,
  contextMenuRequest: null,
  frame: null,
  background: null,
  objects: [],
  scenes: [],
  editor: null,
  design: null,
  template: null,
  paramMenuRequest: null,
  isFreeDrawing: false,
  isCropping: false,
  setActiveObject: () => {},
  setActiveScene: () => {},
  setContextMenuRequest: () => {},
  setFrame: () => {},
  setBackground: () => {},
  setTemplate: () => {},
  setObjects: () => {},
  setScenes: () => {},
  setZoomRatio: () => {},
  setEditor: () => {},
  setDesign: () => {},
  setParamMenuRequest: () => {},
  setIsFreeDrawing: () => {},
  setIsCropping: () => {},
  dragMode: "IDLE",
  setDragMode(o) {},
})

const Provider = ({ children }: { children: React.ReactNode }) => {
  const [zoomRatio, setZoomRatio] = React.useState(1)
  const [activeObject, setActiveObject] = React.useState(null)
  const [isFreeDrawing, setIsFreeDrawing] = React.useState(false)
  const [isCropping, setIsCropping] = React.useState(false)
  const [activeScene, setActiveScene] = React.useState<Scene | null>(null)
  const [frame, setFrame] = React.useState(null)
  const [background, setBackground] = React.useState(null)
  const [template, setTemplate] = React.useState(null)
  const [editor, setEditor] = React.useState(null)
  const [design, setDesign] = React.useState(null)
  const [contextMenuRequest, setContextMenuRequest] = React.useState(null)
  const [objects, setObjects] = React.useState([])
  const [scenes, setScenes] = React.useState([])
  const [paramMenuRequest, setParamMenuRequest] = React.useState(null)
  const [dragMode, setDragMode] = React.useState<DragMode>("IDLE")
  return (
    <Context.Provider
      value={{
        zoomRatio,
        setZoomRatio,
        activeObject,
        setActiveObject,
        frame,
        setFrame,
        contextMenuRequest,
        setContextMenuRequest,
        objects,
        setObjects,
        editor,
        setEditor,
        scenes,
        setScenes,
        activeScene,
        setActiveScene,
        paramMenuRequest,
        setParamMenuRequest,
        background,
        setBackground,
        design,
        setDesign,
        isFreeDrawing,
        setIsFreeDrawing,
        template,
        setTemplate,
        isCropping,
        setIsCropping,
        dragMode,
        setDragMode,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export { Context, Provider }
