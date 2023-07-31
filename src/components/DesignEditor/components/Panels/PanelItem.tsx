import React from "react"
import { Box, Portal } from "@chakra-ui/react"
import * as PanelItems from "./panelItems"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import ChevronLeft from "../../../Icons/ChevronLeft"

export default function PanelItem() {
  const [state, setState] = React.useState({ selected: "Templates" })
  const { activeMenu, activePanel, isSidebarVisible, setIsSidebarVisible, setActivePanel } = useDesignEditorContext()
  const filterResource = localStorage.getItem("drawing_filter")

  React.useEffect(() => {
    setState({ selected: activePanel })
  }, [activePanel])

  React.useEffect(() => {
    if (activeMenu) {
      setState({ selected: activeMenu })
    } else if (filterResource) {
      setActivePanel("Illustrations")
    } else {
      setState({ selected: activePanel })
    }
  }, [activeMenu])

  React.useEffect(() => {
    setIsSidebarVisible(true)
  }, [state])
  // @ts-ignore
  const Panel = PanelItems[state.selected]

  return (
    <>
      {Panel ? (
        <Box
          sx={{
            width: isSidebarVisible ? "400px" : "0px",
            overflow: "hidden",
            transition: "all 0.15s ease",
            position: "relative",
            borderRight: "1px solid #ebebeb",
            display: ["none", "none", "block", "block"]
          }}
        >
          {isSidebarVisible && (
            <Portal>
              <Box
                onClick={() => {
                  setIsSidebarVisible(false)
                }}
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
          <Panel />
        </Box>
      ) : null}
    </>
  )
}
