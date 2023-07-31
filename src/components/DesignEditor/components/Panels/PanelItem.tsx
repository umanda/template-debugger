import React, { useCallback } from "react"
import { Box, Portal } from "@chakra-ui/react"
import * as PanelItems from "./panelItems"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import ChevronLeft from "../../../Icons/ChevronLeft"

export default function PanelItem() {
  const [statePanel, setStatePanel] = React.useState({ selected: "Templates" })
  const [stateMenu, setStateMenu] = React.useState({ selected: "" })
  const { activeMenu, activePanel, isSidebarVisible, setIsSidebarVisible, setActivePanel } = useDesignEditorContext()
  const filterResource = localStorage.getItem("drawing_filter")

  React.useEffect(() => {
    setStatePanel({ selected: activePanel })
  }, [activePanel])

  React.useEffect(() => {
    if (activeMenu) {
      setStateMenu({ selected: activeMenu })
    } else if (filterResource) {
      setActivePanel("Illustrations")
    } else {
      setStateMenu({ selected: "" })
    }
  }, [activeMenu])

  const makeSidebarVisible = useCallback(() => {
    setIsSidebarVisible(false)
  }, [isSidebarVisible])

  //@ts-ignore
  const Panel = PanelItems[statePanel.selected]

  const Menu = PanelItems[stateMenu.selected]

  return (
    <>
      {Panel ? (
        <Box
          sx={{
            width: isSidebarVisible ? "320px" : "0px",
            overflow: "hidden",
            transition: "all 0.15s ease",
            borderRight: "1px solid #ebebeb",
            display: ["none", "none", "block", "block"]
          }}
        >
          {isSidebarVisible && (
            <Portal>
              <Box
                onClick={makeSidebarVisible}
                sx={{
                  position: "absolute",
                  height: "24px",
                  width: "24px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  top: "50%",
                  transform: "translateY(-50%)",
                  left: "380px",
                  boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.06)",
                  display: ["none", "none", "grid", "grid"],
                  placeContent: "center",
                  cursor: "pointer",
                  color: "#545465"
                }}
              >
                <ChevronLeft size={24} />
              </Box>
            </Portal>
          )}
          {stateMenu.selected !== "" && (
            <Box h="full">
              <Menu />
            </Box>
          )}
          <Box
            visibility={isSidebarVisible ? "visible" : "hidden"}
            position={stateMenu.selected !== "" ? "fixed" : "absolute"}
            h="92vh"
          >
            <Panel />
          </Box>
        </Box>
      ) : null}
    </>
  )
}
