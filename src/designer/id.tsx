import { Flex, useDisclosure } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { selectUser } from "../components/store/user/selector"
import DesignEditor from "../components/DesignEditor"
import SigninModal from "../components/Modals/AuthModal"
import { useNavigate, useParams } from "react-router-dom"
import { generateId } from "../components/utils/unique"
import * as api from "../.././src/components/services/api"
import { useAppDispatch } from "../components/store/store"
import { signInByToken } from "../components/store/user/action"
import { useDesign, useEditor } from "@layerhub-pro/react"
import useDesignEditorContext from "../components/hooks/useDesignEditorContext"
const redirectHome = import.meta.env.VITE_REDIRECT_HOME

const Designer: any = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const user = useSelector(selectUser)
  const [typeSign, setTypeSign] = useState("signin")
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const dispath = useAppDispatch()
  const editor = useEditor()
  const { setNamesPages } = useDesignEditorContext()
  const design = useDesign()

  useEffect(() => {
    design && lodaTemplateById()
  }, [design])

  useEffect(() => {
    if (user) {
      user?.token !== null && api.signInByToken(user.token)
    } else if (token) {
      token !== "" && dispath(signInByToken(token))
    } else {
      window.location.href = redirectHome
    }
    id === undefined && navigate(`/composer/${generateId("proj")}`)
  }, [user])

  const lodaTemplateById = useCallback(async () => {
    try {
      if (design) {
        const resolve: any = await api.getProjectById({ id })
        setTimeout(() => {
          design.setDesign(resolve)
        }, 1000)
        let sceneNames: string[] = []
        for (const scn of resolve.scenes) {
          sceneNames.push(scn.name)
        }
        setNamesPages(sceneNames)
      }
    } catch (err: any) {}
  }, [id, editor])

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
