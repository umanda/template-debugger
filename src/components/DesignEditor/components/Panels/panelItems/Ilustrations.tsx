import React, { useCallback, useRef } from "react"
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  Textarea,
  useToast,
  GridItem,
  Image as CImage
} from "@chakra-ui/react"
import { Tabs, TabList, Tab } from "@chakra-ui/react"
import { useActiveObject, useActiveScene, useEditor } from "@layerhub-pro/react"
import { useState } from "react"
import { useSelector } from "react-redux"
import * as api from "~/services/api"
import { useEffect } from "react"
import lodash from "lodash"
import { IResolveRecommend, IResource } from "~/interfaces/editor"
import { useAppDispatch } from "~/store/store"
import { selectListDrawifiers, selectUser } from "~/store/user/selector"
import { selectListRecommendResource } from "~/store/recommend/selector"
import Order, { FilterByDrawifier } from "~/components/Modals/Order"
import HorizontalScroll from "~/utils/HorizontaScroll"
import Scrollable from "~/components/Scrollable"
import InfiniteScroll from "~/utils/InfiniteScroll"
import LikeClick from "~/components/Icons/LikeClick"
import Like from "~/components/Icons/Like"
import LazyLoadImage from "~/utils/LazyLoadImage"
import { getListRecommend } from "~/store/recommend/action"
import Search from "~/components/Icons/Search"
import Pro from "~/components/Icons/Pro"
import FilterByTags from "~/components/Icons/FilterByTags"
import { selectResourceImages } from "~/store/resources/selector"
import { getFavoritedResources, getListResourcesImages, makeFavoriteResource } from "~/store/resources/action"
import { selectProject } from "~/store/project/selector"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import { updateProject } from "~/store/project/action"
import { generateEmptyDesign } from "~/constants/consts"
import { useParams } from "react-router-dom"
import { nanoid } from "nanoid"

const watermarkURL = import.meta.env.VITE_APP_WATERMARK
const redirectPayments = import.meta.env.VITE_PAYMENTS

export const limitCharacters = (name: string) => {
  const newName = name?.substring(0, 15)
  if (name?.length > 15) {
    return `${newName}.`
  } else {
    return newName
  }
}

export const splitName = (name: string) => {
  const nameArr = name.split(" ")
  return nameArr
}

const initialQuery = {
  page: 0,
  limit: 10,
  query: {
    is_published: true
  },
  sorts: ["LAST_UPDATE"]
}

export default function Ilustrations() {
  const dispatch: any = useAppDispatch()
  const { setInputActive } = useDesignEditorContext()
  const initialFocusRef = useRef<any>()
  const textAreaRef = useRef<any>()
  const [validateContent, setValidateContent] = useState<string | null>(null)
  let [nameIllustration, setNameIllustration] = useState<string[]>([""])
  let [nameIllustrationPrev, setNameIllustrationPrev] = useState<string[]>([""])
  const editor = useEditor()
  const [order, setOrder] = useState<string[]>(["LAST_UPDATE"])
  const user = useSelector(selectUser)
  const { isOpen: isOpenInput, onOpen: onOpenInput, onClose: onCloseInput } = useDisclosure()
  const { isOpen: isOpenSearchFound, onOpen: onOpenSearchFound, onClose: onCloseSearchFound } = useDisclosure()
  const [resourcesIllustration, setResourcesIllustration] = useState<any[]>([])
  const [load, setLoad] = useState(false)
  const [more, setMore] = useState(false)
  const selectListResources = useSelector(selectResourceImages).resources
  const selectListFavoriteResources = useSelector(selectResourceImages).favorited
  let [stateFavorite, setStateFavorite] = useState<boolean>(false)
  let [stateRecent, setStateRecent] = useState<boolean>(false)
  const [orderDrawifier, setOrderDrawifier] = useState<string[]>([""])
  const [disableTab, setDisableTab] = useState<boolean>(false)
  const defaultRecommend = useSelector(selectListRecommendResource)
  const [listRecommend, setListRecommend] = useState<IResolveRecommend>({ words: [] })
  const [contentInput, setContentInput] = useState<IResolveRecommend>(defaultRecommend)
  const [loadMoreResources, setLoadMoreResources] = useState<boolean>(false)
  const [toolTip, setToolTip] = useState(false)
  const activeScene = useActiveScene()
  const activeObject = useActiveObject()
  const projectSelect = useSelector(selectProject)
  const [page, setPage] = useState<number>(0)
  const filterResource = localStorage.getItem("drawing_filter")
  const [notIds, setNotIds] = useState<number[]>([])
  const [textArea, setTextArea] = useState<string>()
  const toast = useToast()
  const { id } = useParams()
  const [stateTabs, setStateTabs] = useState<number>(0)
  const refTab = useRef<any>()

  useEffect(() => {
    initialState()
  }, [user])

  useEffect(() => {
    if (filterResource !== undefined && filterResource !== null) {
      setNameIllustration([filterResource])
      setNameIllustrationPrev([filterResource])
      localStorage.removeItem("drawing_filter")
    }
  }, [])

  useEffect(() => {
    if (resourcesIllustration.length === 0) {
      stateFavorite === true && setValidateContent("No favorite illustrations to display")
      stateRecent === true && setValidateContent("No recent illustrations to display")
    }
  }, [resourcesIllustration])

  const initialState = useCallback(async () => {
    setMore(false)
    if (defaultRecommend.words[0] === undefined) {
      const resolve = (await dispatch(getListRecommend({ index: "RESOURCE", categories: ["IMAGE"], words: [] })))
        .payload as IResolveRecommend
      setContentInput(resolve)
    }
    if (selectListResources[0] === undefined && filterResource === undefined) {
      const resolve = (await dispatch(getListResourcesImages(initialQuery))).payload as IResource[]
      resolve && setResourcesIllustration(resolve)
      resolve ? setMore(true) : setMore(false)
    } else {
      setResourcesIllustration(selectListResources)
      setMore(true)
    }
    if (user) {
      dispatch(getFavoritedResources({ query: { favorited: true }, sorts: [] }))
    }
    setLoad(true)
    setDisableTab(false)
  }, [selectListResources, filterResource])

  const fetchDataResource = async () => {
    setMore(false)
    setLoadMoreResources(true)
    if (
      nameIllustration[0] === "" &&
      stateFavorite === false &&
      stateRecent === false &&
      orderDrawifier[0] === "" &&
      order[0] === "LAST_UPDATE"
    ) {
      let newQuery = initialQuery
      newQuery.page = selectListResources.length / 10 + 1
      let resolve = null
      if (stateTabs === 0) {
        resolve = (await (await dispatch(getListResourcesImages(newQuery))).payload) as IResource[]
      } else {
        resolve = await api.getListResourcesIA(newQuery)
      }
      setResourcesIllustration(selectListResources.concat(resolve))
      resolve[0] !== undefined && setMore(true)
    } else {
      let resolve: any
      try {
        if (stateTabs === 0) {
          resolve = await api.searchResources(
            {
              page: nameIllustration[0] === "" ? Math.round(resourcesIllustration.length) / 10 + 1 : page,
              limit: 10,
              query: {
                drawifier_ids: orderDrawifier[0] ? orderDrawifier : undefined,
                keywords:
                  nameIllustration[0] === "" || nameIllustration[0] === undefined ? undefined : nameIllustration,
                is_published: true,
                favorited: stateFavorite === true ? true : undefined,
                used: stateRecent === true ? true : undefined,
                notIds: notIds[0] === undefined ? undefined : notIds
              },
              sorts: stateRecent ? ["USED_AT"] : order
            },
            setNotIds,
            notIds
          )
        } else {
          resolve = await api.getListResourcesIA({
            page: nameIllustration[0] === "" ? Math.round(resourcesIllustration.length) / 10 + 1 : page + 1,
            limit: 10,
            query: {
              text: nameIllustration[0] === "" || nameIllustration[0] === undefined ? undefined : nameIllustration[0]
            }
          })
        }
      } catch {}
      if (resolve[0] === undefined && resourcesIllustration[0] === undefined) {
        stateFavorite === true
          ? setValidateContent("No favorite illustrations to display")
          : stateRecent === true
          ? setValidateContent("No recent illustrations to display")
          : setValidateContent("noResult")
      } else {
        setValidateContent(null)
      }
      setPage(page + 1)
      resolve.map((obj) => {
        resourcesIllustration.find((resource) => {
          obj.id === resource.id && setMore(false)
        })
      })
      if (stateTabs === 0) {
        if (nameIllustration[0] !== "") {
          resolve?.sort((a, b) => b.count_drawings - a.count_drawings)
          const lastDraw = resolve.find(
            (r) => r?.drawifierId === resourcesIllustration[resourcesIllustration.length - 1]?.drawifierId
          )
          resourcesIllustration.map((r) => {
            if (r?.drawifierId === lastDraw?.drawifierId) r.drawings = r.drawings?.concat(lastDraw?.drawings)
          })
          setResourcesIllustration(
            resourcesIllustration.concat(resolve?.filter((r) => r?.drawifierId !== lastDraw?.drawifierId))
          )
        } else {
          const validateResources = lodash.uniqBy(resourcesIllustration.concat(resolve), "id")
          setResourcesIllustration(validateResources)
        }
      } else if (stateTabs === 1) {
        setResourcesIllustration(resourcesIllustration.concat(resolve))
      }
      resolve[0] !== undefined ? setMore(true) : setMore(false)
      resolve[9] === undefined && nameIllustration[0] === "" && setMore(false)
    }
    setLoadMoreResources(false)
    setLoad(true)
    setDisableTab(false)
  }

  const addObject = useCallback(
    async (resource: IResource) => {
      try {
        const ctx = { id: resource.id }
        const options: any = {
          type: "StaticVector",
          name: "Illustration",
          src: resource.url.concat("?" + nanoid(6)),
          preview: resource.url.concat("?" + nanoid(6)),
          erasable: false,
          watermark:
            resource.license === "paid" && user.plan === "FREE"
              ? `${watermarkURL}?${Math.random().toString(36).substring(2, 10)}`
              : undefined
        }
        if (editor) {
          await editor.design.activeScene.objects.add(options, { desiredSize: 200 })
        }
        if (user && projectSelect) {
          api.recentResource({ project_id: projectSelect.id, resource_id: ctx.id })
        } else if (user) {
          const emptyDesign = generateEmptyDesign({ width: 1920, height: 1080 })
          const resolve = await dispatch(updateProject({ ...emptyDesign, key: id }))
          api.recentResource({ project_id: resolve?.payload.id, resource_id: ctx.id })
        }
      } catch {}
    },
    [activeScene, editor, activeObject, projectSelect, user, id]
  )

  const makeFilter = async ({
    input,
    stateFavorites,
    stateRecents
  }: {
    input?: string[]
    stateFavorites?: boolean
    stateRecents?: boolean
  }) => {
    setPage(0)
    setMore(true)
    setLoad(false)
    setDisableTab(true)

    if (input) {
      setNameIllustration(input)
      setNotIds([])
      setResourcesIllustration([])
      if (input[0] === "") {
        setListRecommend({ words: [] })
      }
    }

    if (stateFavorites || stateFavorite) {
      setStateRecent(false)
      setStateFavorite(true)
    } else if (stateRecents || stateRecent) {
      setStateRecent(true)
      setStateFavorite(false)
    }

    try {
      //@ts-ignore
      if (!stateFavorite && !stateRecent && input[0] === undefined) {
        setResourcesIllustration(selectListResources)
      } else {
        setResourcesIllustration([])
      }
    } catch {
      setResourcesIllustration([])
    }
    setValidateContent(null)
  }

  const makeFavorite = useCallback(
    async (obj: IResource) => {
      dispatch(makeFavoriteResource(obj))
      if (stateFavorite === true) {
        setResourcesIllustration(resourcesIllustration.filter((resource) => obj.id !== resource.id))
      }
    },
    [stateFavorite, resourcesIllustration]
  )

  const makeChangeInput = useCallback(async (valueInput: string) => {
    setNameIllustrationPrev([valueInput])
    if (valueInput !== "") {
      const resolve: IResolveRecommend = await api.getListRecommend({
        index: "RESOURCE",
        categories: ["IMAGE"],
        words: [valueInput]
      })
      setListRecommend(resolve)
      setContentInput(resolve)
    }
  }, [])

  const makeBlur = useCallback(() => {
    setValidateContent(null)
    if (nameIllustrationPrev[0]?.length > 2) {
      nameIllustrationPrev[0] !== nameIllustration[0] && makeFilter({ input: nameIllustrationPrev })
      setDisableTab(false)
    } else if (nameIllustrationPrev[0] === "") {
      if (
        nameIllustrationPrev[0] === "" &&
        stateFavorite === false &&
        stateRecent === false &&
        orderDrawifier[0] === undefined &&
        order[0] === "USED_AT"
      ) {
        setNameIllustrationPrev([""])
        setNameIllustration([""])
        setResourcesIllustration(selectListResources)
        setListRecommend({ words: [] })
        setContentInput(defaultRecommend)
        setNameIllustrationPrev([""])
      } else {
        nameIllustration[0] !== nameIllustrationPrev[0] && makeFilter({ input: [""] })
        nameIllustration[0] !== nameIllustrationPrev[0] && setResourcesIllustration([])
      }
    } else {
      setToolTip(true)
      setTimeout(() => {
        setToolTip(false)
      }, 3000)
    }
    setInputActive(false)
    setTimeout(() => {
      onCloseInput()
    }, 100)
  }, [nameIllustration, nameIllustrationPrev, stateFavorite, stateRecent, orderDrawifier, order, selectListResources])

  const makeFilterBySeggestion = useCallback((e: string) => {
    setNameIllustrationPrev([e])
    makeFilter({ input: [e] })
    makeChangeInput(e)
    onCloseInput()
  }, [])

  const sendIllustrationRequest = useCallback(async (text: string) => {
    try {
      const resolve = await api.setRequestIllustration(text)
      toast({
        title:
          resolve?.is_sent === true
            ? "Your image request has been submitted successfully!."
            : "Oops, there was a problem, please try again.",
        status: resolve?.is_sent === true ? "info" : "warning",
        position: "top",
        duration: 3000,
        isClosable: true
      })
      textAreaRef.current.value = ""
    } catch {
      toast({
        title: "Oops, there was a problem, please try again.",
        status: "info",
        position: "top",
        duration: 3000,
        isClosable: true
      })
      textAreaRef.current.value = ""
    }
  }, [])

  const makeAllDraws = useCallback((drawifier: any) => {
    setResourcesIllustration([])
    setPage(0)
    setNameIllustration([drawifier?.drawifier_name?.split(" ")[0]])
    setNameIllustrationPrev(drawifier?.drawifier_name)
    setOrderDrawifier([drawifier?.drawifierId])
    api.viewDrawifier(drawifier?.drawifierId)
  }, [])

  const dragObject = useCallback(
    async (e: React.DragEvent<HTMLDivElement>, illustration: IResource) => {
      try {
        let img = new Image()
        img.src = illustration.url
        if (editor) {
          e.dataTransfer.setDragImage(img, img.width / 2, img.height / 2)
          editor.dragger.onDragStart(
            {
              type: "StaticVector",
              name: "Illustration",
              erasable: false,
              watermark: illustration.license === "paid" && user.plan === "FREE" ? watermarkURL : undefined,
              preview: illustration.url,
              src: `${illustration.url}?${Math.random().toString(36).substring(2, 10)}`
            },
            { desiredSize: 400 }
          )
        }
        if (user && projectSelect) {
          const ctx = { id: illustration.id }
          api.recentResource({ project_id: illustration.id, resource_id: ctx.id })
        }
      } catch {}
    },
    [editor, user, projectSelect]
  )

  const changeTab = useCallback(
    (tab: number) => {
      setStateTabs(tab)
      if (tab === 0) {
        setResourcesIllustration(selectListResources)
        setNameIllustration([""])
        setNameIllustrationPrev([""])
        setValidateContent(null)
      } else if (tab === 1) {
        refTab.current.focus()
        setResourcesIllustration([])
        setNameIllustration([""])
        setNameIllustrationPrev([""])
        setValidateContent(null)
      }
    },
    [stateTabs, selectListResources, refTab]
  )

  return (
    <Flex h="full" width="320px" borderRight="1px solid #ebebeb" flexDirection="column">
      <Grid templateColumns="repeat(2, 1fr)" marginBottom="10px">
        <GridItem
          display="flex"
          h="50px"
          color={stateTabs === 0 ? "#5456F5" : "#545465"}
          justifyContent="center"
          alignItems="center"
          _hover={{
            cursor: "pointer",
            color: "#5456F5"
          }}
          onClick={() => changeTab(0)}
          borderRight="1px solid #ebebeb"
          borderBottom={stateTabs === 0 ? null : "1px solid #ebebeb"}
        >
          Search
        </GridItem>
        <GridItem
          _hover={{
            cursor: "pointer",
            color: "#5456F5"
          }}
          onClick={() => changeTab(1)}
          color={stateTabs === 1 ? "#5456F5" : "#545465"}
          display="flex"
          h="50px"
          justifyContent="center"
          alignItems="center"
          borderBottom={stateTabs === 1 ? null : "1px solid #ebebeb"}
        >
          Smart Search
        </GridItem>
      </Grid>
      {user.type !== "HERO" && stateTabs === 1 && (
        <Flex padding={"0 1rem"} gap={"0.5rem"} justify={"space-between"}>
          <Popover closeOnBlur={false} initialFocusRef={initialFocusRef} isOpen={isOpenInput} onClose={onCloseInput}>
            <HStack width={"100%"}>
              <PopoverAnchor>
                <Tooltip
                  isOpen={toolTip}
                  openDelay={500}
                  label="Enter at least 3 letters and wait for the result"
                  fontSize="md"
                  hasArrow
                  arrowSize={10}
                >
                  <Input
                    size="sm"
                    autoComplete="off"
                    spellCheck="false"
                    id="input"
                    ref={initialFocusRef}
                    value={nameIllustrationPrev}
                    placeholder="Search"
                    sx={{
                      _focusVisible: {
                        boxShadow: "none"
                      }
                    }}
                    onFocus={() => {
                      onOpenInput()
                      setInputActive(true)
                    }}
                    onBlur={makeBlur}
                    onKeyDown={(e) => e.key === "Enter" && initialFocusRef.current.blur()}
                    onChange={(e) => makeChangeInput(e.target.value)}
                  />
                </Tooltip>
              </PopoverAnchor>
              <PopoverTrigger>
                <Button visibility="hidden" position="absolute">
                  Trigger
                </Button>
              </PopoverTrigger>
            </HStack>
            <PopoverContent id="input">
              <PopoverArrow />
              <PopoverBody id="input">
                <Flex id="input" flexDir="column" fontSize="12px" gap="5px">
                  <Flex id="input">Suggestion</Flex>
                  {contentInput?.words.map(
                    (obj, index) =>
                      index <= 6 && (
                        <Button
                          id="input"
                          size="xs"
                          justifyItems="left"
                          justifyContent="left"
                          leftIcon={<Search size={15} />}
                          variant="ghost"
                          w="full"
                          key={index}
                          onClick={() => makeFilterBySeggestion(obj)}
                        >
                          {obj}
                        </Button>
                      )
                  )}
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <Order
            setFetching={setMore}
            setResources={setResourcesIllustration}
            setSkeleton={setLoad}
            setOrder={setOrder}
            setDrawifier={setOrderDrawifier}
            order={order}
            drawifier={orderDrawifier}
            setPage={setPage}
          />
        </Flex>
      )}
      <Box>
        <HorizontalScroll>
          {listRecommend.words.map((obj, index) => (
            <Box key={index}>
              <Button
                onClick={() => {
                  makeChangeInput(obj)
                  makeFilter({ input: [obj] })
                }}
              >
                {obj}
              </Button>
            </Box>
          ))}
        </HorizontalScroll>
      </Box>
      <Box sx={{ padding: "0 1rem" }}>
        <Tabs size={"sm"}>
          <TabList>
            <Tab
              isDisabled={disableTab}
              ref={refTab}
              onClick={() => {
                setResourcesIllustration([])
                setNameIllustrationPrev([""])
                setNameIllustration([""])
                setStateFavorite(false)
                setStateRecent(false)
                setValidateContent(null)
                setMore(true)
                setOrder(["LAST_UPDATE"])
                setOrderDrawifier([])
                initialState()
                setListRecommend({ words: [] })
                setPage(0)
                setNotIds([])
              }}
            >
              All
            </Tab>
            <Tab
              isDisabled={disableTab}
              visibility={stateTabs === 1 ? "hidden" : "visible"}
              onClick={() => {
                stateFavorite = false
                user ? makeFilter({ stateRecents: true }) : setValidateContent("You need to login to see this panel.")
              }}
            >
              Recent
            </Tab>
            <Tab
              isDisabled={disableTab}
              visibility={stateTabs === 1 ? "hidden" : "visible"}
              onClick={() => {
                stateRecent = false
                user ? makeFilter({ stateFavorites: true }) : setValidateContent("You need to login to see this panel.")
              }}
            >
              Favorite
            </Tab>
          </TabList>
        </Tabs>
      </Box>
      {stateTabs === 0 ? (
        <>
          <Flex w="full" h="full" flexDir="column">
            {validateContent === null ? (
              <Scrollable autoHide={true}>
                <InfiniteScroll hasMore={more} fetchData={fetchDataResource}>
                  {load ? (
                    nameIllustration[0] !== "" ? (
                      <Flex marginTop="20px" marginInline="20px" flexDir="column">
                        {resourcesIllustration?.map((r, index) => (
                          <Flex flexDir="column" key={index} gap="5px" alignItems="center">
                            <Flex w="full">
                              <Avatar marginLeft="10px" size="md" name={r?.drawifier_name} src={r?.avatar} />
                              <Flex flexDir="column" w="full">
                                <Center flexDirection="column">
                                  <Box sx={{ fontSize: "12px" }} fontWeight="bold">
                                    {limitCharacters(r?.drawifier_name)}
                                  </Box>
                                  <Box sx={{ fontSize: "12px" }}>{`Found ${r?.total_drawings ?? 0} drawings`}</Box>
                                </Center>
                                <Center
                                  color="#fa6400"
                                  fontWeight="600"
                                  fontSize="12px"
                                  _hover={{ cursor: "pointer" }}
                                  onClick={() => makeAllDraws(r)}
                                >
                                  {`All ${r?.drawifier_name?.split(" ")[0] ?? null}'s drawings`}
                                </Center>
                              </Flex>
                            </Flex>
                            <Flex
                              h="1px"
                              w="full"
                              bg="linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5578606442577031) 27%, rgba(0,212,255,0) 100%)"
                            ></Flex>
                            <Grid w="full" gap="2px" templateColumns="repeat(2, 1fr)">
                              {r?.drawings?.map(
                                (illustration, index) =>
                                  illustration && (
                                    <IllustrationItem
                                      makeFavorite={makeFavorite}
                                      addObject={() => addObject(illustration)}
                                      illustration={illustration}
                                      key={index}
                                      listFavorite={selectListFavoriteResources}
                                    />
                                  )
                              )}
                            </Grid>
                          </Flex>
                        ))}
                        <Button
                          w="full"
                          variant="outline"
                          isLoading={loadMoreResources}
                          isDisabled={!more}
                          onClick={fetchDataResource}
                        >
                          Load More
                        </Button>
                      </Flex>
                    ) : (
                      <Flex flexDir="column">
                        <Box display="grid" gridTemplateColumns="1fr 1fr" gap="1rem" padding="1rem" w="full" h="full">
                          {resourcesIllustration.map(
                            (illustration, index) =>
                              illustration && (
                                <IllustrationItem
                                  makeDragObject={dragObject}
                                  makeFavorite={makeFavorite}
                                  addObject={() => addObject(illustration)}
                                  illustration={illustration}
                                  key={index}
                                  listFavorite={selectListFavoriteResources}
                                />
                              )
                          )}
                        </Box>
                        <Button
                          w="full"
                          variant="outline"
                          isLoading={loadMoreResources}
                          isDisabled={!more}
                          onClick={fetchDataResource}
                        >
                          Load More
                        </Button>
                      </Flex>
                    )
                  ) : (
                    <Flex h="50%" w="full" align="end" justify="center">
                      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="#5456f5" size="xl" />
                    </Flex>
                  )}
                </InfiniteScroll>
              </Scrollable>
            ) : (
              <Center flexDirection="column" h="full" w="full" textAlign="center" gap="20px">
                {stateFavorite !== true && stateRecent !== true && (
                  <Text fontSize="18px" fontWeight="700" color="#545465">
                    REQUEST A IMAGE
                  </Text>
                )}
                {stateFavorite === true ? (
                  <img src={"https://drawify-images.s3.eu-west-3.amazonaws.com/editor/noIllustrations.svg"} />
                ) : stateRecent === true ? (
                  <img src={"https://drawify-images.s3.eu-west-3.amazonaws.com/editor/noIllustrations.svg"} />
                ) : (
                  user.plan !== "Hero" && (
                    <img src={"https://drawify-images.s3.eu-west-3.amazonaws.com/editor/noImages.png"} />
                  )
                )}
                <Flex w="full" padding="10px">
                  {validateContent === "noResult" ? (
                    user.plan !== "HERO" ? (
                      <Flex flexDir="column" gap="20px" align="center">
                        <Text>Sorry! Your current plan does not support this feature.</Text>
                        <Text>
                          To send your request for an image, <u>upgrade to Drawify Hero.</u>
                        </Text>
                        <Button
                          w="-webkit-fit-content"
                          onClick={() => (window.location.href = redirectPayments)}
                          colorScheme={"brand"}
                        >
                          Upgrade
                        </Button>
                      </Flex>
                    ) : (
                      <Flex flexDir="column" w="full" align="center" gap="20px">
                        <Textarea
                          ref={textAreaRef}
                          onFocus={() => setInputActive(true)}
                          onChange={(e) => setTextArea(e.target.value)}
                          onBlur={() => setNameIllustration([textArea])}
                          w="full"
                          placeholder="Describe the image you would like"
                        />
                        <Button
                          isDisabled={textAreaRef?.current?.value! === "" ? true : false}
                          w="-webkit-fit-content"
                          onClick={() => sendIllustrationRequest(textArea)}
                          colorScheme={"brand"}
                        >
                          Send Image Request
                        </Button>
                      </Flex>
                    )
                  ) : (
                    <Flex w="full" justify="center">
                      {validateContent}
                    </Flex>
                  )}
                </Flex>
              </Center>
            )}
          </Flex>
        </>
      ) : nameIllustration[0] === "" ? (
        <Center h="full" flexDir="column">
          <CImage src="https://drawify-images.s3.eu-west-3.amazonaws.com/editor/magic-search.png" />
          {user.plan === "HERO" ? (
            <>
              <Text w="72%" textAlign="center">
                Get inspired with <b>SmartSearch</b>, powered by AI.
              </Text>
              <Text w="72%" textAlign="center">
                Search by phrase,and
                <br /> discover more creative search results, faster
              </Text>
            </>
          ) : (
            <>
              <Text textAlign="center">Spark your imagination!</Text>
              <br />
              <Text textAlign="center">
                Discover more interesting search
                <br /> results with SmartSearch
              </Text>
              <Button variant="outline" borderColor="#5456F5" color="#5456F5" margin="20px">
                Upgrade to unlock
              </Button>
            </>
          )}
        </Center>
      ) : (
        <Scrollable autoHide={true}>
          <InfiniteScroll hasMore={more} fetchData={fetchDataResource}>
            {load ? (
              <Grid gap="1rem" marginTop="20px" flex={1} marginInline="20px" templateColumns="repeat(2, 1fr)">
                {resourcesIllustration?.map((r, index) => (
                  <Flex
                    onDragStart={(e) => dragObject(e, r)}
                    draggable={true}
                    sx={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                    onClick={() => addObject(r)}
                    key={index}
                    border="1px #DDDFE5 solid"
                    padding="2px"
                    h="150px"
                    _hover={{ cursor: "pointer", border: "3px solid #5456F5" }}
                  >
                    <Flex w="full" h="full">
                      <LazyLoadImage url={r.url} />
                    </Flex>
                  </Flex>
                ))}
                <Button
                  w="full"
                  variant="outline"
                  isLoading={loadMoreResources}
                  isDisabled={!more}
                  onClick={fetchDataResource}
                >
                  Load More
                </Button>
              </Grid>
            ) : (
              <Flex h="50%" w="full" align="end" justify="center">
                <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="#5456f5" size="xl" />
              </Flex>
            )}
          </InfiniteScroll>
        </Scrollable>
      )}
    </Flex>
  )
}

function IllustrationItem({
  illustration,
  addObject,
  makeFavorite,
  listFavorite,
  makeDragObject
}: {
  illustration: IResource
  addObject: () => void
  makeFavorite: (obj: IResource) => void
  listFavorite: IResource[]
  makeDragObject?: (e: React.DragEvent<HTMLDivElement>, illustration: IResource) => Promise<void>
}) {
  const user = useSelector(selectUser)
  const [isHovering, setIsHovering] = React.useState(false)
  const [like, setLike] = React.useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [type, setType] = useState("")
  const [typeFilter, setTypeFilter] = useState<any>()
  const editor = useEditor()
  const projectSelect = useSelector(selectProject)

  useEffect(() => {
    listFavorite.find((resource) => resource.id === illustration.id) ? setLike(true) : setLike(false)
  }, [makeFavorite])

  const OpenModalIllustration = useCallback(async (type: string, illustration: IResource) => {
    setType(type)
    setTypeFilter(illustration)
    onOpen()
  }, [])

  // const dragObject = useCallback(
  //   async (e: React.DragEvent<HTMLDivElement>) => {
  //     try {
  //       let img = new Image()
  //       img.src = illustration.url
  //       if (editor) {
  //         e.dataTransfer.setDragImage(img, img.width / 2, img.height / 2)
  //         editor.dragger.onDragStart(
  //           {
  //             type: "StaticVector",
  //             name: "Illustration",
  //             erasable: false,
  //             watermark: illustration.license === "paid" && user.plan === "FREE" ? watermarkURL : null,
  //             preview: illustration.url,
  //             src: `${illustration.url}?${Math.random().toString(36).substring(2, 10)}`
  //           },
  //           { desiredSize: 400 }
  //         )
  //       }
  //       if (user && projectSelect) {
  //         const ctx = { id: illustration.id }
  //         api.recentResource({ project_id: illustration.id, resource_id: ctx.id })
  //       }
  //     } catch {}
  //   },
  //   [editor, user, projectSelect, illustration]
  // )

  const ValidateIcon = () => {
    if (like) {
      return <LikeClick size={20} />
    } else {
      return <Like size={20} />
    }
  }

  return (
    <Flex
      onDragStart={(e) => {
        makeDragObject(e, illustration)
      }}
      draggable={true}
      sx={{
        maxHeight: "180px",
        minHeight: "134px",
        flexDirection: "column"
      }}
    >
      <ModalIllustration
        isOpen={isOpen}
        onClose={onClose}
        type={type}
        typeFilter={typeFilter}
        listFavorite={listFavorite}
      />
      <Flex flex={1} overflow={"hidden"} _hover={{ cursor: "pointer" }} justifyContent={"center"}>
        <Flex
          onClick={() => OpenModalIllustration("tag", illustration)}
          zIndex={5}
          visibility={isHovering ? "visible" : "hidden"}
          position="absolute"
          marginLeft="35%"
          _hover={{ cursor: "pointer", bg: "brand.500" }}
          color="#545465"
          border="1px"
          borderRadius="10px"
        >
          <FilterByTags size={30} />
        </Flex>
        <Flex
          opacity={isHovering ? "0.2" : "1"}
          w="full"
          h="full"
          onClick={addObject}
          sx={{
            border: "1px",
            borderColor: "#e2e8f0",
            padding: "2px"
          }}
          _hover={{ borderColor: "#5456F5" }}
        >
          <LazyLoadImage url={illustration.preview} />
        </Flex>
      </Flex>
      {illustration?.drawifier?.name ? (
        <Flex
          sx={{
            justifyContent: "space-between",
            height: "40px",
            alignItems: "center"
          }}
        >
          <Flex
            sx={{
              justifyContent: "space-between",
              width: "100%"
            }}
          >
            <Flex gap="5px" alignItems="center">
              <Avatar size={"xs"} name={illustration?.drawifier?.name} src={illustration?.drawifier?.avatar} />
              <Box sx={{ fontSize: "12px" }}>{splitName(illustration?.drawifier?.name)[0]}</Box>
            </Flex>
            <Center gap={"0.25rem"}>
              {illustration.license === "paid" && (
                <Center boxSize="21px" sx={{ background: "#F6D056", color: "#FFFFFF", borderRadius: "4px" }}>
                  <Pro size={40} />
                </Center>
              )}
              {user && (
                <Center
                  onClick={() => {
                    makeFavorite(illustration)
                    setLike(!like)
                  }}
                  _hover={{ cursor: "pointer" }}
                  boxSize="21px"
                >
                  <ValidateIcon />
                </Center>
              )}
            </Center>
          </Flex>
        </Flex>
      ) : (
        <Flex position="absolute">
          <Center
            margin="5px"
            position="absolute"
            boxSize="21px"
            sx={{ background: "#F6D056", color: "#FFFFFF", borderRadius: "4px" }}
          >
            <Pro size={40} />
          </Center>
          <Flex
            marginTop="115px"
            marginLeft="5px"
            position="absolute"
            boxSize="21px"
            _hover={{ cursor: "pointer" }}
            onClick={() => {
              makeFavorite(illustration)
              setLike(!like)
            }}
          >
            <ValidateIcon />
          </Flex>
        </Flex>
      )}
    </Flex>
  )
}

function ModalIllustration({
  isOpen,
  onClose,
  type,
  typeFilter,
  listFavorite
}: {
  isOpen: boolean
  onClose: () => void
  type: string
  typeFilter: any
  listFavorite: IResource[]
}) {
  const { setInputActive } = useDesignEditorContext()
  const [like, setLike] = React.useState(false)
  const user = useSelector(selectUser)
  const editor = useEditor()
  const activeScene = useActiveScene()
  const [resources, setResources] = useState<IResource[]>([])
  const [load, setLoad] = useState(false)
  const [sort, setSort] = useState<string>("USED_AT")
  const [idDrawifier, setIdDrawifier] = useState<string>("")
  const initialFocusRef = useRef<any>()
  const refInputName = useRef<any>()
  const [name, setName] = useState<string>("")
  const { isOpen: isOpenDrawifier, onOpen: onOpenDrawifier, onClose: onCloseDrawifier } = useDisclosure()
  const drawifiers = useSelector(selectListDrawifiers)
  const [resourcesPrev, setResourcesPrev] = useState<IResource[]>([])
  const [nameResource, setNameResource] = useState<string>("")
  const projectSelect = useSelector(selectProject)
  const activeObject = useActiveObject()

  useEffect(() => {
    setSort("USED_AT")
    initialState()
    setIdDrawifier("")
  }, [isOpen])

  useEffect(() => {
    name === "" && onCloseDrawifier()
    name === "" && setIdDrawifier("")
  }, [name])

  const initialState = useCallback(async () => {
    if (isOpen) {
      setLoad(false)
      const resolve: any[] = await api.searchResources({
        page: 1,
        limit: 10,
        query: {
          drawifier_ids:
            type === "id" ? [Number(typeFilter.drawifier.id)] : idDrawifier !== "" ? [idDrawifier] : undefined,
          tags: type === "tag" ? typeFilter.tags : undefined
        },
        sorts: [sort]
      })
      setResourcesPrev(resolve)
      setResources(resolve)
      setLoad(true)
    }
  }, [resources, isOpen, sort, idDrawifier, typeFilter, type])

  const makeFilter = useCallback(() => {
    setNameResource("")
    initialState()
  }, [listFavorite, resources, resourcesPrev, typeFilter, type, idDrawifier, sort])

  const addObject = useCallback(
    async (resource: IResource) => {
      if (user) {
        const ctx = { id: resource.id }
        api.recentResource({ project_id: projectSelect.id, resource_id: ctx.id })
      }
      const options: any = {
        type: "StaticVector",
        name: "Illustration",
        src: `${resource.url}?${Math.random().toString(36).substring(2, 10)}`,
        erasable: false,
        watermark: resource.license === "paid" ? user.plan !== "HERO" && watermarkURL : null
      }
      if (editor) {
        await activeScene.objects.add(options, { desiredSize: 200 })
      }
    },
    [activeScene, editor, activeObject, projectSelect, user]
  )

  const filterByName = useCallback(
    async (e: string) => {
      setLoad(false)
      setNameResource(e)
      const resolve: any[] = await api.searchResources({
        page: 1,
        limit: 10,
        query: {
          drawifier_ids:
            type === "id" ? [Number(typeFilter.drawifier.id)] : idDrawifier !== "" ? [idDrawifier] : undefined,
          tags: type === "tag" ? typeFilter.tags : undefined,
          names: [e]
        },
        sorts: [sort]
      })
      setResources(resolve)
      setLoad(true)
    },
    [resourcesPrev, resources]
  )

  return (
    <Modal isOpen={isOpen} size={"full"} onClose={onClose}>
      <ModalContent
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          WebkitBackdropFilter: "blur(5px)",
          backdropFilter: "blur(5px)"
        }}
      >
        <ModalCloseButton />
        <ModalBody>
          <Flex gap="10px" border="1px solid #DDDFE5" flexDir="column" bg="white" padding="20px">
            <Center>
              <Input
                w="40%"
                ref={refInputName}
                value={nameResource}
                onChange={(e) => setNameResource(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && refInputName.current.blur()}
                onBlur={(e) => {
                  setInputActive(false)
                  filterByName(nameResource)
                }}
                onFocus={() => setInputActive(true)}
                placeholder="Search"
                bg="white"
              />
            </Center>
            <Center gap="10px">
              <Text color="#A9A9B2" fontSize="sm">
                FILTER BY STATS
              </Text>
              <RadioGroup onChange={setSort} value={sort}>
                <Stack direction="row" gap="10px">
                  <Radio size="sm" value="ALPHABETIC">
                    A - Z
                  </Radio>
                  <Radio size="sm" value="USED_AT">
                    Most Recent
                  </Radio>
                  <Radio size="sm" value="LIKED">
                    Most Favorite
                  </Radio>
                  <Radio size="sm" value="DOWNLOADED">
                    Most Downloads
                  </Radio>
                </Stack>
              </RadioGroup>
              <Text
                visibility={type === "tag" ? "visible" : "hidden"}
                position={type !== "tag" ? "absolute" : "relative"}
                color="#A9A9B2"
                fontSize="sm"
              >
                FILTER BY DRAWIFIER
              </Text>
              <Popover
                initialFocusRef={initialFocusRef}
                isOpen={isOpenDrawifier}
                returnFocusOnClose={false}
                onClose={onCloseDrawifier}
                placement="right-start"
              >
                <HStack>
                  <PopoverAnchor>
                    <Input
                      ref={initialFocusRef}
                      position={type !== "tag" ? "absolute" : "relative"}
                      visibility={type === "tag" ? "visible" : "hidden"}
                      placeholder="Start typing..."
                      value={name}
                      onFocus={() => {
                        setName("")
                        setInputActive(true)
                        setIdDrawifier("")
                      }}
                      onBlur={() => {
                        onCloseDrawifier()
                        setInputActive(false)
                      }}
                      onKeyDown={(e) => e.key === "Enter" && initialFocusRef.current.blur()}
                      onChange={(e) => {
                        onOpenDrawifier()
                        setName(e.target.value)
                      }}
                      zIndex={999}
                    ></Input>
                  </PopoverAnchor>
                </HStack>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody>
                    <FilterByDrawifier
                      setId={setIdDrawifier}
                      onClose={onCloseDrawifier}
                      listDrawifiers={drawifiers}
                      setName={setName}
                      name={name}
                    />
                  </PopoverBody>
                </PopoverContent>
              </Popover>
              <Button
                marginInline="10px"
                variant="outline"
                size="sm"
                bg="white"
                _hover={{ bg: "white" }}
                onClick={makeFilter}
              >
                Filter
              </Button>
            </Center>

            {load ? (
              <Box
                w="full"
                h="full"
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: "2rem", paddingY: "0.5rem" }}
              >
                {resources.map((e, index) => (
                  <Flex
                    flexDir="column"
                    border="1px solid #DDDFE5"
                    boxShadow="rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"
                    key={index}
                  >
                    <Flex
                      maxH="full"
                      minH="300px"
                      w="full"
                      onClick={() => {
                        addObject(e)
                        onClose()
                      }}
                      _hover={{ cursor: "pointer" }}
                    >
                      <LazyLoadImage url={e.preview} />
                    </Flex>
                    <Flex
                      marginInline="10px"
                      sx={{
                        justifyContent: "space-between",
                        height: "40px",
                        alignItems: "center"
                      }}
                    >
                      <Flex gap="5px" alignItems="center">
                        <Avatar size={"xs"} name={e.drawifier.name} src={e.drawifier.avatar} />
                        <Box sx={{ fontSize: "12px" }}>{limitCharacters(e.drawifier.name)}</Box>
                      </Flex>
                      <Center gap={"0.25rem"}>
                        {e.license === "paid" && (
                          <Center boxSize="21px" sx={{ background: "#F6D056", color: "#FFFFFF", borderRadius: "4px" }}>
                            <Pro size={40} />
                          </Center>
                        )}
                      </Center>
                    </Flex>
                  </Flex>
                ))}
              </Box>
            ) : (
              <Center h="500px">
                <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="#5456f5" size="xl" />
              </Center>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
