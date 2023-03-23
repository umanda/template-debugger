import { Flex, useDisclosure } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import DesignEditor from "~/components/DesignEditor"
import SigninModal from "~/components/Modals/AuthModal"
import { useParams } from "react-router-dom"
import { useDesign, useEditor } from "@layerhub-pro/react"
import { useAppDispatch } from "~/store/store"
import { useSelector } from "react-redux"
import { selectUser } from "~/store/user/selector"
import { getProjectByKey, updateProject } from "~/store/project/action"
import { loadGraphicTemplate } from "../utils/fonts"
import useResourcesContext from "~/hooks/useResourcesContext"
import { useTokenInterceptor } from "~/hooks/useTokenInterceptor"
import * as api from "~/services/api"
import { putTemplate } from "~/store/templates/action"

const Designer: any = () => {
  const { setLoadCanva } = useResourcesContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [typeSign, setTypeSign] = useState("signin")
  const { id } = useParams()
  const editor = useEditor()
  const design = useDesign()
  const dispatch = useAppDispatch()
  const user = useSelector(selectUser)
  const templateId = localStorage.getItem("template_id")

  useTokenInterceptor()

  useEffect(() => {
    design && lodaTemplateById()
  }, [design])

  const lodaTemplateById = useCallback(async () => {
    try {
      if (design && user) {
        setLoadCanva(false)
        const resolve: any = (await dispatch(getProjectByKey(id))).payload
        let template: any
        if (templateId) {
          template = (await dispatch(putTemplate(id))).payload
        }
        setTimeout(async () => {
          try {
            if (templateId === null || templateId === undefined) {
              await loadGraphicTemplate(resolve)
              await design.setDesign(resolve)
            } else {
              await loadGraphicTemplate(template)
              await design.setDesign(template)
              localStorage.removeItem("template_id")
            }
          } catch {}
        }, 100)
        let sceneNames: string[] = []
        for (const scn of resolve?.scenes) {
          sceneNames.push(scn.name)
        }
        await loadGraphicTemplate(resolve)
        setLoadCanva(true)
      } else {
        setLoadCanva(true)
      }
    } catch (err: any) {
      setLoadCanva(true)
    }
  }, [id, editor, user, design])

  // const functionSave = useCallback(async () => {
  //   try {
  //     let designJSON: any = design?.toJSON()
  //     designJSON.key = id
  //     designJSON.scenes.map((e: any, index: number) => {
  //       e.position = index
  //       e.metadata = { orientation: e.frame.width === e.frame.height ? "PORTRAIT" : "LANDSCAPE" }
  //       return e
  //     })
  //     user && (await dispatch(updateProject(designJSON))).payload
  //   } catch {}
  // }, [editor, design, id])

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
