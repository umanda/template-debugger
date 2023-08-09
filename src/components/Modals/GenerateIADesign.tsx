import { Center, Image, Modal, ModalContent, ModalOverlay, Text } from "@chakra-ui/react"

export default function GenerateIADesign({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal closeOnEsc={false} closeOnOverlayClick={false} onClose={onClose} size="xl" isOpen={isOpen} isCentered>
      <ModalOverlay backdropBlur="blur(10px) hue-rotate(90deg)" />
      <ModalContent>
        <Center marginBlock="20px" w="full" gap={4} flexDir="column">
          <Text fontWeight={500} color="#5456F5" fontSize="24px">
            Your composition is being generated
          </Text>
          <Image
            boxSize="max"
            src="https://drawify-images.s3.eu-west-3.amazonaws.com/editor/magic_wand_animation.gif"
          />
          <Text fontWeight={400} color="#545465" fontSize="16px">
            Images being thrown around...
          </Text>
        </Center>
      </ModalContent>
    </Modal>
  )
}
