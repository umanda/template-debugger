import { Box, Center, Flex, Image } from "@chakra-ui/react"
import PreviewDesign from "../Modals/PreviewDesign"
import Header from "./components/Header"
import Panels from "./components/Panels"
import Toolbox from "./components/Toolbox"
import Canvas from "./components/Canvas"
import Footer from "./components/Footer/Footer"
import useResourcesContext from "~/hooks/useResourcesContext"

export default function DesignEditor() {
  const { loadCanva, downloadCanva } = useResourcesContext()

  return (
    <Box display={"flex"} flex={1} h="100vh" w="100vw" flexDirection={"column"}>
      <Header />
      <PreviewDesign />
      <Flex flex={1} h="100vh">
        <Panels />
        <Flex flexDirection="column" w="full">
          <>
            <Toolbox />
            <Flex flex={1}>
              <Canvas />
            </Flex>
            <Footer />
          </>
          {!loadCanva && <Loading />}
          {downloadCanva && <Downloading />}
        </Flex>
      </Flex>
    </Box>
  )
}

function Loading() {
  const { previewCanva } = useResourcesContext()
  return (
    <Center bg="white" w="calc(100vw - 392px)" h="calc(100vh - 70px)" flex={1} position="absolute">
      {previewCanva === null ? (
        <>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column"
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

function Downloading() {
  return (
    <Center bg="white" opacity={0.5} w="calc(100vw - 392px)" h="calc(100vh - 70px)" flex={1} position="absolute">
      <>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
          }}
        >
          <img
            src="https://drawify-images.s3.eu-west-3.amazonaws.com/editor/loading.gif"
            style={{
              height: "75px",
              width: "75px"
            }}
          ></img>
          <p>{"DOWNLOADING"}</p>
        </div>
      </>
    </Center>
  )
}
