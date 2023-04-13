import { Flex, useDisclosure, useToast } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import DesignEditor from "~/components/DesignEditor"
import SigninModal from "~/components/Modals/AuthModal"
import { useNavigate, useParams } from "react-router-dom"
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
import { generateId } from "~/utils/unique"

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
  const isNewProject = localStorage.getItem("is_new_project")
  const navigate = useNavigate()
  const toast = useToast()

  useTokenInterceptor()

  useEffect(() => {
    design && lodaTemplateById()
  }, [design])

  const lodaTemplateById = useCallback(async () => {
    const plans = ["FREE", "PRO", "HERO"]
    try {
      if (design && user) {
        setLoadCanva(false)
        const resolve: any = (await dispatch(getProjectByKey(id))).payload
        setTimeout(async () => {
          try {
            await loadGraphicTemplate(resolve)
            await design.setDesign(resolve)
          } catch {}
        }, 100)
        let sceneNames: string[] = []
        for (const scn of resolve?.scenes) {
          sceneNames.push(scn.name)
        }
        await loadGraphicTemplate(resolve)
        setLoadCanva(true)
        localStorage.removeItem("is_new_project")
      } else {
        navigate(`/composer/${generateId("", 10)}`)
        setLoadCanva(true)
      }
    } catch (err: any) {
      try {
        let template: any
        if (templateId) {
          template = (await dispatch(putTemplate(templateId))).payload
          const indexPlanTemplate = plans.findIndex((p) => p === template.plan)
          const indexPlanUser = plans.findIndex((p) => p === user.plan)
          if (indexPlanUser >= indexPlanTemplate) {
            setTimeout(async () => {
              try {
                await loadGraphicTemplate(template)
                await design.setDesign(template)
                localStorage.removeItem("template_id")
              } catch {}
            }, 100)
          }
        }
        setLoadCanva(true)
      } catch {
        localStorage.removeItem("template_id")
        toast({
          title: "You need to upgrade your current subscription plan to customize this template.",
          status: "error",
          position: "top",
          duration: 2000,
          isClosable: true
        })
        setLoadCanva(true)
      }
    }
  }, [id, editor, user, design])

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
