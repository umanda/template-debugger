import { Flex, useDisclosure } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import DesignEditor from "../components/DesignEditor"
import SigninModal from "../components/Modals/AuthModal"
import { useParams } from "react-router-dom"
import { useActiveScene, useDesign, useEditor } from "@layerhub-pro/react"
import useDesignEditorContext from "../components/hooks/useDesignEditorContext"
import { useAppDispatch } from "../components/store/store"
import { useSelector } from "react-redux"
import { selectUser } from "../components/store/user/selector"
import { getProjectByKey, updateProject } from "../components/store/project/action"
import { getFonts } from "../components/store/fonts/action"
import { getListDrawifiers } from "../components/store/user/action"
import { loadFonts } from "../components/utils/fonts"
import useResourcesContext from "../components/hooks/useResourcesContext"
import { useTokenInterceptor } from "../components/hooks/useTokenInterceptor"

const Designer: any = () => {
  const { setLoadCanva } = useResourcesContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [typeSign, setTypeSign] = useState("signin")
  const { id } = useParams()
  const editor = useEditor()
  const { setNamesPages, namesPages } = useDesignEditorContext()
  const design = useDesign()
  const dispatch = useAppDispatch()
  const user = useSelector(selectUser)
  const activeScene = useActiveScene()

  useTokenInterceptor()

  useEffect(() => {
    design && lodaTemplateById()
  }, [design])

  const lodaTemplateById = useCallback(async () => {
    try {
      if (design && user) {
        setLoadCanva(false)
        const resolve: any = (await dispatch(getProjectByKey(id))).payload
        setTimeout(async () => {
          try {
            await design.setDesign(resolve)
          } catch {}
        }, 100)
        let sceneNames: string[] = []
        let fonts: { name: string; url: string }[] = []
        for (const scn of resolve?.scenes) {
          scn.layers.map(async (layer) => {
            if (layer?.type === "StaticText") {
              layer?.styles.map((f) => {
                const name = f.style.fontFamily
                const url = f.style.fontURL
                name && url ? fonts.push({ name, url }) : null
              })
              const font = { name: layer.fontFamily, url: layer.fontURL }
              fonts = fonts.concat(font)
              activeScene?.objects?.updateText({ fontFamily: layer.fontFamily, fontURL: layer.fontURL })
            }
          })
          sceneNames.push(scn.name)
        }
        fonts.map(async (f) => {
          await loadFonts([f])
        })
        setNamesPages(sceneNames)
        setLoadCanva(true)
      } else {
        setLoadCanva(true)
      }
    } catch (err: any) {
      user && functionSave()
      setLoadCanva(true)
    }
  }, [id, editor, user, design])

  const functionSave = useCallback(async () => {
    try {
      let designJSON: any = design?.toJSON()
      designJSON.key = id
      designJSON.scenes.map((e: any, index: number) => {
        e.name = namesPages[index]
        e.position = index
        e.metadata = { orientation: e.frame.width === e.frame.height ? "PORTRAIT" : "LANDSCAPE" }
        return e
      })
      user && (await dispatch(updateProject(designJSON))).payload
    } catch {}
  }, [editor, design, namesPages, id])

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
