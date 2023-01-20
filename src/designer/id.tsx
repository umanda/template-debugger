import { Flex, useDisclosure } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { selectUser } from "../components/store/user/selector"
import DesignEditor from "../components/DesignEditor"
import SigninModal from "../components/Modals/AuthModal"
import { useNavigate, useParams } from "react-router-dom"
import { generateId } from "../components/utils/unique"
import * as api from "../.././src/components/services/api"

const Designer: any = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const user = useSelector(selectUser)
  const [typeSign, setTypeSign] = useState("signin")
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (user) {
      user?.token !== null && api.signInByToken(user.token)
    } else if (token) {
      console.log(token)
    } else {
      // window.location.href = "https://beta.drawify.com/"
      console.log("redirect base beta drawify")
    }
    id === undefined && navigate(`/composer/${generateId("proj")}`)
  }, [])

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
