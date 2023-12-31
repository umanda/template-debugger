import React, { useCallback, useEffect } from "react"
import {
  Modal,
  ModalContent,
  ModalOverlay,
  Flex,
  IconButton,
  ModalBody,
  ModalHeader,
  Button,
  Spacer,
  Center,
  ModalFooter
} from "@chakra-ui/react"
import { useActiveScene, useScenes } from "@layerhub-pro/react"
import { motion, AnimatePresence } from "framer-motion"
import useIsOpenPreview from "~/hooks/useIsOpenPreview"
import Home from "../Icons/Home"
import LeftArrow from "../Icons/LeftArrow"
import RightArrow from "../Icons/RightArrow"

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
  const { isOpenPreview, onClosePreview, switchPage } = useIsOpenPreview()
  const currentScene = useActiveScene()
  const scenes = useScenes()
  const [images, setImages] = React.useState<string[]>([])
  const [options, setOptions] = React.useState<{ imageIndex: number; maxIndex: number }>({
    imageIndex: 0,
    maxIndex: 0
  })
  const paginate = useCallback(
    (newDirection: number) => {
      setPage([page + newDirection, newDirection])
    },
    [page]
  )

  useEffect(() => {
    isOpenPreview && page > 0 && paginate(-1)
  }, [switchPage.left])

  useEffect(() => {
    isOpenPreview && page < scenes.length - 1 && paginate(1)
  }, [switchPage.right])

  useEffect(() => {
    let previews: string[] = []
    for (const scn of scenes) {
      previews = previews.concat(scn.preview)
    }
    setImages(previews)
    setOptions({ ...options, maxIndex: previews.length })
    setPage([
      page + scenes.findIndex((s) => currentScene.id === s.id),
      scenes.findIndex((s) => currentScene.id === s.id)
    ])
  }, [])

  return (
    <Modal size="full" isOpen={isOpenPreview} onClose={onClosePreview}>
      <ModalOverlay />
      <ModalContent overflow="hidden">
        <ModalHeader>
          <Flex>
            <IconButton variant="ghost" aria-label="Home" icon={<Home size={30} />} onClick={onClosePreview} />
            <Spacer />
            <Button onClick={onClosePreview} variant="ghost">
              X
            </Button>
          </Flex>
        </ModalHeader>
        <ModalBody flexDir="column">
          <Center marginLeft="40px" draggable={false} w="90vw" marginRight="10vw">
            <Center h="80vh" w="100vw">
              <Flex h="full" boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.img
                    src={images[page]}
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
                      if (swipe < -swipeConfidenceThreshold && page < scenes.length - 1) {
                        paginate(1)
                      } else if (swipe > swipeConfidenceThreshold && page > 0) {
                        paginate(-1)
                      }
                    }}
                  />
                </AnimatePresence>
              </Flex>
            </Center>
          </Center>
          <ModalFooter marginTop="20px">
            <IconButton
              visibility={`${page <= 0 ? "hidden" : "visible"}`}
              onClick={() => paginate(-1)}
              size="md"
              variant={"outline"}
              aria-label="left arrow"
              icon={<LeftArrow size={20} />}
            />
            <Spacer />
            <IconButton
              zIndex={99}
              visibility={`${page >= scenes.length - 1 ? "hidden" : "visible"}`}
              onClick={() => paginate(1)}
              size="md"
              variant={"outline"}
              aria-label="right arrow"
              icon={<RightArrow size={20} />}
            />
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
