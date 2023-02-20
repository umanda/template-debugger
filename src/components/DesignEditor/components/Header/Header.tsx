import React, { useCallback } from "react"
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Input,
  Spacer,
  Tooltip,
  useDisclosure,
  useToast
} from "@chakra-ui/react"
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@chakra-ui/react"
import { useActiveObject, useActiveScene, useDesign, useEditor, useScenes, useZoomRatio } from "@layerhub-pro/react"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import * as api from "../../../services/api"
import useIsOpenPreview from "../../../hooks/useIsOpenPreview"
import Sync from "../../../Icons/Sync"
import Home from "../../../Icons/Home"
import Undo from "../../../Icons/Undo"
import Redo from "../../../Icons/Redo"
import Play from "../../../Icons/Play"
import Right from "../../../Icons/Right"
import { selectUser } from "../../../store/user/selector"
import { useAppDispatch } from "../../../store/store"
import { logout } from "../../../store/user/action"
import Pinterest from "../../../Icons/Pinterest"
import useDesignEditorContext from "../../../hooks/useDesignEditorContext"
import Paper from "../../../Icons/Paper"
import Instagram from "../../../Icons/Instagram"
import Facebook from "../../../Icons/Facebook"
import Magic from "../../../Icons/Magic"
import { User } from "../../../interfaces/user"
import Logout from "../../../Icons/Logout"
import { updateProject } from "../../../store/project/action"
import DesignName from "./DesignName"
import Resize from "./Resize"
import SigninModal from "../../../Modals/AuthModal"
import { useNavigate, useParams } from "react-router-dom"
import { useDebounce } from "use-debounce"
import { generateId } from "../../../utils/unique"
import { IDesign } from "@layerhub-pro/types"
import { selectProject } from "../../../store/project/selector"
import DrawifyD from "../../../Icons/DrawifyD"
import UserIcon from "../../../Icons/UserIcon"
import NotSync from "../../../Icons/NotSync"
const redirectLogout = import.meta.env.VITE_LOGOUT
const redirectUserProfilePage: string = import.meta.env.VITE_REDIRECT_PROFILE

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onOpenPreview } = useIsOpenPreview()
  const scenes = useScenes()
  const user = useSelector(selectUser)
  //   const [typeSign, setTypeSign] = useState("signin")
  const activeScene: any = useActiveScene()
  const [state, setState] = useState({
    undo: 0,
    redo: 0
  })

  useEffect(() => {
    let undoPrev: any[] = activeScene?.history.undos
    let redoPrev: any[] = activeScene?.history.redos
    if (state.undo !== undoPrev?.length || state.redo !== redoPrev?.length) {
      setState({ undo: undoPrev?.length, redo: redoPrev?.length })
    }
  }, [activeScene, scenes])

  return (
    <Flex
      height="64px"
      fontSize={"14px"}
      alignItems="center"
      borderBottom="0.25px solid #ebebeb"
      justifyContent={"space-between"}
    >
      <Popover onClose={onClose} isOpen={isOpen} />
      {/* <AuthModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} type={typeSign} setType={setTypeSign} /> */}
      <Flex alignItems="center">
        <Flex sx={{ width: ["auto", "72px"], alignItems: "center", justifyContent: "center" }}>
          {/* <Link href={`/`}> */}
          <IconButton
            variant={"ghost"}
            aria-label=""
            icon={<DrawifyD size={24} />}
            onClick={() => (window.location.href = redirectUserProfilePage)}
          />
          {/* </Link> */}
        </Flex>
        <Flex padding={"0 1rem"} gap={"1rem"} alignItems={"center"}>
          <FileMenu />
          <Resize />
          <Flex>
            <Tooltip label="Undo" fontSize="md">
              <IconButton
                variant={"ghost"}
                aria-label="undo"
                onClick={() => activeScene.history.undo()}
                icon={<Undo size={24} />}
                color={state.undo === 0 ? "#DDDFE5" : "#5456F5"}
              />
            </Tooltip>
            <Tooltip label="Redo" fontSize="md">
              <IconButton
                variant={"ghost"}
                onClick={() => activeScene.history.redo()}
                aria-label="redo"
                icon={<Redo size={24} />}
                color={state.redo === 0 ? "#DDDFE5" : "#5456F5"}
              />
            </Tooltip>
          </Flex>
          <SyncUp user={user} onOpen={onOpen} />
          {/* <Tooltip label="Save" fontSize="md">
            <IconButton
              variant={"ghost"}
              aria-label="sync status"
              _hover={{ color: "#15BE53" }}
              color="#DDDFE5"
              icon={<Sync size={24} />}
              onClick={() => {
                !user && onOpen()
              }}
            />
          </Tooltip> */}
        </Flex>
      </Flex>
      <DesignName />
      <Flex gap={"1rem"} alignItems={"center"} paddingRight="1rem">
        {/* <Button className="usr-feedback" colorScheme={"orange"} onClick={() => {}}>
          Feedback
        </Button> */}

        <ShareMenu />

        <Button
          className="btn-preview"
          colorScheme={"orange"}
          onClick={() => onOpenPreview()}
          rightIcon={<Play size={24} />}
        >
          Preview
        </Button>

        {/* <Tooltip label="Present" fontSize="md">
          <IconButton variant={"ghost"} aria-label="Play" onClick={() => onOpenPreview()} icon={<Play size={24} />} />
        </Tooltip> */}
        {/* <Tooltip label="Notifications" fontSize="md">
          <IconButton variant={"ghost"} aria-label="Bell" icon={<Bell size={24} />} />
        </Tooltip> */}
        <UserMenu />
      </Flex>
    </Flex>
  )
}

function ShareMenu() {
  const activeScene = useActiveScene()
  const editor = useEditor()
  const scenes = useScenes()
  const dispatch = useAppDispatch()
  const { id } = useParams()
  const toast = useToast()
  const design = useDesign()
  const { isOpen, onToggle, onClose } = useDisclosure()
  const { isOpen: isOpenAunth, onOpen: onOpenAunth, onClose: onCloseAunth } = useDisclosure()
  const user = useSelector(selectUser)
  const [valueInput, setValueInput] = useState<string>("")
  const [typeSign, setTypeSign] = useState("signin")
  const currentScene = useActiveScene()
  const projectSelect = useSelector(selectProject)
  const { namesPages } = useDesignEditorContext()

  // const functionSave = useCallback(async () => {
  //   try {
  //     let designJSON: any = design?.toJSON()
  //     designJSON.key = id
  //     designJSON.scenes.map((e: any, index: number) => {
  //       e.name = namesPages[index]
  //       e.position = index
  //       e.metadata = { orientation: e.frame.width === e.frame.height ? "PORTRAIT" : "LANDSCAPE" }
  //       return e
  //     })
  //     user && (await dispatch(updateProject(designJSON))).payload
  //   } catch {}
  // }, [editor, scenes, currentScene, id, design, namesPages])

  const handleDownload = async (type: string) => {
    let resolve: any
    let designJSON: any = design?.toJSON()
    designJSON.key = id
    designJSON.scenes.map((e: any, index: number) => {
      e.name = namesPages[index]
      e.position = index
      e.metadata = { orientation: e.frame.width === e.frame.height ? "PORTRAIT" : "LANDSCAPE" }
      return e
    })
    await dispatch(updateProject(designJSON))
    if (editor && user) {
      resolve = await api.getExportProject({ id: projectSelect.id, scene_ids: [], type })
    }
    const url = resolve.url
    const fileTypeParts = url.split(".")
    fetch(url)
      .then((result) => result.blob())
      .then((blob) => {
        if (blob != null) {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = "project." + fileTypeParts[fileTypeParts.length - 1]
          document.body.appendChild(a)
          a.click()
        }
      })
  }

  const shareTemplate = useCallback(
    async (type: string) => {
      if (user) {
        try {
          let designJSON: any = design?.toJSON()
          designJSON.key = id
          designJSON.scenes.map((e: any, index: number) => {
            e.name = namesPages[index]
            e.position = index
            e.metadata = { orientation: e.frame.width === e.frame.height ? "PORTRAIT" : "LANDSCAPE" }
            return e
          })
          const resolve = (await dispatch(updateProject(designJSON))).payload
          const url: any = await api.getShareTemplate({
            type: type,
            image: resolve.scenes.filter((e: any) => {
              if (e.id === currentScene.id) return e
            })[0].preview
          })
          window.open(url.url, "_blank")
        } catch { }
      }
    },
    [activeScene, namesPages, id]
  )

  const makeMagicLink = useCallback(async () => {
    try {
      const resolve = await api.makeMagicLink(id)
      setValueInput(resolve.url)
    } catch {
      toast({
        title: "Please try agayn",
        status: "warning",
        position: "top",
        duration: 5000,
        isClosable: true
      })
    }
  }, [])

  useEffect(() => {
    if (valueInput !== "") {
      navigator.clipboard.writeText(valueInput)
      toast({
        title: "SUCCESSFULLY.",
        description: "The url is copied to your clipboard",
        status: "success",
        position: "top",
        duration: 5000,
        isClosable: true
      })
      setValueInput("")
    }
  }, [valueInput])

  return (
    <Popover placement="bottom-start" isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        <Button
          colorScheme={"brand"}
          onClick={() => {
            user ? onToggle() : onOpenAunth()
          }}
        >
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent padding="1rem">
        <PopoverArrow />
        <Box>
          <Box>
            <Box color="#A9A9B2">DOWNLOAD</Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", paddingY: "0.5rem" }}>
              <Button onClick={() => handleDownload("png")} variant={"outline"} leftIcon={<Paper size={24} />}>
                PNG
              </Button>
              <Button onClick={() => handleDownload("jpg")} variant={"outline"} leftIcon={<Paper size={24} />}>
                JPEG
              </Button>
              <Button onClick={() => handleDownload("pdf")} variant={"outline"} leftIcon={<Paper size={24} />}>
                PDF
              </Button>
            </Box>
          </Box>
          <Box>
            <Box color="#A9A9B2">SOCIAL MEDIA</Box>
            <Center gap="20px" paddingY="0.5rem">
              <IconButton
                onClick={() => {
                  shareTemplate("TWITTER")
                }}
                variant={"ghost"}
                aria-label="twitter"
                icon={<Instagram size={20} />}
              />
              {/* <IconButton
                  onClick={() => {
                    shareTemplate("WHATSAPP")
                  }}
                  variant={"ghost"}
                  aria-label="twitter"
                  icon={<Whatsapp size={20} />}
                /> */}
              {/* <IconButton
                  onClick={() => {
                    shareTemplate("INSTAGRAM")
                  }}
                  variant={"ghost"}
                  aria-label="twitter"
                  icon={<Twitter size={20} />}
                /> */}
              <IconButton
                onClick={() => {
                  shareTemplate("PINTEREST")
                }}
                variant={"ghost"}
                aria-label="twitter"
                icon={<Pinterest size={20} />}
              />
              <IconButton
                onClick={() => {
                  shareTemplate("FACEBOOK")
                }}
                variant={"ghost"}
                aria-label="twitter"
                icon={<Facebook size={20} />}
              />
            </Center>
          </Box>
          {/* <Box>
            <Box color="#A9A9B2">MAGIC LINK</Box>
            <Flex sx={{ paddingY: "0.5rem" }}>
              <Button w="100%" leftIcon={<Magic size={24} />} variant="outline" onClick={() => makeMagicLink()}>
                Copy Magic Link
              </Button>
              <Input value={valueInput} position="absolute" onChange={() => {}} visibility={"hidden"} id="input" />
            </Flex>
          </Box> */}
          {/* <Box>
              <Box color="#A9A9B2">INVITE</Box>
              <Box sx={{ paddingY: "0.5rem" }}>
                <Box sx={{ display: "flex", gap: "1rem" }}>
                  <Input width={"100%"} />
                  <Button variant="outline" paddingX={"1.5rem"} leftIcon={<Mail size={24} />}>
                    Invite
                  </Button>
                </Box>
              </Box>
            </Box> */}
        </Box>
      </PopoverContent>
    </Popover>
  )
}

function FileMenu() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpenProject, onClose: onCloseProject, onOpen: onOpenProject } = useDisclosure()
  const { isOpen: isOpenEdit, onClose: onCloseEdit, onOpen: onOpenEdit } = useDisclosure()
  const { isOpen: isOpenView, onClose: onCloseView, onOpen: onOpenView } = useDisclosure()
  const [state, setState] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const editor = useEditor()
  const toast = useToast()
  const activeScene = useActiveScene()
  const user = useSelector(selectUser)
  const navigate = useNavigate()
  const scenes = useScenes()
  const design = useDesign()
  const { setNamesPages } = useDesignEditorContext()
  const initialFocusRef = React.useRef()
  const inputFileRef = React.useRef<HTMLInputElement>(null)

  useEffect(() => {
    onCloseEdit()
    onCloseProject()
    onCloseView()
  }, [isOpen, state])

  const handleLogout = async () => {
    const resolve = await dispatch(logout())
    if (resolve?.payload) {
      toast({
        title: "SUCCESSFULLY CLOSED SESSION.",
        status: "success",
        position: "top",
        duration: 5000,
        isClosable: true
      })
      window.location.href = redirectLogout
    } else {
      toast({
        title: "LOGOUT UNSUCCESSFULLY.",
        description: "Please try again.",
        status: "error",
        position: "top",
        duration: 5000,
        isClosable: true
      })
    }
  }

  const makeDownload = (data: any) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data))
    const a = document.createElement("a")
    a.href = dataStr
    a.download = `${data.name}.drawify`
    a.click()
  }

  const handleExport = useCallback(() => {
    if (design) {
      const data = design.toJSON()
      makeDownload(data)
    }
  }, [design, makeDownload])

  const handleNew = useCallback(async () => {
    for (const scn of scenes) {
      await design.deleteScene(scn.id)
    }
    setNamesPages(["Untitled design"])
    navigate(`/composer/${generateId("", 10)}`)
  }, [design, scenes, navigate, editor])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (res) => {
        const result = res.target!.result as string
        const design = JSON.parse(result)
        handleImportDesign(design)
      }
      reader.onerror = (err) => { }

      reader.readAsText(file)
    }
  }

  const handleImportDesign = React.useCallback(
    async (data: IDesign) => {
      editor?.design.setDesign(data)
    },
    [editor]
  )

  const handleInputFileRefClick = () => {
    inputFileRef.current?.click()
  }

  return (
    <Popover
      isOpen={isOpen}
      initialFocusRef={initialFocusRef}
      onClose={onClose}
      onOpen={onOpen}
      placement="bottom-start"
    >
      <PopoverTrigger>
        <Button
          color={isOpen ? "#FFFFFF" : "inherit"}
          background={isOpen ? "brand.500" : "inherit"}
          _hover={{}}
          variant="outline"
        >
          File
        </Button>
      </PopoverTrigger>
      {/* @ts-ignore */}
      <PopoverContent ref={initialFocusRef} w="250px" fontSize={"14px"} padding={"0.5rem"}>
        <PopoverArrow />
        {/* <MenuOption>
          <Flex
            w="full"
            onMouseOver={() => {
              setState(!state)
            }}
          >
            Home
          </Flex>
        </MenuOption> */}
        <Popover
          isOpen={isOpenProject}
          onClose={onCloseProject}
          onOpen={onOpenProject}
          placement="right"
          initialFocusRef={initialFocusRef}
        >
          <PopoverTrigger>
            <MenuOption>
              <Flex
                w="full"
                onClick={onOpenProject}
                onMouseOver={() => {
                  onOpenProject()
                  onCloseEdit()
                  onCloseView()
                }}
              >
                Project
                <Spacer />
                <Right size={18} />
              </Flex>
            </MenuOption>
          </PopoverTrigger>
          <PopoverContent w="150px" fontSize={"14px"} padding={"0.5rem"}>
            <PopoverArrow />
            <input
              multiple={false}
              onChange={handleFileInput}
              type="file"
              id="file"
              ref={inputFileRef}
              style={{ display: "none" }}
            />
            <MenuOption onClick={handleNew}>New</MenuOption>
            <MenuOption onClick={handleExport}> Export</MenuOption>
            <MenuOption onClick={handleInputFileRefClick}> Import</MenuOption>
          </PopoverContent>
        </Popover>
        <Popover
          isOpen={isOpenEdit}
          onClose={onCloseEdit}
          initialFocusRef={initialFocusRef}
          onOpen={onOpenEdit}
          placement="right"
        >
          <PopoverTrigger>
            <MenuOption>
              <Flex
                w="full"
                onClick={onOpenEdit}
                onMouseOver={() => {
                  onOpenEdit()
                  onCloseView()
                  onCloseProject()
                }}
              >
                Edit
                <Spacer />
                <Right size={18} />
              </Flex>
            </MenuOption>
          </PopoverTrigger>
          <PopoverContent w="150px" fontSize={"14px"} padding={"0.5rem"}>
            <PopoverArrow />
            <MenuOption onClick={() => activeScene.history.undo()}>Undo</MenuOption>
            <MenuOption onClick={() => activeScene.history.redo()}>Redo</MenuOption>
            <MenuOption onClick={() => activeScene.objects.cut()}>Cut</MenuOption>
            <MenuOption onClick={() => activeScene.objects.copy()}>Copy</MenuOption>
            <MenuOption onClick={() => activeScene.objects.paste()}>Paste</MenuOption>
            <MenuOption onClick={() => activeScene.objects.remove()}>Delete</MenuOption>
          </PopoverContent>
        </Popover>
        <Popover
          isOpen={isOpenView}
          onClose={onCloseView}
          initialFocusRef={initialFocusRef}
          onOpen={onOpenView}
          placement="right"
        >
          <PopoverTrigger>
            <MenuOption>
              <Flex
                w="full"
                onClick={onOpenView}
                onMouseOver={() => {
                  onOpenView()
                  onCloseEdit()
                  onCloseProject()
                }}
              >
                View
                <Spacer />
                <Right size={18} />
              </Flex>
            </MenuOption>
          </PopoverTrigger>
          <PopoverContent w="150px" fontSize={"14px"} padding={"0.5rem"}>
            <PopoverArrow />
            <MenuOption onClick={() => editor.zoom.zoomIn()}>Zoom in</MenuOption>
            <MenuOption onClick={() => editor.zoom.zoomOut()}> Zoom out</MenuOption>
            <MenuOption onClick={() => editor.zoom.zoomToRatio(1)}> Zoom to 100%</MenuOption>
          </PopoverContent>
        </Popover>
        {/* <Button
          _hover={{ color: "#5456f5", bg: "var(--chakra-colors-gray-200)" }}
          borderRadius="none"
          onMouseOver={() => {
            onCloseProject()
            onCloseEdit()
            onCloseView()
          }}
          variant="ghost"
          justifyContent="left"
        >
          Help
        </Button> */}
        {user && (
          <MenuOption>
            <Flex
              w="full"
              onMouseOver={() => {
                setState(!state)
              }}
              onClick={handleLogout}
            >
              Logout
            </Flex>
          </MenuOption>
        )}
      </PopoverContent>
    </Popover>
  )
}
const MenuOption = React.forwardRef(
  ({ onClick, children }: { onClick?: () => void; children: React.ReactNode }, ref: any) => {
    return (
      <Box
        ref={ref}
        onClick={onClick}
        sx={{
          height: "30px",
          paddingLeft: "0.5rem",
          alignItems: "center",
          display: "flex",
          ":hover": {
            backgroundColor: "brand.50",
            cursor: "pointer",
            color: "brand.500"
          }
        }}
      >
        {children}
      </Box>
    )
  }
)

function UserMenu() {
  const dispatch = useAppDispatch()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const user = useSelector(selectUser) as User
  const toast = useToast()
  const [typeSign, setTypeSign] = useState("signin")

  const handleProfile = () => {
    window.location.href = redirectUserProfilePage
  }

  const handleLogout = async () => {
    const resolve = await dispatch(logout())
    if (resolve?.payload) {
      toast({
        title: "SUCCESSFULLY CLOSED SESSION.",
        status: "success",
        position: "top",
        duration: 5000,
        isClosable: true
      })
      window.location.href = redirectLogout
    } else {
      toast({
        title: "LOGOUT UNSUCCESSFULLY.",
        description: "Please try again.",
        status: "error",
        position: "top",
        duration: 5000,
        isClosable: true
      })
    }
  }

  return (
    <Flex>
      <SigninModal setType={setTypeSign} type={typeSign} onClose={onClose} isOpen={isOpen} onOpen={onOpen} />
      {user ? (
        <Popover placement="bottom-start">
          <PopoverTrigger>
            <Avatar src={user?.avatar} cursor={"pointer"} name={user?.first_name + user?.first_name} />
          </PopoverTrigger>
          <PopoverContent width={"200px"} padding={"0.5rem 0"}>
            <Box>

              <MenuOption
                onClick={() => {
                  handleProfile()
                }}
              >
                <Flex gap="0.25rem" alignItems={"center"}>
                  <UserIcon size={24} />
                  Profile
                </Flex>
              </MenuOption>

              <MenuOption
                onClick={() => {
                  handleLogout()
                }}
              >
                <Flex gap="0.25rem" alignItems={"center"}>
                  <Logout size={24} />
                  Logout
                </Flex>
              </MenuOption>
            </Box>
          </PopoverContent>
        </Popover>
      ) : (
        <Button
          size={"sm"}
          variant="outline"
          onClick={() => {
            setTypeSign("signin")
            onOpen()
          }}
        >
          Sign In
        </Button>
      )}
    </Flex>
  )
}

function SyncUp({ user, onOpen }: { user: any; onOpen: () => void }) {
  const design = useDesign()
  const { id } = useParams()
  const { namesPages } = useDesignEditorContext()
  const dispatch = useAppDispatch()
  const editor = useEditor()
  const activeScene = useActiveScene()
  const currentScene = useActiveScene()
  const scenes = useScenes()
  const [autoSave, setAutoSave] = useState<boolean>(true)
  const [stateJson, setStateJson] = useState<any>("")
  const [stateChange] = useDebounce(stateJson, 5000)
  const zoom = useZoomRatio()
  const activeObject: any = useActiveObject()

  document.onkeydown = function (e) {
    if (e.keyCode === 46) {
      activeObject?.type !== "Frame" && activeScene.objects.remove(activeObject.id)
      return false
    }
    if (e.keyCode === 37) {
      activeObject?.type !== "Frame" && activeScene.objects.update({ left: activeObject.left - 30 }, activeObject.id)
      return false
    }
    if (e.keyCode === 38) {
      activeObject?.type !== "Frame" && activeScene.objects.update({ top: activeObject.top - 30 }, activeObject.id)
      return false
    }
    if (e.keyCode === 39) {
      activeObject?.type !== "Frame" && activeScene.objects.update({ left: activeObject.left + 30 }, activeObject.id)
      return false
    }
    if (e.keyCode === 40) {
      activeObject?.type !== "Frame" && activeScene.objects.update({ top: activeObject.top + 30 }, activeObject.id)
      return false
    }
    if (
      e.ctrlKey &&
      (e.keyCode === 85 ||
        e.keyCode === 117 ||
        e.keyCode === 107 ||
        e.keyCode === 109 ||
        e.keyCode === 69 ||
        e.keyCode === 68 ||
        e.keyCode === 83 ||
        e.keyCode === 65 ||
        e.keyCode === 90 ||
        e.keyCode === 46 ||
        e.keyCode === 89 ||
        e.keyCode === 64)
    ) {
      if (e.ctrlKey && e.keyCode === 107) editor.zoom.zoomToRatio(zoom + 0.05)
      if (e.ctrlKey && e.keyCode === 109) editor.zoom.zoomToRatio(zoom - 0.05)
      if (e.ctrlKey && e.keyCode === 68) activeScene.objects.clone()
      if (e.ctrlKey && e.keyCode === 83) functionSave()
      if (e.ctrlKey && e.keyCode === 65) activeScene.objects.select()
      if (e.ctrlKey && e.keyCode === 69) {
        activeScene.layers.map((e, index) => {
          if (index > 1) activeScene.objects.remove(e.id)
        })
        editor.zoom.zoomToRatio(zoom - 0.0000000000001 + 0.0000000000001)
      }
      if (e.ctrlKey && e.keyCode === 90) activeScene.history.undo()
      if (e.ctrlKey && e.keyCode === 89) activeScene.history.redo()
      if (e.keyCode === 46) activeScene.objects.removeById(activeObject?.id)
      return false
    } else return true
  }

  useEffect(() => {
    try {
      if (activeScene && stateJson !== "") functionSave()
    } catch { }
  }, [stateChange, namesPages])

  useEffect(() => {
    stateJson !== "" && setAutoSave(false)
  }, [scenes, namesPages])

  React.useEffect(() => {
    let watcher = async () => {
      setStateJson(JSON.stringify(editor.design.toJSON()))
    }
    if (editor) {
      editor.on("history:updated", watcher)
    }
    return () => {
      if (editor) {
        editor.off("history:updated", watcher)
      }
    }
  }, [editor, namesPages])

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
      setAutoSave(true)
    } catch { }
  }, [editor, scenes, currentScene, id, design, autoSave, namesPages])

  return (
    <Flex>
      <Tooltip label="CLick here to Save" fontSize="md">
        <Button
          variant={"ghost"}
          aria-label="sync status"
          color={autoSave === false ? "#F56565" : "#15BE53"}
          leftIcon={autoSave === false ? <NotSync size={18} /> :<Sync size={24} /> }
          onClick={() => (!user ? onOpen() : functionSave())}
        >
          {autoSave === false ? "Changes not saved" : "Changes saved"}
        </Button>
      </Tooltip>
    </Flex>
  )
}
