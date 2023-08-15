import { Flex, Image, Modal, ModalCloseButton, ModalContent, Text } from "@chakra-ui/react"

export default function IAGenerate({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal onClose={onClose} size="xl" isOpen={isOpen} isCentered>
      <ModalContent>
        <ModalCloseButton />
        <Flex margin="20px" gap={4}>
          <Image boxSize="max" src="https://drawify-images.s3.eu-west-3.amazonaws.com/editor/ia_loading.png" />
          <Flex flexDir="column">
            <Flex fontWeight={600} color="#5456F5" fontSize="24px">
              BOOM!
            </Flex>
            <Text lineHeight="24px" textAlign="justify" fontWeight={400} fontSize="16px">
              <b>Your auto-generated composition is done.</b> You can now edit any elements you like.
              <br />
              <br /> To generate a new composition, enter your prompt and click <b>Generate another</b>.
            </Text>
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  )
}
