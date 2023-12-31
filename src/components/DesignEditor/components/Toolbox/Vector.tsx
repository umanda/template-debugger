import { Box, Flex, Grid } from "@chakra-ui/react"
import { useActiveObject, useActiveScene } from "@layerhub-pro/react"
import React, { useEffect, useRef } from "react"
import Common from "./Common"
import groupBy from "lodash/groupBy"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"

export default function Vector() {
  const {
    setActiveMenu,
    indexColorPicker,
    setIndexColorPicker,
    colors,
    setColors,
    activeMenu,
    isSidebarVisible,
    setIsSidebarVisible
  } = useDesignEditorContext()
  const activeObject = useActiveObject() as any
  const vectorPaths = useRef<any>({})
  const activeScene = useActiveScene()
  const [statePrevSidebar, setStatePrevSidebar] = React.useState<boolean>(true)

  useEffect(() => {
    if (activeObject && activeObject.type === "StaticVector") {
      if (activeObject.type === "StaticVector") {
        indexColorPicker > Object.values(activeObject?.colorMap).length - 1 &&
          setIndexColorPicker(Object.values(activeObject?.colorMap).length - 1)
      }
      const objects = activeObject?._objects[0]?._objects
      const objectColors = groupBy(objects, "fill")
      vectorPaths.current = objectColors
      setColors({ ...colors, colorMap: activeObject.colorMap })
    } else setIndexColorPicker(-1)
  }, [activeScene, activeObject])

  const changeSidebar = React.useCallback(
    (menu: string, index: number) => {
      if (activeMenu !== menu) {
        setActiveMenu(menu)
        setStatePrevSidebar(isSidebarVisible)
        setIsSidebarVisible(true)
        setIndexColorPicker(index)
      } else if (indexColorPicker === index) {
        setIsSidebarVisible(statePrevSidebar)
        setActiveMenu("")
        setIndexColorPicker(-1)
      } else {
        setIndexColorPicker(index)
      }
    },
    [isSidebarVisible, activeMenu, isSidebarVisible, statePrevSidebar, indexColorPicker]
  )

  return (
    <Flex flex={1} alignItems={"center"} justifyContent={"space-between"}>
      <Flex flexDir="row" gap="10px">
        <Grid gap="10px" templateColumns="repeat(20, 1fr)">
          {Object?.values(colors?.colorMap)?.map((c: any, index) => {
            return (
              <Flex
                key={index}
                background={c}
                _hover={{ cursor: "pointer" }}
                borderWidth={indexColorPicker === index ? "2px" : "1px"}
                borderStyle="solid"
                borderColor={indexColorPicker === index ? "brand.500" : "#A9A9B2"}
                onClick={() => {
                  changeSidebar("VectorColorPicker", index)
                }}
                boxSize="30px"
                borderRadius="20%"
              />
            )
          })}
        </Grid>
      </Flex>
      <Box>
        <Common />
      </Box>
    </Flex>
  )
}
