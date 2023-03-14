import React, { useCallback, useEffect, useRef, useState } from "react"
import { useActiveObject, useActiveScene, useEditor } from "@layerhub-pro/react"
import * as api from "~/services/api"
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Spinner,
  Tab,
  TabList,
  Tabs,
  Text,
  useDisclosure,
  useToast
} from "@chakra-ui/react"
import lodash from "lodash"
import { useAppDispatch } from "~/store/store"
import { useSelector } from "react-redux"
import { selectUser } from "~/store/user/selector"
import Scrollable from "~/components/Scrollable/Scrollable"
import InfiniteScroll from "~/utils/InfiniteScroll"
import LazyLoadImage from "~/utils/LazyLoadImage"
import { uniqueFilename } from "~/utils/unique"
import { IUpload } from "~/interfaces/editor"
import Trash from "../../../../Icons/Trash"
import { deleteUploadFile, setUploading, uploadFile, uploadFiles } from "~/store/resources/action"
import { selectUploads } from "~/store/resources/selector"
import NoUploadsImage from "~/assets/images/no-uploads-to-display.svg"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import ModalUpgradePlan from "../../../../Modals/UpgradePlan"
const defaultPreviewTemplate = import.meta.env.VITE_APP_DEFAULT_URL_PREVIEW_TEMPLATE
const replacePreviewTemplate = import.meta.env.VITE_APP_REPLACE_URL_PREVIEW_TEMPLATE

const initialQuery = {
  page: 1,
  limit: 10,
  query: {
    used: false,
    favorited: false
  }
}

export default function Upload() {
  const { setInputActive } = useDesignEditorContext()
  const user = useSelector(selectUser)
  const toast = useToast()
  const [fetching, setFetching] = useState(true)
  const inputFileRef = useRef<HTMLInputElement>(null)
  const initialFocusRef = useRef<any>()
  const dispatch = useAppDispatch()
  const [resources, setResources] = useState<any[]>([])
  const editor = useEditor()
  const [validateContent, setValidateContent] = useState<string | null>(null)
  const selectResourcesUploads = useSelector(selectUploads)
  const [type, setType] = useState({ svg: false, png: false, jpg: false })
  const [types, setTypes] = useState<string[]>([])
  const [nameUpload, setNameUpload] = useState<string[]>([""])
  const [nameUploadPrev, setNameUploadPrev] = useState<string[]>([""])
  let [stateFavorite, setStateFavorite] = useState<boolean>(false)
  let [stateRecent, setStateRecent] = useState<boolean>(false)
  const [disableTab, setDisableTab] = useState<boolean>(false)
  const [loadMoreResources, setLoadMoreResources] = useState<boolean>(true)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const activeScene: any = useActiveScene()
  const activeObject = useActiveObject()
  const { isOpen: isOpenUpgradeUser, onOpen: onOpenUpgradeUser, onClose: onCloseUpgradeUser } = useDisclosure()

  useEffect(() => {
    user && initialState()
  }, [user])

  const initialState = async () => {
    if (selectResourcesUploads[0] === undefined) {
      setLoadMoreResources(true)
      const resolveAction = await dispatch(uploadFiles(initialQuery))
      //@ts-ignore
      const resolve = resolveAction?.payload?.payload
      setResources(resolve)
      setFetching(false)
      setLoadMoreResources(false)
      if (resolve[0] === undefined && resources[0] === undefined) {
        setValidateContent("Start uploading your illustrations here.")
      } else {
        setValidateContent(null)
      }
    } else {
      setResources(selectResourcesUploads)
      setFetching(false)
      setLoadMoreResources(false)
    }
  }

  const handleDropFiles = (files: FileList) => {
    const file = files[0]
    if (
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/svg+xml" ||
      file.type === "image/svg" ||
      file.type === "image/jpeg"
    ) {
      handleUploadFile(file)
      const reader = new FileReader()
      reader.addEventListener("load", function () {}, false)

      if (file) {
        reader.readAsDataURL(file)
      }
    } else {
      toast({
        title: "Please upload a valid resource.",
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true
      })
    }
  }

  const handleUploadFile = async (file: File) => {
    try {
      toast({
        title: "Please wait, the image is loading.",
        status: "info",
        position: "top",
        duration: 5000,
        isClosable: true
      })
      //
      const updatedFileName = uniqueFilename(file.name)
      const updatedFile = new File([file], updatedFileName)
      dispatch(
        setUploading({
          progress: 0,
          status: "IN_PROGRESS"
        })
      )
      const resolve: any = await (await dispatch(uploadFile({ file: updatedFile, nameFile: file.name }))).payload
      setResources([resolve].concat(resources))
      setValidateContent(null)
      toast({
        title: "The image was uploaded successfully.",
        status: "success",
        position: "top",
        duration: 5000,
        isClosable: true
      })
    } catch (err) {
      toast({
        title: "Error loading image.",
        status: "error",
        position: "top",
        duration: 5000,
        isClosable: true
      })
    }
  }

  const fetchDataResource = async () => {
    setFetching(true)
    if (
      nameUpload[0] === "" &&
      stateFavorite === false &&
      stateRecent === false &&
      type.jpg === false &&
      type.png === false &&
      type.svg === false
    ) {
      let query = initialQuery
      query.page = resources.length / 10 + 1
      const resolveAction = await dispatch(uploadFiles(query))
      //@ts-ignore
      const resolve = resolveAction?.payload?.payload
      setResources(resources.concat(resolve))
      resolve[0] === undefined && setFetching(true)
    } else {
      let query = {
        names: nameUpload,
        types: types,
        used: stateRecent,
        favorited: stateFavorite
      }
      let newQuery = Object.fromEntries(
        Object.entries(query).filter((e: any) => {
          if (e[0] === "types") {
            if (e[1][0] === undefined) {
              return null
            } else {
              return e
            }
          } else {
            return e
          }
        })
      )
      const resolve: any[] = await api.updateUploadFile({
        limit: 10,
        page: resources.length / 10 + 1,
        query: newQuery
      })

      if (resolve[0] === undefined && resources[0] === undefined) {
        stateRecent === true
          ? setValidateContent("No recent shapes to display")
          : setValidateContent("Nothing was found related to the filter entered")
      } else {
        setValidateContent(null)
      }
      resolve.map((obj) => selectResourcesUploads.find((resource: any) => obj.id === resource.id && setFetching(true)))
      const validateResources = lodash.uniqBy(resources.concat(resolve), "id")
      setResources(validateResources)
      resolve[0] === undefined && setFetching(true)
    }
    setDisableTab(false)
    setLoadMoreResources(false)
  }

  const addObject = useCallback(
    async (resource: any) => {
      try {
        await api.getUseUploads(resource.id)
      } catch {}
      const options: any = {
        type: resource.type === "svg" ? "StaticVector" : "StaticImage",
        src: resource.url.includes(defaultPreviewTemplate)
          ? resource.url.replace(defaultPreviewTemplate, replacePreviewTemplate)
          : resource.url,
        erasable: false,
        metadata: {}
      }
      if (editor) {
        activeScene.objects.add(options)
      }
    },
    [activeScene, editor, activeObject, user]
  )

  const handleFileInput = (e: any) => {
    handleDropFiles(e.target.files)
  }

  const handleInputFileRefClick = () => {
    if (user.plan !== "FREE") {
      inputFileRef.current?.click()
    } else {
      onOpenUpgradeUser()
    }
  }

  const makeFilter = ({
    svg,
    png,
    jpg,
    favorite,
    recent,
    name
  }: {
    svg?: boolean
    png?: boolean
    jpg?: boolean
    favorite?: boolean
    recent?: boolean
    name?: string
  }) => {
    setLoadMoreResources(true)
    setDisableTab(true)
    if (name || name === "") {
      setNameUpload(nameUploadPrev)
    }

    if (favorite || stateFavorite) {
      setStateRecent(false)
      setStateFavorite(true)
    } else if (recent || stateRecent) {
      setStateRecent(true)
      setStateFavorite(false)
    }

    if (svg) {
      setType({ ...type, svg: true })
      !types.find((e) => e === "svg") && setTypes(types.concat(["svg"]))
    } else if (svg === false) {
      setType({ ...type, svg: false })
      setTypes(types.filter((e) => e !== "svg"))
    }

    if (png) {
      setType({ ...type, png: true })
      !types.find((e) => e === "png") && setTypes(types.concat(["png"]))
    } else if (png === false) {
      setType({ ...type, png: false })
      setTypes(types.filter((e) => e !== "png"))
    }

    if (jpg) {
      setType({ ...type, jpg: true })
      !types.find((e) => e === "jpg") && setTypes(types.concat(["jpg"]))
    } else if (jpg === false) {
      setType({ ...type, jpg: false })
      setTypes(types.filter((e) => e !== "jpg"))
    }

    try {
      if (svg === false && png === false && jpg === false && name && !recent && !favorite) {
        setResources(selectResourcesUploads)
      } else {
        setResources([])
      }
    } catch {
      setResources([])
    }
    setFetching(false)
    setValidateContent(null)
  }

  const makeBlur = () => {
    setDisableTab(false)
    if (nameUploadPrev[0] === "") {
      if (nameUploadPrev[0] === "" && stateFavorite === false && stateRecent === false) {
        setNameUpload([""])
        setResources(selectResourcesUploads)
      } else {
        nameUpload[0] !== nameUploadPrev[0] && makeFilter({ name: "" })
      }
    }
    nameUpload[0] !== nameUploadPrev[0] && makeFilter({ name: nameUploadPrev[0] })
    setInputActive(false)
    onClose()
  }

  if (user === null) {
    return (
      <Center w="full" h="full">
        You need to login to upload files.
      </Center>
    )
  }

  return (
    <Box
      h="full"
      width="320px"
      borderRight="1px solid #ebebeb"
      padding="1rem 0"
      display="flex"
      flexDirection="column"
      gap="10px"
    >
      <Flex padding={"0 1rem"} gap={"0.5rem"}>
        <Input
          size="sm"
          ref={initialFocusRef}
          placeholder="Search"
          onFocus={() => {
            onOpen()
            setInputActive(true)
          }}
          onBlur={makeBlur}
          onKeyDown={(e) => e.key === "Enter" && initialFocusRef.current.blur()}
          onChange={(e) => setNameUploadPrev([e.target.value])}
          sx={{
            _focusVisible:{
              boxShadow : "none"
            }
          }}
        />
      </Flex>
      <Popover closeOnBlur={true} initialFocusRef={initialFocusRef} isOpen={isOpen} onClose={onClose}>
        <PopoverTrigger>
          <Button visibility="hidden" w="full" position="absolute">
            Trigger
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverBody>
            <Flex flexDir="column" fontSize="12px" gap="5px">
              <Flex>
                <Text>Recent searches</Text>
                <Spacer />
                <Text>Erase</Text>
              </Flex>
              <Flex></Flex>
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <Flex padding={"0 1rem"} gap={"0.5rem"}>
        <Button
          bg={type.svg ? "#5456F5" : "#DDDFE5"}
          color={type.svg ? "white" : "#545465"}
          borderRadius="30px"
          onClick={() => {
            if (type.svg) {
              if (
                type.png === false &&
                type.jpg === false &&
                nameUploadPrev[0] === "" &&
                stateFavorite === false &&
                stateRecent === false
              ) {
                setResources(selectResourcesUploads)
                setFetching(false)
                setType({ ...type, svg: false })
                setValidateContent(null)
                setTypes(types.filter((e) => e !== "svg"))
              } else {
                makeFilter({ svg: false })
              }
            } else {
              makeFilter({ svg: true })
            }
          }}
          variant="outline"
          size="sm"
        >
          SVG
        </Button>
        <Button
          bg={type.png ? "#5456F5" : "#DDDFE5"}
          color={type.png ? "white" : "#545465"}
          borderRadius="30px"
          onClick={() => {
            if (type.png) {
              if (
                type.jpg === false &&
                type.svg === false &&
                nameUploadPrev[0] === "" &&
                stateFavorite === false &&
                stateRecent === false
              ) {
                setResources(selectResourcesUploads)
                setFetching(false)
                setValidateContent(null)
                setType({ ...type, png: false })
                setTypes(types.filter((e) => e !== "png"))
              } else {
                makeFilter({ png: false })
              }
            } else {
              makeFilter({ png: true })
            }
          }}
          variant="outline"
          size="sm"
        >
          PNG
        </Button>
        <Button
          bg={type.jpg ? "#5456F5" : "#DDDFE5"}
          color={type.jpg ? "white" : "#545465"}
          borderRadius="30px"
          onClick={() => {
            if (type.jpg) {
              if (
                type.png === false &&
                type.svg === false &&
                nameUploadPrev[0] === "" &&
                stateFavorite === false &&
                stateRecent === false
              ) {
                setResources(selectResourcesUploads)
                setFetching(false)
                setValidateContent(null)
                setType({ ...type, jpg: false })
                setTypes(types.filter((e) => e !== "jpg"))
              } else {
                makeFilter({ jpg: false })
              }
            } else {
              makeFilter({ jpg: true })
            }
          }}
          variant="outline"
          size="sm"
        >
          JPG
        </Button>
      </Flex>
      <Flex margin={"0 1rem"} style={{ display: "flex" }}>
        <ModalUpgradePlan
          type="Upload"
          isOpen={isOpenUpgradeUser}
          onOpen={onOpenUpgradeUser}
          onClose={onCloseUpgradeUser}
        />
        <Button variant="outline" w="100%" onClick={handleInputFileRefClick}>
          Upload
        </Button>
        <Input
          variant="outline"
          onChange={handleFileInput}
          type="file"
          id="file"
          ref={inputFileRef}
          style={{ display: "none" }}
        />
      </Flex>
      <Box sx={{ padding: "0 1rem" }}>
        <Tabs size={"sm"}>
          <TabList>
            <Tab
              isDisabled={disableTab}
              onClick={() => {
                setNameUpload([""])
                setStateFavorite(false)
                setStateRecent(false)
                setType({ png: false, jpg: false, svg: false })
                setResources(selectResourcesUploads)
                setValidateContent(null)
                setLoadMoreResources(true)
                initialState()
              }}
            >
              All
            </Tab>
            <Tab
              isDisabled={disableTab}
              onClick={() => {
                stateFavorite = false
                makeFilter({ recent: true })
              }}
            >
              Recent
            </Tab>
          </TabList>
        </Tabs>
      </Box>
      <Flex w="full" h="full" flexDir="column">
        {validateContent === null ? (
          <Flex h="full" w="full" flexDir="column">
            <Scrollable autoHide={true}>
              <InfiniteScroll hasMore={!fetching} fetchData={fetchDataResource}>
                {!loadMoreResources ? (
                  <Grid gap="0.5rem" padding="0 2rem 2rem" gridTemplateColumns="1fr 1fr">
                    {resources?.map((upload: any, index: number) => (
                      <UploadItem
                        setResources={setResources}
                        resources={resources}
                        object={upload}
                        key={index}
                        addObject={() => addObject(upload)}
                        setValidateContent={setValidateContent}
                      />
                    ))}
                    <GridItem colSpan={2}>
                      <Button
                        w="full"
                        variant="outline"
                        isLoading={loadMoreResources}
                        isDisabled={fetching}
                        onClick={fetchDataResource}
                      >
                        {fetching ? "There are no more resources" : "Load more resources?"}
                      </Button>
                    </GridItem>
                  </Grid>
                ) : (
                  <Flex h="50%" w="full" align="end" justify="center">
                    <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="#5456f5" size="xl" />
                  </Flex>
                )}
              </InfiniteScroll>
            </Scrollable>
          </Flex>
        ) : (
          <Center flexDirection="column" h="full" w="full" textAlign="center" gap="20px">
            <img src={NoUploadsImage} />
            <p>{validateContent}</p>
          </Center>
        )}
      </Flex>
    </Box>
  )
}

const UploadItem = ({
  object,
  addObject,
  setResources,
  resources,
  setValidateContent
}: {
  object: any
  addObject: () => void
  setResources: React.Dispatch<React.SetStateAction<any[]>>
  setValidateContent: React.Dispatch<React.SetStateAction<string>>
  resources: any[]
}) => {
  const dispatch = useAppDispatch()
  const editor = useEditor()

  const dragObject = useCallback(async () => {
    const options: any = {
      type: object.type === "svg" ? "StaticVector" : "StaticImage",
      src: object.url.includes(defaultPreviewTemplate)
        ? object.url.replace(defaultPreviewTemplate, replacePreviewTemplate)
        : object.url,
      erasable: false
    }
    let img = new Image()
    img.src = object.url
    if (editor) {
      editor.dragger.onDragStart(options, { desiredSize: 300 })
    }
    try {
      await api.getUseUploads(object.id)
    } catch {}
  }, [editor, object])

  const handleDelete = useCallback(async () => {
    try {
      await dispatch(deleteUploadFile(object))
      setResources(resources.filter((e) => e.id !== object.id))
      resources.length === 1 && setValidateContent("Start uploading your illustrations here.")
    } catch {}
  }, [object, resources])

  return (
    <Flex border="1px solid #d0d0d0" _hover={{ cursor: "pointer", border: "3px solid #5456F5" }} boxSize="120px">
      <IconButton
        position="absolute"
        marginTop="5.5rem"
        marginLeft="5.8rem"
        variant="ghost"
        aria-label="Like"
        size="xs"
        _hover={{ color: "#fd7e14" }}
        border="1px solid #d0d0d0"
        onClick={handleDelete}
        icon={<Trash size={20} />}
      />
      <Flex onDragStart={dragObject} w="full" h="full" onClick={addObject}>
        <LazyLoadImage url={object?.url} />
      </Flex>
    </Flex>
  )
}
