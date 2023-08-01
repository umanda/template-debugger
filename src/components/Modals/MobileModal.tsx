import { Box, Flex } from "@chakra-ui/react"
import Icons from ".././Icons"
import React from "react"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import * as PanelItems from "../DesignEditor/components/Panels/panelItems"
import { PANEL_ITEMS } from "~/constants/panel-items"

const MobileModal = () => {
  const { setActivePanel, activePanel, setIsSidebarVisible } = useDesignEditorContext()
  return (
    <Box display={"flex"}>
      <Flex
        flexDirection="column"
        borderRight="1px solid #ebebeb"
        width={"72px"}
        justifyContent="center"
        paddingBottom={"64px"}
        display={["flex", "flex", "none", "none"]}
      >
        {PANEL_ITEMS.map((item, index) => {
          //@ts-ignore
          const Icon = Icons[item.icon]
          return (
            <Flex
              onClick={() => {
                setIsSidebarVisible(true)
                if (setActivePanel) {
                  setActivePanel(item.id)
                }
              }}
              key={index}
              sx={{
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                height: "64px",
                gap: "4px",
                cursor: "pointer",
                color: activePanel === item.id ? "#5456F5" : "#545465"
              }}
              _hover={{
                color: "#5456F5"
              }}
            >
              <Box background={activePanel === item.id ? "#EBEDFB" : "#FFFFFF"}>
                <Icon size={24} />
              </Box>
              <Box sx={{ fontSize: "12px" }}>{item.label}</Box>
            </Flex>
          )
        })}
      </Flex>
      <PanelItemsMobile />
    </Box>
  )
}

const PanelItemsMobile = () => {
  const [state, setState] = React.useState({ selected: "Templates" })
  const { activeMenu, activePanel, isSidebarVisible, setIsSidebarVisible } = useDesignEditorContext()

  React.useEffect(() => {
    setState({ selected: activePanel })
  }, [activePanel])

  React.useEffect(() => {
    if (activeMenu) {
      setState({ selected: activeMenu })
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
            width: isSidebarVisible ? "320px" : "0px",
            overflow: "hidden",
            transition: "all 0.15s ease",
            position: "relative",
            borderRight: "1px solid #ebebeb",
            display: ["block", "block", "none", "none"]
          }}
        >
          <Panel />
        </Box>
      ) : null}
    </>
  )
}

export default MobileModal
