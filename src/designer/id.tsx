import { Flex, useDisclosure } from "@chakra-ui/react"
import { useState } from "react"
import DesignEditor from "../components/DesignEditor"
import SigninModal from "../components/Modals/AuthModal"

const Designer: any = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [typeSign, setTypeSign] = useState("signin")

  return (
    <Flex sx={{ height: "100vh", width: "100vw" }}>
      <SigninModal setType={setTypeSign} type={typeSign} onClose={onClose} isOpen={isOpen} onOpen={onOpen} />
      <Flex flex={1}>
        <DesignEditor />
      </Flex>
    </Flex>
  )
}

export default Designer
