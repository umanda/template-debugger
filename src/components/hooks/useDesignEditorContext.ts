import { useContext } from "react"
import { DesignEditorContext } from "../contexts/DesignEditor"

function useDesignEditorContext() {
  const {
    namesPages,
    setNamesPages,
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
    setInputActive
  } = useContext(DesignEditorContext)
  return {
    namesPages,
    setNamesPages,
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
    setInputActive
  }
}

export default useDesignEditorContext
