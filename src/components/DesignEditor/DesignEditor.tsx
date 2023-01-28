import React, { useCallback, useState } from "react"
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
  const [state, setSate] = useState<boolean>(false)
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
          {state ? <Canvas /> : <Loading state={state} setState={setSate} />}
          <Footer />
        </Flex>
      </Flex>
    </Box>
  )
}

function Loading({ setState, state }: { setState?: React.Dispatch<React.SetStateAction<boolean>>; state: boolean }) {
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    initialState()
  }, [])

  const initialState = useCallback(async () => {
    await dispatch(getFonts())
    await dispatch(getListDrawifiers({}))
    setState(true)
  }, [])

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100vh",
        width: "100vw"
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" viewBox="0 0 100 100">
        <circle cx="30" cy="50" fill="#000">
          <animate attributeName="r" values="0;5;0" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="50" fill="#000">
          <animate attributeName="r" values="0;5;0" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="70" cy="50" fill="#000">
          <animate attributeName="r" values="0;5;0" dur="1.2s" begin="0.8s" repeatCount="indefinite" />
        </circle>
      </svg>
      {"LOADING"}
    </div>
  )
}
