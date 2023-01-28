import { Flex, useDisclosure } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import DesignEditor from "../components/DesignEditor"
import SigninModal from "../components/Modals/AuthModal"
import { useParams } from "react-router-dom"
import * as api from "../.././src/components/services/api"
import { useDesign, useEditor } from "@layerhub-pro/react"
import useDesignEditorContext from "../components/hooks/useDesignEditorContext"

const Designer: any = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [typeSign, setTypeSign] = useState("signin")
  const { id } = useParams()
  const editor = useEditor()
  const { setNamesPages } = useDesignEditorContext()
  const design = useDesign()

  useEffect(() => {
    design && lodaTemplateById()
  }, [design])

  const lodaTemplateById = useCallback(async () => {
    try {
      if (design) {
        const resolve: any = await api.getProjectById({ id })
        setTimeout(async () => {
          await design.setDesign(resolve)
        }, 100)
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
