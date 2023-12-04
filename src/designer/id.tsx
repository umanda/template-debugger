import { Flex, useDisclosure, useToast } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import DesignEditor from "~/components/DesignEditor"
import SigninModal from "~/components/Modals/AuthModal"
import { useNavigate, useParams } from "react-router-dom"
import { useDesign, useEditor, useZoomRatio } from "@layerhub-pro/react"
import { useAppDispatch } from "~/store/store"
import { useSelector } from "react-redux"
import { selectUser } from "~/store/user/selector"
import { getProjectByKey } from "~/store/project/action"
import { loadGraphicTemplate } from "../utils/fonts"
import useResourcesContext from "~/hooks/useResourcesContext"
import { useTokenInterceptor } from "~/hooks/useTokenInterceptor"
import { putTemplate } from "~/store/templates/action"
import { generateId } from "~/utils/unique"
import { IDesign } from "~/layerhub/types"
import IAGenerate from "~/components/Modals/IAGenerate"

const Designer: any = () => {
  const { setLoadCanva, setDimensionZoom, loadCanva } = useResourcesContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpenIAGenerate, onOpen: onOpenIAGenerate, onClose: onCloseIAGenerate } = useDisclosure()
  const [typeSign, setTypeSign] = useState("signin")
  const { id } = useParams()
  const editor = useEditor()
  const design = useDesign()
  const dispatch = useAppDispatch()
  const user = useSelector(selectUser)
  const aiGeneratedData = localStorage.getItem("ai_generated_data")
  const aiGenerate = localStorage.getItem("ai_generated")
  const templateId = localStorage.getItem("template_id")
  const navigate = useNavigate()
  const toast = useToast()
  const zoomRatio = useZoomRatio() as number

  useTokenInterceptor()

  useEffect(() => {
    design && lodaTemplateById()
  }, [design])

  useEffect(() => {
    loadCanva === true && setDimensionZoom(zoomRatio)
  }, [loadCanva])

  useEffect(() => {
    aiGenerate === "true" && onOpenIAGenerate()
    localStorage.setItem("ai_generated",'false')
  }, [aiGenerate])

  const lodaTemplateById = useCallback(async () => {
    try {
      if (design && user) {
        setLoadCanva(false)
        const resolve = (await dispatch(getProjectByKey(id))).payload as IDesign
        await loadGraphicTemplate(resolve)
        await design.setDesign(resolve)
        design.activeScene.applyFit()
        setLoadCanva(true)
        localStorage.removeItem("is_new_project")
      } else {
        navigate(`/composer/${generateId("", 10)}`)
        design.activeScene.applyFit()
        setLoadCanva(true)
      }
    } catch (err: any) {
      try {
        let template: any
        if (templateId) {
          template = (await dispatch(putTemplate(templateId))).payload
          localStorage.removeItem("template_id")
          if (template) {
            setTimeout(async () => {
              try {
                await loadGraphicTemplate(template)
                await design.setDesign(template)
              } catch {
                toast({
                  title: template?.message.includes("must upgrade plan")
                    ? "Please upgrade your plan to access this template"
                    : "The template does not exist, please try again later, if the problem persists, please contact info@drawify.com .",
                  status: "error",
                  position: "top",
                  duration: 2000,
                  isClosable: true
                })
              }
            }, 100)
          }
        } else if (aiGenerate === "true") {
          const jsonAI = JSON.parse(aiGeneratedData)
          await loadGraphicTemplate(jsonAI)
          await design.setDesign(jsonAI)
          localStorage.removeItem("ai_generated")
          localStorage.removeItem("ai_generated_data")
        }
        setLoadCanva(true)
        design.activeScene.applyFit()
      } catch (err) {
        toast({
          title: "You need to upgrade your current subscription plan to customize this template.",
          status: "error",
          position: "top",
          duration: 2000,
          isClosable: true
        })
        localStorage.removeItem("template_id")
        design.activeScene.applyFit()
        setLoadCanva(true)
      }
    }
  }, [id, editor, user, design, zoomRatio, aiGeneratedData, aiGenerate])

  return (
    <Flex sx={{ height: "100vh", width: "100vw" }} overflow="hidden">
      <IAGenerate onClose={onCloseIAGenerate} isOpen={isOpenIAGenerate} />
      <SigninModal setType={setTypeSign} type={typeSign} onClose={onClose} isOpen={isOpen} onOpen={onOpen} />
      <Flex flex={1}>
        <DesignEditor />
      </Flex>
    </Flex>
  )
}

export default Designer
