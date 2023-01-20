// import type { NextPage } from "next"
// import Head from "next/head"
// import DesignEditor from "components/DesignEditor"
import { Flex, useDisclosure } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { selectUser } from "../components/store/user/selector"
import DesignEditor from "../components/DesignEditor"
import SigninModal from "../components/Modals/AuthModal"

const Designer: any = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const user = useSelector(selectUser)
  const [typeSign, setTypeSign] = useState("signin")

  useEffect(() => {
    user === null && onOpen()
    setTypeSign("signin")
  }, [user])

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
