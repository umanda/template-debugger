import { Flex, useDisclosure } from "@chakra-ui/react"
import { useDesign, useEditor } from "@layerhub-pro/react"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import DesignEditor from "../components/DesignEditor"
import useDesignEditorContext from "../components/hooks/useDesignEditorContext"
import SigninModal from "../components/Modals/AuthModal"
import * as api from "../components/services/api"

const Designer: any = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [typeSign, setTypeSign] = useState("signin")
  const editor = useEditor()
  const { setNamesPages } = useDesignEditorContext()
  const { id } = useParams()
  const design = useDesign()
  useEffect(() => {
    design && lodaTemplateById()
  }, [design])

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
