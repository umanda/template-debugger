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
import { useActiveScene, useDesign, useEditor, useScenes } from "@layerhub-pro/react"
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
import { useParams } from "react-router-dom"
import { useDebounce } from "use-debounce"
import { json } from "node:stream/consumers"

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
          <IconButton variant={"ghost"} aria-label="undo" icon={<Home size={24} />} />
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
                color={state.undo === 0 ? "#DDDFE5" : "black"}
              />
            </Tooltip>
            <Tooltip label="Redo" fontSize="md">
              <IconButton
                variant={"ghost"}
                onClick={() => activeScene.history.redo()}
                aria-label="redo"
                icon={<Redo size={24} />}
                color={state.redo === 0 ? "#DDDFE5" : "black"}
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
        <Button className="usr-feedback" colorScheme={"orange"} onClick={() => {}}>
          Feedback
        </Button>

        <ShareMenu />
        <Tooltip label="Present" fontSize="md">
          <IconButton variant={"ghost"} aria-label="Play" onClick={() => onOpenPreview()} icon={<Play size={24} />} />
        </Tooltip>
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

  const handleDownload = async (type: string) => {
    let resolve: any
    if (editor && user) {
      resolve = await api.getExportProject({ id, scene_ids: [], type })
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
          let designJSON: any = design.toJSON()
          designJSON.id = id
          designJSON.scenes.map((e: any, index: number) => {
            e.position = index
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
        } catch {}
      }
    },
    [activeScene]
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
  const {
    isOpen: isOpenProject,
    onToggle: onToggleProject,
    onClose: onCloseProject,
    onOpen: onOpenProject
  } = useDisclosure()
  const { isOpen: isOpenEdit, onToggle: onToggleEdit, onClose: onCloseEdit, onOpen: onOpenEdit } = useDisclosure()
  const { isOpen: isOpenView, onToggle: onToggleView, onClose: onCloseView, onOpen: onOpenView } = useDisclosure()
  const dispatch = useAppDispatch()
  const editor = useEditor()
  const toast = useToast()
  const activeScene = useActiveScene()
  const user = useSelector(selectUser)

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
      window.location.href = "https://beta.drawify.com/home"
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
    <Popover isOpen={isOpen} onClose={onClose} onOpen={onOpen} placement="bottom-start">
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
      <PopoverContent w="250px" fontSize={"14px"} paddingY={"0.25rem"}>
        <PopoverArrow />
        <Button
          _hover={{ color: "#5456f5", bg: "var(--chakra-colors-gray-200)" }}
          borderRadius="none"
          // onClick={() => router.push("/")}
          onMouseOver={() => {
            onCloseProject()
            onCloseEdit()
            onCloseView()
          }}
          variant="ghost"
          justifyContent="left"
        >
          Home
        </Button>
        <Popover isOpen={isOpenProject} onClose={onCloseProject} placement="right">
          <PopoverContent w="96px">
            <PopoverArrow />
          </PopoverContent>
        </Popover>
        <Popover isOpen={isOpenEdit} onClose={onCloseEdit} placement="right">
          <PopoverTrigger>
            <Button
              _hover={{ color: "#5456f5", bg: "var(--chakra-colors-gray-200)" }}
              borderRadius="none"
              variant="ghost"
              onClick={onToggleEdit}
              onMouseOver={() => {
                onOpenEdit()
                onCloseProject()
                onCloseView()
              }}
            >
              Edit
              <Spacer />
              <Right size={18} />
            </Button>
          </PopoverTrigger>
          <PopoverContent w="100px">
            <PopoverArrow />
            <MenuOption onClick={() => activeScene.history.undo()}>Undo</MenuOption>
            <MenuOption onClick={() => activeScene.history.redo()}>Redo</MenuOption>
            <MenuOption onClick={() => activeScene.objects.cut()}>Cut</MenuOption>
            <MenuOption onClick={() => activeScene.objects.copy()}>Copy</MenuOption>
            <MenuOption onClick={() => activeScene.objects.paste()}>Paste</MenuOption>
            <MenuOption onClick={() => activeScene.objects.remove()}>Delete</MenuOption>
          </PopoverContent>
        </Popover>
        <Popover isOpen={isOpenView} onClose={onCloseView} placement="right">
          <PopoverTrigger>
            <Button
              _hover={{ color: "#5456f5", bg: "var(--chakra-colors-gray-200)" }}
              borderRadius="none"
              onClick={onToggleView}
              variant="ghost"
              onMouseOver={() => {
                onOpenView()
                onCloseEdit()
                onCloseProject()
              }}
            >
              View
              <Spacer />
              <Right size={18} />
            </Button>
          </PopoverTrigger>
          <PopoverContent w="100px">
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
        {user && <MenuOption onClick={handleLogout}>Logout</MenuOption>}
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
      window.location.href = "https://beta.drawify.com/home/"
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
  const scenes = useScenes()
  const currentScene = useActiveScene()
  const [autoSave, setAutoSave] = useState<boolean>(true)
  const [stateJson, setStateJson] = useState<any>("")
  const [stateChange] = useDebounce(stateJson, 5000)

  useEffect(() => {
    try {
      functionSave()
      setAutoSave(true)
    } catch {}
  }, [stateChange, namesPages])

  useEffect(() => {
    setAutoSave(false)
  }, [currentScene, design, namesPages, editor, scenes])

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
      designJSON.id = id
      designJSON.scenes.map((e: any, index: number) => {
        e.name = namesPages[index]
        e.position = index
        return e
      })
      user && (await dispatch(updateProject(designJSON)))
    } catch {}
  }, [editor, scenes, currentScene, id, design, autoSave, namesPages])

  return (
    <Flex>
      <Tooltip label="Save" fontSize="md">
        <IconButton
          variant={"ghost"}
          aria-label="sync status"
          _hover={{ color: "#15BE53" }}
          color={autoSave === false ? "#DDDFE5" : "#15BE53"}
          icon={<Sync size={24} />}
          onClick={() => (!user ? onOpen() : functionSave())}
        />
      </Tooltip>
    </Flex>
  )
}
