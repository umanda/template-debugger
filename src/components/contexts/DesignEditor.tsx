import { useDisclosure } from "@chakra-ui/react"
import { IFrame, IScene } from "@layerhub-pro/types"
import React from "react"
import { IResource } from "../interfaces/editor"

export interface IDesign {
  id: string
  name: string
  frame: IFrame
  type: string
  scenes: IScene[]
  previews: string[]
  metadata: {}
  colors?: string[]
  tags?: string[]
  imported?: boolean
}

export interface IResourceImage {
  page: number
  resource: IResource[]
}
interface DesignEditorState {
  isLoading: boolean
  preview: string
}

interface IDesignEditorContext {
  namesPages: string[]
  setNamesPages: React.Dispatch<React.SetStateAction<string[]>>
  activeMenu: string | null
  setActiveMenu: (option: string) => void
  activePanel: string
  setActivePanel: React.Dispatch<React.SetStateAction<string>>
  setIsScenesVisible: React.Dispatch<React.SetStateAction<boolean>>
  isScenesVisible: boolean
  setIsSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>
  isSidebarVisible: boolean
  isOpenPreview: boolean
  onOpenPreview: () => void
  onClosePreview: () => void
  indexColorPicker: number
  setIndexColorPicker: React.Dispatch<React.SetStateAction<number>>
  colorText: string
  setColorText: React.Dispatch<React.SetStateAction<string>>
  colors: { colorMap: any }
  setColors: React.Dispatch<React.SetStateAction<any>>
  inputActive: boolean
  setInputActive: React.Dispatch<React.SetStateAction<boolean>>
  activeScene: boolean
  setActiveScene: React.Dispatch<React.SetStateAction<boolean>>
}

export const DesignEditorContext = React.createContext<IDesignEditorContext>({
  namesPages: ["Untitled design"],
  setNamesPages: () => {},
  activeMenu: null,
  setActiveMenu: () => {},
  activePanel: "",
  setActivePanel: () => {},
  setIsScenesVisible: () => {},
  isScenesVisible: false,
  setIsSidebarVisible: () => {},
  isSidebarVisible: false,
  isOpenPreview: false,
  onOpenPreview: () => {},
  onClosePreview: () => {},
  indexColorPicker: 0,
  setIndexColorPicker: () => {},
  colorText: "",
  setColorText: () => {},
  colors: { colorMap: {} },
  setColors: () => {},
  inputActive: false,
  setInputActive: () => {},
  activeScene: false,
  setActiveScene: () => {}
})

export const DesignEditorProvider = ({ children }: { children: React.ReactNode }) => {
  const [namesPages, setNamesPages] = React.useState<string[]>(["Untitled design"])
  const [activePanel, setActivePanel] = React.useState<string>("Templates")
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null)
  const [isScenesVisible, setIsScenesVisible] = React.useState(true)
  const [isSidebarVisible, setIsSidebarVisible] = React.useState(true)
  const { isOpen: isOpenPreview, onOpen: onOpenPreview, onClose: onClosePreview } = useDisclosure()
  const [indexColorPicker, setIndexColorPicker] = React.useState<number>(-1)
  const [colorText, setColorText] = React.useState<string>("")
  const [colors, setColors] = React.useState<any>({ colorMap: {} })
  const [inputActive, setInputActive] = React.useState<boolean>(false)
  const [activeScene, setActiveScene] = React.useState<boolean>(false)

  const context = {
    namesPages,
    setNamesPages,
    activePanel,
    setActivePanel,
    activeMenu,
    setActiveMenu,
    isScenesVisible,
    setIsScenesVisible,
    isOpenPreview,
    onOpenPreview,
    onClosePreview,
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
  return <DesignEditorContext.Provider value={context}>{children}</DesignEditorContext.Provider>
}
