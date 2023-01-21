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
    designEditorLoading,
    setDesignEditorLoading,
    isSidebarVisible,
    setIsSidebarVisible,
    indexColorPicker,
    setIndexColorPicker,
    colorText,
    setColorText,
    colors,
    setColors
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
    designEditorLoading,
    setDesignEditorLoading,
    isSidebarVisible,
    setIsSidebarVisible,
    indexColorPicker,
    setIndexColorPicker,
    colorText,
    setColorText,
    colors,
    setColors
  }
}

export default useDesignEditorContext