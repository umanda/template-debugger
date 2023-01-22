import { Flex, useDisclosure } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { selectUser } from "../components/store/user/selector"
import DesignEditor from "../components/DesignEditor"
import SigninModal from "../components/Modals/AuthModal"
import { useNavigate, useParams } from "react-router-dom"
import { generateId } from "../components/utils/unique"
import * as api from "../.././src/components/services/api"
import { useAppDispatch } from "../components/store/store"
import { signInByToken } from "../components/store/user/action"

const Designer: any = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const user = useSelector(selectUser)
  const [typeSign, setTypeSign] = useState("signin")
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const dispath = useAppDispatch()

  console.log(user)

  useEffect(() => {
    if (user) {
      user?.token !== null && api.signInByToken(user.token)
    } else if (token) {
      token !== "" && dispath(signInByToken(token))
    } else {
      window.location.href = "https://beta.drawify.com/home"
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
