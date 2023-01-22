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
    lodaTemplateById()
  }, [])

  const lodaTemplateById = useCallback(async () => {
    try {
      console.log("load by id")
      const resolve: any = await api.getProjectById({ id })
      // editor?.design?.setDesign(resolve)
      console.log(resolve)
      let sceneNames: string[] = []
      let cont = 0
      for (const scn of resolve.scenes) {
        scenes[cont].setScene(scn)
        sceneNames.push(scn.name)
      }
      cont++
      setNamesPages(sceneNames)
    } catch (err: any) {
      console.log("change page", err)
      navigate(`/composer/${generateId("proj")}`)
    }
  }, [id, navigate])

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
