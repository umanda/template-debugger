import { Box, Center, Flex, Image } from "@chakra-ui/react"
import PreviewDesign from "../Modals/PreviewDesign"
import Header from "./components/Header"
import Panels from "./components/Panels"
import Toolbox from "./components/Toolbox"
import Canvas from "./components/Canvas"
import Footer from "./components/Footer/Footer"
import useResourcesContext from "~/hooks/useResourcesContext"

export default function DesignEditor() {
  const { loadCanva } = useResourcesContext()

  return (
    <Box display={"flex"} flex={1} flexDirection={"column"}>
      <Header />
      <PreviewDesign />
      <Flex flex={1}>
        <Panels />
        <Flex
          flex={1}
          position="relative"
          flexDirection="column"
          sx={{
            width: "calc(100vw - 392px)"
          }}
        >
          {loadCanva && <Toolbox />}
          <Flex flex={1}>
            <Canvas />
            {!loadCanva && <Loading />}
          </Flex>
          <Footer />
        </Flex>
      </Flex>
    </Box>
  )
}

function Loading() {
  const { previewCanva } = useResourcesContext()
  return (
    <Center bg="white" flex={1} h="full" w="full" position="absolute">
      {previewCanva === null ? (
        <>
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
            <img
              src="https://drawify-images.s3.eu-west-3.amazonaws.com/editor/canvasLoader.gif"
              style={{
                height: "75px",
                width: "75px"
              }}
            ></img>
            <p>{"LOADING"}</p>
          </div>
        </>
      ) : (
        <Image src={previewCanva} w="40vw" h="40vh" />
      )}
    </Center>
  )
}
