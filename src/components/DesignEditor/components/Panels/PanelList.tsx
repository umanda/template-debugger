import { Box, Flex } from "@chakra-ui/react"
import Icons from "~/components/Icons"
import { useEditor } from "@layerhub-pro/react"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import { PANEL_ITEMS } from "~/constants/panel-items"
import { useCallback } from "react"

export default function PaneList() {
  const { setActivePanel, activePanel, setIsSidebarVisible, isSidebarVisible } = useDesignEditorContext()
  const editor = useEditor()

  const openSidebar = useCallback(
    (id: string) => {
      if (id !== activePanel || isSidebarVisible === false) {
        setIsSidebarVisible(true)
        if (editor?.freeDrawer?.canvas?.isDrawingMode) {
          editor.freeDrawer.disable()
        }
        if (setActivePanel) {
          setActivePanel(id)
        }
      } else {
        setIsSidebarVisible(false)
      }
    },
    [editor, isSidebarVisible, activePanel]
  )

  return (
    <Flex
      flexDirection="column"
      borderRight="1px solid #ebebeb"
      width={"72px"}
      justifyContent="center"
      paddingBottom={"64px"}
      display={["none", "none", "flex", "flex"]}
    >
      {PANEL_ITEMS.map((item, index) => {
        //@ts-ignore
        const Icon = Icons[item.icon]
        return (
          <Flex
            onClick={() => openSidebar(item.id)}
            key={index}
            sx={{
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              height: "64px",
              gap: "4px",
              cursor: "pointer",
              color: activePanel === item.id && isSidebarVisible === true ? "#5456F5" : "#545465"
            }}
            _hover={{
              color: "#5456F5"
            }}
          >
            <Box background={activePanel === item.id && isSidebarVisible === true ? "#EBEDFB" : "#FFFFFF"}>
              <Icon size={24} />
            </Box>
            <Box sx={{ fontSize: "12px" }}>{item.label}</Box>
          </Flex>
        )
      })}
    </Flex>
  )
}
