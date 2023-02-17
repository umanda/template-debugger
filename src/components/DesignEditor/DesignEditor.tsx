import { Box, Center, Flex } from "@chakra-ui/react"
import PreviewDesign from "../Modals/PreviewDesign"
import Header from "./components/Header"
import Panels from "./components/Panels"
import Toolbox from "./components/Toolbox"
import Canvas from "./components/Canvas"
import Footer from "./components/Footer/Footer"

export default function DesignEditor({ state }: { state?: boolean }) {
  return (
    <Box display={"flex"} flex={1} flexDirection={"column"}>
      <Header />
      <PreviewDesign />
      <Flex flex={1}>
        <Panels />
        <Flex flex={1} position="relative" flexDirection="column">
          {state && <Toolbox />}
          <Flex flex={1}>
            <Canvas />
            {!state && <Loading />}
          </Flex>
          <Footer />
        </Flex>
      </Flex>
    </Box>
  )
}

function Loading() {
  return (
    <Center bg="white" flex={1} h="full" w="full" position="absolute">
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
    </Center>
  )
}
