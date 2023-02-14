import React, { useEffect } from "react"
import {
  Box,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Flex,
  IconButton,
  ModalBody,
  ModalHeader,
  Button,
  Spacer
} from "@chakra-ui/react"
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
    <Modal size="full" isOpen={isOpenPreview} onClose={onClosePreview}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex>
            <IconButton variant="ghost" aria-label="Home" icon={<Home size={30} />} onClick={onClosePreview} />
            <Spacer />
            <Button onClick={onClosePreview} variant="ghost">
              X
            </Button>
          </Flex>
        </ModalHeader>
        {/* <ModalCloseButton /> */}
        <ModalBody>
          <Flex flexDir="column" h="100%" w="full">
            <Flex h="80vh">
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  src={images[imageIndex]}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
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
            </Flex>
            <Flex w="full" flexDir="row">
              {/* <Flex position="absolute" display={`${imageIndex == 0 ? "none" : "block"}`}> */}
              <IconButton
                visibility={`${imageIndex == 0 ? "visible" : "hidden"}`}
                onClick={() => paginate(-1)}
                size="md"
                variant={"outline"}
                aria-label="left arrow"
                icon={<LeftArrow size={20} />}
              >
                Left
              </IconButton>
              <Spacer />
              {/* <Flex position="absolute" display={`${imageIndex >= scenes.length - 1 ? "none" : "block"}`}> */}
              <IconButton
                visibility={`${imageIndex >= scenes.length - 1 ? "visible" : "hidden"}`}
                onClick={() => paginate(1)}
                size="md"
                variant={"outline"}
                aria-label="right arrow"
                icon={<RightArrow size={20} />}
              >
                Right
              </IconButton>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
