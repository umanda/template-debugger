import { Flex, useDisclosure } from "@chakra-ui/react"
import { useEditor, useScenes } from "@layerhub-pro/react"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import DesignEditor from "../components/DesignEditor"
import useDesignEditorContext from "../components/hooks/useDesignEditorContext"
import SigninModal from "../components/Modals/AuthModal"
import * as api from "../components/services/api"
import { generateId } from "../components/utils/unique"

const Designer: any = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [typeSign, setTypeSign] = useState("signin")
  const editor = useEditor()
  const scenes = useScenes()
  const { setNamesPages } = useDesignEditorContext()
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    editor && lodaTemplateById()
  }, [editor])

  const lodaTemplateById = useCallback(async () => {
    try {
      console.log("load by id")
      const resolve: any = await api.getProjectById({ id })
      editor?.design?.setDesign(resolve)
      let sceneNames: string[] = []
      for (const scn of resolve.scenes) {
        sceneNames.push(scn.name)
      }
      setNamesPages(sceneNames)
    } catch (err: any) {
      navigate(`/composer/${generateId("proj")}`)
    }
  }, [id, navigate, editor])

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
