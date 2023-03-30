import React, { useCallback, useRef } from "react"
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Input,
  PopoverBody,
  Select,
  Spacer,
  Textarea,
  Tooltip,
  useDisclosure,
  useToast
} from "@chakra-ui/react"
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@chakra-ui/react"
import { useActiveObject, useActiveScene, useDesign, useEditor, useScenes, useZoomRatio } from "@layerhub-pro/react"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import * as api from "../../../../services/api"
import useIsOpenPreview from "~/hooks/useIsOpenPreview"
import Sync from "../../../Icons/Sync"
import Undo from "../../../Icons/Undo"
import Redo from "../../../Icons/Redo"
import Play from "../../../Icons/Play"
import Right from "../../../Icons/Right"
import { selectUser } from "~/store/user/selector"
import { useAppDispatch } from "~/store/store"
import { logout } from "~/store/user/action"
import Pinterest from "../../../Icons/Pinterest"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import Paper from "../../../Icons/Paper"
import Instagram from "../../../Icons/Instagram"
import Facebook from "../../../Icons/Facebook"
import { User } from "../../../../interfaces/user"
import Logout from "../../../Icons/Logout"
import { updateProject } from "~/store/project/action"
import DesignName from "./DesignName"
import Resize from "./Resize"
import SigninModal from "../../../Modals/AuthModal"
import { useNavigate, useParams } from "react-router-dom"
import { useDebounce } from "use-debounce"
import { generateId } from "../../../../utils/unique"
import { selectProject } from "~/store/project/selector"
import DrawifyD from "../../../Icons/DrawifyD"
import UserIcon from "../../../Icons/UserIcon"
import NotSync from "../../../Icons/NotSync"
import Linkedin from "../../../Icons/Linkedin"
import Share from "../../../Icons/Share"
import ModalUpgradePlan from "../../../Modals/UpgradePlan"
import useResourcesContext from "~/hooks/useResourcesContext"
import NoInternet from "../../../Modals/NoInternet"
import Save from "~/components/Icons/Save"
const redirectLogout = import.meta.env.VITE_LOGOUT
const redirectUserProfilePage: string = import.meta.env.VITE_REDIRECT_PROFILE
const redirectUserTemplateManager: string = import.meta.env.VITE_APP_DOMAIN+"/template-manager?status=unpublished";
const redirectDefaultPage: string = import.meta.env.VITE_REDIRECT_HOME

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onOpenPreview } = useIsOpenPreview()
  const scenes: any = useScenes()
  const user = useSelector(selectUser)
  //   const [typeSign, setTypeSign] = useState("signin")
  const activeScene: any = useActiveScene()
  const [state, setState] = useState({
    undo: 0,
    redo: 0
  })
  const [textButtonSave, setTextButtonSave] = useState<string>(null)
  const templateId = localStorage.getItem("template_id")
  const [stateSave, setStateSave] = useState<{ state: boolean; make: boolean }>({ state: false, make: false })
  const editor = useEditor()
  const { isOpen: isOpenSave, onToggle: onToggleSave, onClose: onCloseSave } = useDisclosure()
  const design = useDesign()
  const { setInputActive } = useDesignEditorContext()
  const ref = useRef<any>()
  const projectSelect = useSelector(selectProject)
  const [stateName, setStateName] = useState<string>(design?.design?.name)
  const [metaData, setMetaData] = useState<{ tags: string[]; description: string; plan: string; visibility: string }>({
    tags: projectSelect?.tags ? projectSelect.tags : [],
    description: projectSelect?.description ? projectSelect.description : null,
    plan: projectSelect?.plan ? projectSelect.plan : "FREE",
    visibility: projectSelect?.frame?.visibility ? projectSelect.frame : "private"
  })

  console.log(projectSelect, metaData.visibility)

  React.useEffect(() => {
    validateButtonSave()
  }, [])

  React.useEffect(() => {
    setMetaData({
      ...metaData,
      tags: projectSelect?.tags ? projectSelect.tags : [],
      description: projectSelect?.description ? projectSelect.description : null,
      plan: projectSelect?.plan ? projectSelect.plan : "FREE"
    })
  }, [projectSelect])

  React.useEffect(() => {
    design && setStateName(design?.design?.name)
  }, [design?.design?.name])

  const validateButtonSave = useCallback(() => {
    templateId !== null ? setTextButtonSave("Update Template") : setTextButtonSave("Save Template")
  }, [])

  const changeInput = useCallback(
    (value: string) => {
      setStateName(value)
      design?.updateDesign({
        name: value
      })
    },
    [stateName, design]
  )

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
          <IconButton
            variant={"ghost"}
            aria-label=""
            icon={<DrawifyD size={24} />}
            onClick={() => (
              user.type === "admin" ? 
              (window.location.href = redirectUserTemplateManager) :
              (window.location.href = redirectUserProfilePage)
              )}
          />
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
          <SyncUp stateSave={stateSave} metaData={metaData} user={user} onOpen={onOpen} />
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
        {user.type === "admin" && (
          <Popover placement="bottom-start" isOpen={isOpenSave} onClose={onCloseSave}>
            <PopoverTrigger>
              <Button
                colorScheme={"brand"}
                rightIcon={<Save size={16} />}
                onClick={() => {
                  user ? onToggleSave() : null
                }}
              >
                {textButtonSave}
              </Button>
            </PopoverTrigger>
            <PopoverContent padding="1rem">
              <PopoverArrow />
              <PopoverBody>
                <Flex gap="10px" flexDir="column">
                  <Flex flexDir="column">
                    Name:
                    <Input
                      ref={ref}
                      value={stateName !== undefined ? stateName : "Untitled Project"}
                      onFocus={() => setInputActive(true)}
                      onChange={(e) => {
                        changeInput(e.target.value)
                      }}
                      onBlur={() => setInputActive(false)}
                    />
                  </Flex>
                  <Flex flexDir="column">
                    Tags:
                    <Input
                      placeholder="Input your tags"
                      onChange={(e) => setMetaData({ ...metaData, tags: e.target.value.split(",") })}
                      value={metaData?.tags !== null && metaData?.tags !== undefined ? metaData?.tags?.join(",") : ""}
                    />
                  </Flex>
                  <Flex flexDir="column">
                    Description:
                    <Textarea
                      onFocus={() => setInputActive(true)}
                      onChange={(e) => setMetaData({ ...metaData, description: e.target.value })}
                      placeholder="Input your description"
                      value={metaData.description !== null ? metaData.description : ""}
                      onBlur={() => setInputActive(false)}
                    />
                  </Flex>
                  <Flex flexDir="column">
                    Layout:
                    <Input value={"Screen"} isDisabled={true} />
                  </Flex>
                  <Flex flexDir="column">
                    Category:
                    <Input value={1} isDisabled={true} />
                  </Flex>
                  <Flex flexDir="column">
                    Plans:
                    <Select
                      size="sm"
                      onChange={(e) => setMetaData({ ...metaData, plan: e.target.value })}
                      fontSize="12px"
                      value={metaData.plan !== undefined ? metaData.plan : "FREE"}
                      placeholder="Select option"
                    >
                      <option value="HERO">HERO</option>
                      <option value="EXPLORER">EXPLORER</option>
                      <option value="FREE">FREE</option>
                    </Select>
                  </Flex>
                  <Flex flexDir="column">
                    Plans:
                    <Select
                      size="sm"
                      onChange={(e) => setMetaData({ ...metaData, visibility: e.target.value })}
                      fontSize="12px"
                      value={metaData.visibility !== undefined ? metaData.visibility : "private".toUpperCase()}
                      placeholder="Select option"
                    >
                      <option value="private">PRIVATE</option>
                      <option value="public">PUBLIC</option>
                    </Select>
                  </Flex>
                  <Button
                    colorScheme={"brand"}
                    rightIcon={<Save size={16} />}
                    onClick={() => {
                      onCloseSave()
                      setStateSave({ ...stateSave, make: !stateSave.make, state: true })
                    }}
                  >
                    Save
                  </Button>
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        )}
        <ShareMenu />
        <Button
          className="btn-preview"
          colorScheme={"orange"}
          onClick={() => {
            editor.design.activeScene.objects.deselect()
            onOpenPreview()
          }}
          rightIcon={<Play size={24} />}
        >
          Preview
        </Button>
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
  const { isOpen: isOpenUpgradeUser, onOpen: onOpenUpgradeUser, onClose: onCloseUpgradeUser } = useDisclosure()
  const user: any = useSelector(selectUser)
  const [valueInput, setValueInput] = useState<string>("")
  // const [typeSign, setTypeSign] = useState("signin")
  const currentScene = useActiveScene()
  const projectSelect = useSelector(selectProject)
  const { setInputActive } = useDesignEditorContext()
  const [email, setEmail] = useState<{ text: string; state: boolean }>({ text: "", state: true })
  const [typeModal, setTypeModal] = useState<string>("")

  const handleDownload = async (type: string) => {
    try {
      if (user?.plan !== "FREE" || type === "jpg") {
        toast({
          title: "Your project is preparing to download",
          status: "loading",
          position: "top",
          duration: 2000,
          isClosable: true
        })
        let resolve: any
        let designJSON: any = design?.toJSON()
        designJSON.key = id
        designJSON.scenes.map((e: any, index: number) => {
          e.position = index
          e.metadata = { orientation: e.frame.width >= e.frame.height ? "PORTRAIT" : "LANDSCAPE" }
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
      } else {
        setTypeModal(type.toLocaleUpperCase())
        onOpenUpgradeUser()
      }
    } catch {
      toast({
        title: "Oops, there was an error, try again.",
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true
      })
    }
  }

  const shareTemplate = useCallback(
    async (type: string) => {
      if (user) {
        try {
          toast({
            title: "Please wait while the image loads",
            status: "loading",
            position: "top",
            duration: 2000,
            isClosable: true
          })
          let designJSON: any = design?.toJSON()
          designJSON.key = id
          designJSON.scenes.map((e: any, index: number) => {
            e.position = index
            e.metadata = { orientation: e.frame.width >= e.frame.height ? "PORTRAIT" : "LANDSCAPE" }
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
        } catch {
          toast({
            title: "Oops, there was an error, try again.",
            status: "error",
            position: "top",
            duration: 2000,
            isClosable: true
          })
        }
      }
    },
    [activeScene, id]
  )

  const makeChangeEmail = useCallback(
    async (e: string) => {
      const validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
      if (validEmail.test(e)) {
        setEmail({ ...email, text: e, state: false })
      } else {
        setEmail({ ...email, text: e, state: true })
      }
    },
    [email]
  )

  const sendEmail = useCallback(async () => {
    try {
      toast({
        title: "Please wait the mail is being sent.",
        status: "loading",
        position: "top",
        duration: 3000,
        isClosable: true
      })
      await api.getShareTemplate({
        type: "EMAIL",
        image: projectSelect.scenes.find((e) => e.id === currentScene.id).preview,
        email: email.text
      })
      toast({
        title: "Email sent successfully.",
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true
      })
      setEmail({ text: "", state: false })
    } catch {
      toast({
        title: "Email sending failed, please check email address and try again.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true
      })
    }
  }, [email])

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
          rightIcon={<Share size={16} />}
          onClick={() => {
            user ? onToggle() : null
          }}
        >
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent padding="1rem">
        <PopoverArrow />
        <ModalUpgradePlan
          type={typeModal}
          isOpen={isOpenUpgradeUser}
          onClose={onCloseUpgradeUser}
          onOpen={onOpenUpgradeUser}
        />
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
              <IconButton
                onClick={() => {
                  shareTemplate("LINKEDIN")
                }}
                variant={"ghost"}
                aria-label="twitter"
                icon={<Linkedin size={20} />}
              />
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
          <Box>
            <Box color="#A9A9B2">SHARE VIA EMAIL</Box>
            <Flex>
              <Input
                onFocus={() => setInputActive(true)}
                value={email.text}
                onBlur={() => setInputActive(false)}
                onChange={(e) => makeChangeEmail(e.target.value)}
              />
              <Button onClick={sendEmail} isDisabled={email.state} variant="outline">
                Send
              </Button>
            </Flex>
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
  const { setLoadCanva } = useResourcesContext()
  const { isOpen: isOpenProject, onClose: onCloseProject, onOpen: onOpenProject } = useDisclosure()
  const { isOpen: isOpenEdit, onClose: onCloseEdit, onOpen: onOpenEdit } = useDisclosure()
  const { isOpen: isOpenView, onClose: onCloseView, onOpen: onOpenView } = useDisclosure()
  const { isOpen: isOpenUpgradeUser, onOpen: onOpenUpgradeUser, onClose: onCloseUpgradeUser } = useDisclosure()
  const [state, setState] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const editor = useEditor()
  const toast = useToast()
  const activeScene = useActiveScene()
  const user = useSelector(selectUser)
  const navigate = useNavigate()
  const scenes = useScenes()
  const design = useDesign()
  const { setInputActive } = useDesignEditorContext()
  const initialFocusRef = React.useRef()
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  const [typeModal, setTypeModal] = useState<string>("")
  const projectSelect = useSelector(selectProject)
  const { id } = useParams()

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
    const dataStr = "data:text/json;charset=utf-8," + data
    const a = document.createElement("a")
    a.href = dataStr
    a.download = `${projectSelect.name}.drawify`
    a.click()
  }

  const handleExport = useCallback(async () => {
    if (user?.plan !== "FREE") {
      try {
        toast({
          title: "Exporting project.",
          status: "info",
          position: "top",
          duration: 3000,
          isClosable: true
        })
        if (design) {
          const data = await api.getExportProjectJSON(projectSelect.id)
          makeDownload(data.body)
        }
      } catch {
        toast({
          title: "There was an error exporting the project, please try again later.",
          status: "error",
          position: "top",
          duration: 3000,
          isClosable: true
        })
      }
    } else {
      setTypeModal("Export")
      onOpenUpgradeUser()
    }
  }, [design, makeDownload])

  const handleNew = useCallback(async () => {
    for (const scn of scenes) {
      await design.deleteScene(scn.id)
    }
    navigate(`/composer/${generateId("", 10)}`)
  }, [design, scenes, navigate, editor])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoadCanva(false)
    const file = e.target.files![0]
    if (file?.name?.includes(".drawify")) {
      if (file) {
        const reader = new FileReader()
        reader.onload = (res) => {
          const result = res.target!.result as string
          handleImportDesign(result)
        }
        reader.onerror = (err) => {}

        reader.readAsText(file)
      }
    } else {
      toast({
        title: "Only Drawify formats are allowed",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true
      })
    }
  }

  const handleImportDesign = React.useCallback(
    async (data: string) => {
      try {
        toast({
          title: "Loading project.",
          status: "info",
          position: "top",
          duration: 3000,
          isClosable: true
        })
        const props = { key: id, data: data }
        const resolve: any = await api.makeImportProject(props)
        await editor?.design.setDesign(resolve.project)
        setLoadCanva(true)
      } catch {
        setLoadCanva(true)
        toast({
          title: "Error loading project, please try again later.",
          status: "error",
          position: "top",
          duration: 3000,
          isClosable: true
        })
      }
    },
    [editor]
  )

  const handleInputFileRefClick = () => {
    if (user?.plan !== "FREE") {
      inputFileRef.current?.click()
    } else {
      setTypeModal("Import")
      onOpenUpgradeUser()
    }
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
        <ModalUpgradePlan
          type={typeModal}
          isOpen={isOpenUpgradeUser}
          onClose={onCloseUpgradeUser}
          onOpen={onOpenUpgradeUser}
        />
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
              onBlur={() => setInputActive(false)}
              onFocus={() => setInputActive(true)}
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

function SyncUp({
  user,
  metaData,
  onOpen,
  stateSave
}: {
  metaData: any
  user: any
  onOpen: () => void
  stateSave: any
}) {
  const design = useDesign()
  const { id } = useParams()
  const { inputActive, activeScene: booleanScene } = useDesignEditorContext()
  const dispatch = useAppDispatch()
  const editor = useEditor()
  const activeScene = useActiveScene()
  const scenes: any = useScenes()
  const [autoSave, setAutoSave] = useState<boolean>(false)
  const [stateJson, setStateJson] = useState<any>("")
  const [stateChange] = useDebounce(stateJson, 2000)
  const zoom = useZoomRatio()
  const activeObject: any = useActiveObject()
  const { isOpen: isOpenNoInternet, onOpen: onOpenNoInternet, onClose: onCloseNoInternet } = useDisclosure()
  const { isOpenPreview, switchPage, setSwitchPage } = useIsOpenPreview()
  const projectSelect = useSelector(selectProject)

  useEffect(() => {
    stateSave.state === true && functionSave()
  }, [stateSave.make])

  window.addEventListener("offline", onOpenNoInternet)
  window.addEventListener("online", onCloseNoInternet)

  document.onkeydown = function (e) {
    if ((e.key === "Delete" || e.key === "Backspace") && inputActive === false) {
      if (activeObject !== null && (activeObject?.locked === false || activeObject?.locked === undefined)) {
        activeObject?.type === "StaticText"
          ? activeObject?.isEditing !== true && activeScene.objects.remove()
          : activeScene.objects.remove()
      } else if (booleanScene) {
        scenes.length !== 1 && design.deleteScene(activeScene.id)
      }
      return true
    }
    if (e.key === "ArrowLeft" && inputActive === false) {
      if (isOpenPreview === true) {
        setSwitchPage({ ...switchPage, left: !switchPage.left })
      } else if (activeObject?.locked === false || activeObject?.locked === undefined) {
        activeObject?.type !== "Frame" &&
          activeScene.objects.update({ left: activeObject?.left - 30 }, activeObject?.id)
      }
      return false
    }
    if (e.key === "ArrowUp" && inputActive === false) {
      if (activeObject?.locked === false || activeObject?.locked === undefined) {
        activeObject?.type !== "Frame" && activeScene.objects.update({ top: activeObject?.top - 30 }, activeObject?.id)
      }
      return false
    }
    if (e.key === "ArrowRight" && inputActive === false) {
      if (isOpenPreview === true) {
        setSwitchPage({ ...switchPage, right: !switchPage.right })
      } else if (activeObject?.locked === false || activeObject?.locked === undefined) {
        activeObject?.type !== "Frame" &&
          activeScene.objects.update({ left: activeObject?.left + 30 }, activeObject?.id)
      }
      return false
    }
    if (e.key === "ArrowDown" && inputActive === false) {
      if (activeObject?.locked === false || activeObject?.locked === undefined) {
        activeObject?.type !== "Frame" && activeScene.objects.update({ top: activeObject?.top + 30 }, activeObject?.id)
      }
      return false
    }
    if (e.ctrlKey && e.key === "c") {
      if (activeObject) activeScene.objects.copy()
      return true
    }
    if (e.ctrlKey && e.key === "v") {
      if (activeObject && activeObject?.isEditing !== true) activeScene.objects.paste()
      return true
    }
    if (
      e.ctrlKey &&
      (e.key === "u" ||
        e.key === "k" ||
        e.key === "m" ||
        e.key === "e" ||
        e.key === "d" ||
        e.key === "s" ||
        e.key === "a" ||
        e.key === "z" ||
        e.key === "y")
    ) {
      if (e.ctrlKey && e.key === "k") editor.zoom.zoomToRatio(zoom + 0.05)
      if (e.ctrlKey && e.key === "m") editor.zoom.zoomToRatio(zoom - 0.05)
      if (e.ctrlKey && e.key === "d") activeScene.objects.clone()
      if (e.ctrlKey && e.key === "s") functionSave()
      if (e.ctrlKey && e.key === "a") activeScene.objects.select()
      if (e.ctrlKey && e.key === "e") activeScene.objects.remove("all")
      if (e.ctrlKey && e.key === "z" && activeObject?.isEditing !== true) activeScene.history.undo()
      if (e.ctrlKey && e.key === "y" && activeObject?.isEditing !== true) activeScene.history.redo()
      return false
    } else return true
  }

  // && save === true   else setSave(true)

  useEffect(() => {
    try {
      if (activeScene && stateJson !== "") functionSave()
    } catch {}
  }, [stateChange])

  useEffect(() => {
    stateJson !== "" && setAutoSave(false)
  }, [scenes])

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
  }, [editor])

  const functionSave = useCallback(async () => {
    try {
      if (user.type !== "admin") {
        let designJSON: any = design?.toJSON()
        designJSON.key = id
        designJSON.scenes.map((e: any, index: number) => {
          e.name = scenes[index]?.scene?.name
          e.position = index
          e.metadata = { orientation: e.frame.width >= e.frame.height ? "PORTRAIT" : "LANDSCAPE" }
          return e
        })
        if (designJSON.name === "") {
          const resolve = await api.getListProjects({ query: {} })
          designJSON.name = `Untitled Project ${resolve.pagination.total_items}`
        }
        if (user) {
          const resolve = await dispatch(updateProject(designJSON))
          resolve.payload === undefined ? setAutoSave(false) : setAutoSave(true)
        }
      } else {
        let designJSON: any = design?.toJSON()
        designJSON.key = projectSelect ? projectSelect.key : id
        designJSON.scenes.map((e: any, index: number) => {
          e.name = scenes[index]?.scene?.name
          e.position = 0
          designJSON.metadata = { orientation: e.frame.width >= e.frame.height ? "PORTRAIT" : "LANDSCAPE" }
          e.metadata = { orientation: e.frame.width >= e.frame.height ? "PORTRAIT" : "LANDSCAPE" }
          return e
        })
        designJSON.tags = projectSelect ? projectSelect.tags : metaData.tags
        designJSON.colors = projectSelect ? projectSelect.colors : []
        designJSON.layout_id = projectSelect ? projectSelect.layout.id : 1
        designJSON.description = projectSelect ? projectSelect.description : metaData.description
        designJSON.plan = projectSelect ? projectSelect.plan : metaData.plan
        designJSON.frame = {
          name: designJSON.frame.name,
          visibility: projectSelect ? projectSelect?.frame?.visibility : metaData.visibility.toLocaleLowerCase(),
          width: designJSON.scenes[0].frame.width,
          height: designJSON.scenes[0].frame.height
        }
        designJSON.name === "" && (designJSON.name = `Untitled Template`)
        if (user) {
          const resolve = await api.putTemplate(designJSON)
          if (resolve?.template) {
            setAutoSave(false)
          } else {
            setAutoSave(true)
          }
        }
      }
    } catch (err: any) {}
  }, [editor, scenes, id, design, autoSave, metaData])

  return (
    <Flex>
      <NoInternet isOpen={isOpenNoInternet} onClose={onCloseNoInternet} onOpen={onOpenNoInternet} />
      <Tooltip label="Click here to Save" fontSize="md">
        <Button
          variant={"ghost"}
          aria-label="sync status"
          color={autoSave === false ? "#F56565" : "#15BE53"}
          leftIcon={autoSave === false ? <NotSync size={18} /> : <Sync size={24} />}
          onClick={() => (!user ? onOpen() : functionSave())}
        >
          {autoSave === false ? "Changes not saved" : "Changes saved"}
        </Button>
      </Tooltip>
    </Flex>
  )
}
