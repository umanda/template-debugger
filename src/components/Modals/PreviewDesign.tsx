import React, { useEffect } from "react"
import { Box, Modal, ModalCloseButton, ModalContent, ModalOverlay, Flex, IconButton, Center } from "@chakra-ui/react"
import { useEditor, useScenes } from "@layerhub-pro/react"
import { motion, AnimatePresence } from "framer-motion"
import { wrap } from "popmotion"
import useIsOpenPreview from "../hooks/useIsOpenPreview"
import Home from "../Icons/Home"
import LeftArrow from "../Icons/LeftArrow"
import RightArrow from "../Icons/RightArrow"
import Pencil from "../Icons/Pencil"
import Eraser from "../Icons/Eraser"

export default function PreviewDesign() {
  const { isOpenPreview } = useIsOpenPreview()
  return <>{isOpenPreview && <PreviewModal />}</>
}
const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    }
  }
}
const swipeConfidenceThreshold = 10000
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity
}

function PreviewModal() {
  const [[page, direction], setPage] = React.useState([0, 0])
  const { isOpenPreview, onClosePreview } = useIsOpenPreview()
  const scenes = useScenes()
  const [images, setImages] = React.useState<string[]>([])
  const [options, setOptions] = React.useState<{ imageIndex: number; maxIndex: number }>({
    imageIndex: 0,
    maxIndex: 0
  })
  const imageIndex = wrap(0, scenes.length, page)
  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection])
  }

  useEffect(() => {
    let previews: string[] = []
    for (const scn of scenes) {
      previews = previews.concat(scn.preview)
    }
    setImages(previews)
    setOptions({ ...options, maxIndex: previews.length })
  }, [])

  return (
    <Modal size={"full"} isOpen={isOpenPreview} onClose={onClosePreview}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <Box sx={{ height: "100vh", width: "100vw" }}>
          <Flex flexDir={"column"} sx={{ height: "calc(100vh - 80px)" }}>
            <IconButton
              w="50px"
              variant="ghost"
              marginLeft="5px"
              marginTop="10px"
              aria-label="Home"
              icon={<Home size={30} />}
              onClick={onClosePreview}
            />
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1
                }}
              >
                <AnimatePresence initial={false} custom={direction}>
                  <motion.img
                    key={page}
                    src={images[imageIndex]}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    className="slides"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = swipePower(offset.x, velocity.x)

                      if (swipe < -swipeConfidenceThreshold) {
                        paginate(1)
                      } else if (swipe > swipeConfidenceThreshold) {
                        paginate(-1)
                      }
                    }}
                  />
                </AnimatePresence>
              </Box>
            </Box>
          </Flex>

          <Box
            sx={{
              display: "flex",
              width: "95%",
              h: "40px",
              margin: "auto",
              position: "relative"
            }}
          >
            <Box position="absolute" left={"0"} padding={"5px"} display={`${imageIndex == 0 ? "none" : "block"}`}>
              <IconButton
                onClick={() => paginate(-1)}
                size="md"
                variant={"outline"}
                aria-label="left arrow"
                icon={<LeftArrow size={20} />}
              >
                Left
              </IconButton>
            </Box>
            {/* <Box position="absolute" left={"45%"} right={"45%"} padding={"5px"}>
              <Center gap="0.5rem">
                <IconButton size="md" aria-label="pencil" variant={"outline"} icon={<Pencil size={20} />} />
                <IconButton size="md" aria-label="eraser" variant={"outline"} icon={<Eraser size={20} />} />
              </Center>
            </Box> */}
            <Box
              position="absolute"
              right={"0"}
              padding={"5px"}
              display={`${imageIndex >= scenes.length - 1 ? "none" : "block"}`}
            >
              <IconButton
                onClick={() => paginate(1)}
                size="md"
                variant={"outline"}
                aria-label="right arrow"
                icon={<RightArrow size={20} />}
              >
                Right
              </IconButton>
            </Box>
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  )
}
