import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea
} from "@chakra-ui/react"
import { useSelector } from "react-redux"
import { selectUser } from "../store/user/selector"
const redirectPayments = import.meta.env.VITE_PAYMENTS

export default function NoSearchFound({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}) {
  const user = useSelector(selectUser)

  return (
    <Modal isCentered onClose={onClose} isOpen={isOpen} motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>REQUES AN IMAGE</ModalHeader>
        <ModalBody>
          <Flex flexDir="column">
            {user.plan === "HERO"
              ? "Describe the image you would like"
              : "Sorry! Your current plan does not support this feature. To send your request for an image, upgrade to Drawify Hero."}
          </Flex>
          <Flex visibility={user.plan === "HERO" ? "visible" : "hidden"}>
            <Textarea />
          </Flex>
        </ModalBody>
        <ModalFooter gap="10px">
          <Button colorScheme="gray" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme={"brand"} onClick={() => (window.location.href = redirectPayments)}>
            {user.plan === "HERO" ? "Send image request" : "Upgrade"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
