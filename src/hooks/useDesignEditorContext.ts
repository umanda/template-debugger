import { useContext } from "react"
import { DesignEditorContext } from "../contexts/DesignEditor"

function useDesignEditorContext() {
  const {
    activeMenu,
    setActiveMenu,
    activePanel,
    setActivePanel,
    isScenesVisible,
    setIsScenesVisible,
    isSidebarVisible,
    setIsSidebarVisible,
    indexColorPicker,
    setIndexColorPicker,
    colorText,
    setColorText,
    colors,
    setColors,
    inputActive,
    setInputActive,
    activeScene,
    setActiveScene
  } = useContext(DesignEditorContext)
  return {
    activePanel,
    setActivePanel,
    activeMenu,
    setActiveMenu,
    isScenesVisible,
    setIsScenesVisible,
    isSidebarVisible,
    setIsSidebarVisible,
    indexColorPicker,
    setIndexColorPicker,
    colorText,
    setColorText,
    colors,
    setColors,
    inputActive,
    setInputActive,
    activeScene,
    setActiveScene
  }
}

export default useDesignEditorContext
