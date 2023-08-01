import React from "react"
import { Modal, ModalOverlay, ModalContent, ModalFooter, Text, Flex } from "@chakra-ui/react"
import Signin from "./Signin"
import Signup from "./Signup"

export type AuthType = string

function SigninModal({
  isOpen,
  onClose,
  type,
  setType
}: {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  type: string
  setType: React.Dispatch<React.SetStateAction<AuthType>>
}) {
  return (
    <Modal isOpen={isOpen} closeOnEsc={false} closeOnOverlayClick={false} onClose={onClose} isCentered>
      <ModalOverlay width="100%" h="100%" />
      <ModalContent>
        {type === "signin" ? (
          <Signin onClose={onClose} setAuthtype={setType} />
        ) : (
          <Signup onClose={onClose} setAuthtype={setType} />
        )}
        <ModalFooter alignContent="left" justifyContent="left">
          <Flex flexDir="column" fontSize="12px" fontWeight="400">
            <Text>© 2022 Drawify. All Rights Reserved. Belgium Incorporated Company.</Text>
            <Text
              onClick={() => {
                window.open("terms-and-conditions.pdf", "_blank")
              }}
              _hover={{ cursor: "pointer", textDecor: "underline" }}
              w="105px"
            >
              Terms & Conditions
            </Text>
            <Text
              onClick={() => {
                window.open("privacy_notice.pdf", "_blank")
              }}
              _hover={{ cursor: "pointer", textDecor: "underline" }}
              w="75px"
            >
              Privacy Policy
            </Text>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default SigninModal
