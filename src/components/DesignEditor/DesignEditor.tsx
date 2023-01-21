import React from "react"
import { Box, Flex } from "@chakra-ui/react"
import { useAppDispatch } from "../store/store"
import { getFonts } from "../store/fonts/action"
import { getListDrawifiers } from "../store/user/action"
import PreviewDesign from "../Modals/PreviewDesign"
import Header from "./components/Header"
import Panels from "./components/Panels"
import Toolbox from "./components/Toolbox"
import Canvas from "./components/Canvas"
import Footer from "./components/Footer/Footer"

export default function DesignEditor() {
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    dispatch(getFonts())
    dispatch(getListDrawifiers({}))
  }, [])

  return (
    <Box display={"flex"} flex={1} flexDirection={"column"}>
      <Header />
      <PreviewDesign />
      <Flex flex={1}>
        <Panels />
        <Flex flex={1} flexDirection="column">
          <Toolbox />
          <Canvas />
          <Footer />
        </Flex>
      </Flex>
    </Box>
  )
}