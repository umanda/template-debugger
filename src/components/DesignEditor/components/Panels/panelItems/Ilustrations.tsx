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
  Spacer,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useDisclosure
} from "@chakra-ui/react"
import { Tabs, TabList, Tab } from "@chakra-ui/react"
import { useActiveObject, useActiveScene, useEditor } from "@layerhub-pro/react"
import { useState } from "react"
import { useSelector } from "react-redux"
import * as api from "../../../../services/api"
import { useEffect } from "react"
import lodash from "lodash"
import { IResolveRecommend, IResource } from "../../../../interfaces/editor"
import { useAppDispatch } from "../../../../store/store"
import { selectListDrawifiers, selectUser } from "../../../../store/user/selector"
import { selectListRecommendResource } from "../../../../store/recommend/selector"
import Order, { FilterByDrawifier } from "../../../../Modals/Order"
import HorizontalScroll from "../../../../utils/HorizontaScroll"
import Scrollable from "../../../../utils/Scrollable"
import InfiniteScroll from "../../../../utils/InfiniteScroll"
import LikeClick from "../../../../Icons/LikeClick"
import Like from "../../../../Icons/Like"
import LazyLoadImage from "../../../../utils/LazyLoadImage"
import { getListRecommend } from "../../../../store/recommend/action"
import useResourcesContext from "../../../../hooks/useResourcesContext"
import Search from "../../../../Icons/Search"
import Pro from "../../../../Icons/Pro"
import FilterByTemplates from "../../../../Icons/FilterByTemplates"
import FilterByTags from "../../../../Icons/FilterByTags"
import { selectResourceImages } from "../../../../store/resources/selector"
import { getFavoritedResources, getListResourcesImages, makeFavoriteResource } from "../../../../store/resources/action"
import { useParams } from "react-router-dom"
import { selectProject } from "../../../../store/project/selector"

export const limitCharacters = (name: string) => {
  const newName = name?.substring(0, 15)
  if (name?.length > 15) {
    return `${newName}.`
  } else {
    return newName
  }
}

const initialQuery = {
  page: 0,
  limit: 10,
  query: {
    ids: [],
    drawifier_ids: [],
    names: [],
    suggested: [],
    categories: [],
    colors: [],
    tags: [""],
    visibility: "public",
    styles: [],
    favorited: false,
    used: false
  },
  sorts: ["ALPHABETIC"]
}

export default function Ilustrations() {
  const { setResourceDrag } = useResourcesContext()
  const dispatch: any = useAppDispatch()
  const initialFocusRef = useRef<any>()
  const [validateContent, setValidateContent] = useState<string | null>(null)
  let [nameIllustration, setNameIllustration] = useState<string[]>([""])
  let [nameIllustrationPrev, setNameIllustrationPrev] = useState<string[]>([""])
  const editor = useEditor()
  const [order, setOrder] = useState<string[]>(["ALPHABETIC"])
  const user = useSelector(selectUser)
  const { isOpen: isOpenInput, onOpen: onOpenInput, onClose: onCloseInput } = useDisclosure()
  const [resourcesIllustration, setResourcesIllustration] = useState<any[]>([])
  const [load, setLoad] = useState(false)
  const [more, setMore] = useState(true)
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

  useEffect(() => {
    initialState()
  }, [user])

  const initialState = useCallback(async () => {
    setMore(false)
    if (defaultRecommend.words[0] === undefined) {
      const resolve = (await dispatch(getListRecommend({ index: "RESOURCE", categories: ["IMAGE"], words: [] })))
        .payload as IResolveRecommend
      setContentInput(resolve)
    }
    if (selectListResources[0] === undefined) {
      const resolve = (await dispatch(getListResourcesImages(initialQuery))).payload as IResource[]
      resolve && setResourcesIllustration(resolve)
      resolve ? setMore(true) : setMore(false)
    } else {
      setResourcesIllustration(selectListResources)
      setMore(true)
    }
    if (user) {
      dispatch(getFavoritedResources({ query: { favorited: true } }))
    }
    setLoad(true)
    setDisableTab(false)
  }, [selectListResources])

  const fetchDataResource = async () => {
    setMore(false)
    setLoadMoreResources(true)
    if (
      nameIllustration[0] === "" &&
      stateFavorite === false &&
      stateRecent === false &&
      orderDrawifier[0] === "" &&
      order[0] === "ALPHABETIC"
    ) {
      let newQuery = initialQuery
      newQuery.page = selectListResources.length / 10 + 1
      const resolve = (await (await dispatch(getListResourcesImages(newQuery))).payload) as IResource[]
      setResourcesIllustration(selectListResources.concat(resolve))
      resolve[0] !== undefined && setMore(true)
    } else {
      const resolve: any[] = await api.searchResources({
        page: page,
        limit: 10,
        query: {
          drawifier_ids: orderDrawifier[0]?.length > 0 ? orderDrawifier : undefined,
          visibility: "public",
          keywords: nameIllustration[0] === "" ? undefined : nameIllustration,
          categories: [],
          favorited: stateFavorite ? true : undefined,
          used: stateRecent ? true : undefined
        },
        sorts: order
      })
      if (resolve[0] === undefined && resourcesIllustration[0] === undefined) {
        setValidateContent("Nothing was found related to the filter entered")
      } else {
        setValidateContent(null)
      }
      setPage(page + 1)
      resolve[0] !== undefined ? setMore(true) : setMore(false)
      resolve.map((obj) => {
        resourcesIllustration.find((resource) => {
          obj.id === resource.id && setMore(false)
        })
      })
      if (nameIllustration[0] !== "") {
        resolve.sort((a, b) => b.count_drawings - a.count_drawings)
        const validateResources = lodash.uniqBy(resourcesIllustration.concat(resolve), "drawifierId")
        setResourcesIllustration(validateResources)
      } else {
        const validateResources = lodash.uniqBy(resourcesIllustration.concat(resolve), "id")
        setResourcesIllustration(validateResources)
      }
    }
    setLoad(true)
    setLoadMoreResources(false)
    setDisableTab(false)
  }

  const addObject = useCallback(
    async (resource: IResource) => {
      try {
        if (user && projectSelect) {
          const ctx = { id: resource.id }
          api.recentResource({ project_id: projectSelect.id, resource_id: ctx.id })
        }
        const options = {
          type: "StaticVector",
          name: "Shape",
          src: resource.url,
          erasable: false,
          watermark:
            resource.license === "paid"
              ? user.plan !== "HERO" && "https://ik.imagekit.io/scenify/drawify-small.svg"
              : null
        }
        if (editor) {
          await editor.design.activeScene.objects.add(options, { desiredSize: 200 })
        }
      } catch (err) {}
    },
    [activeScene, editor, activeObject, projectSelect, user]
  )

  const onDragStart = React.useCallback(
    (ev: React.DragEvent<HTMLDivElement>, resource: any) => {
      setResourceDrag(resource)
      ev.dataTransfer.setData("resource", "image")
    },
    [activeScene, editor, setResourceDrag]
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
    if (nameIllustrationPrev[0]?.length > 2) {
      nameIllustrationPrev[0] !== nameIllustration[0] && makeFilter({ input: nameIllustrationPrev })
      setDisableTab(false)
    } else if (nameIllustrationPrev[0] === "") {
      if (
        nameIllustrationPrev[0] === "" &&
        stateFavorite === false &&
        stateRecent === false &&
        orderDrawifier[0] === undefined &&
        order[0] === "ALPHABETIC"
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

  return (
    <Box h="full" width="320px" borderRight="1px solid #ebebeb" padding="1rem 0" display="flex" flexDirection="column">
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
                  id="input"
                  ref={initialFocusRef}
                  value={nameIllustrationPrev}
                  placeholder="Search"
                  onFocus={onOpenInput}
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
                <Flex id="input">
                  <Text id="input">Recent searches</Text>
                  <Spacer id="input" />
                  <Text id="input">Erase</Text>
                </Flex>
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
              onClick={() => {
                setResourcesIllustration([])
                setNameIllustrationPrev([""])
                setNameIllustration([""])
                setStateFavorite(false)
                setStateRecent(false)
                setValidateContent(null)
                setMore(true)
                setOrder(["ALPHABETIC"])
                setOrderDrawifier([])
                initialState()
                setListRecommend({ words: [] })
                setPage(0)
              }}
            >
              All
            </Tab>
            <Tab
              isDisabled={disableTab}
              onClick={() => {
                stateFavorite = false
                user ? makeFilter({ stateRecents: true }) : setValidateContent("You need to login to see this panel.")
              }}
            >
              Recent
            </Tab>
            <Tab
              isDisabled={disableTab}
              onClick={() => {
                stateRecent = false
                user ? makeFilter({ stateFavorites: true }) : setValidateContent("You need to login to see this panel.")
              }}
            >
              Favorites
            </Tab>
          </TabList>
        </Tabs>
      </Box>
      {validateContent === null ? (
        <Scrollable autoHide={true}>
          <InfiniteScroll hasMore={more} fetchData={fetchDataResource}>
            {load ? (
              nameIllustration[0] !== "" ? (
                <Flex marginTop="20px" marginInline="20px" flexDir="column">
                  {resourcesIllustration.map((r, index) => (
                    <Flex flexDir="column" key={index} gap="5px" alignItems="center">
                      <Flex w="full">
                        <Avatar size="md" name={r?.drawifier_name} src={r?.avatar} />
                        <Center marginLeft="20px" flexDirection="column">
                          <Box sx={{ fontSize: "12px" }} fontWeight="bold">
                            {limitCharacters(r?.drawifier_name)}
                          </Box>
                          <Box sx={{ fontSize: "12px" }}>{`Found ${r?.count_drawings} drawings`}</Box>
                        </Center>
                      </Flex>
                      <Flex
                        h="1px"
                        w="full"
                        bg="linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5578606442577031) 27%, rgba(0,212,255,0) 100%)"
                      ></Flex>
                      <Grid gap="2px" templateColumns="repeat(2, 1fr)">
                        {r?.drawings.map(
                          (illustration, index) =>
                            illustration && (
                              <IllustrationItem
                                makeFavorite={makeFavorite}
                                onDragStart={onDragStart}
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
                  {/* <Box display="grid" gridTemplateColumns="1fr 1fr" gap="1rem" padding="1rem" w="full" h="full">
                    {resourcesIllustration.map(
                      (illustration, index) =>
                        illustration && (
                          <IllustrationItem
                            makeFavorite={makeFavorite}
                            onDragStart={onDragStart}
                            addObject={() => addObject(illustration)}
                            illustration={illustration}
                            key={index}
                            listFavorite={selectListFavoriteResources}
                          />
                        )
                    )}
                  </Box> */}

                  <Button
                    w="full"
                    variant="outline"
                    isLoading={loadMoreResources}
                    disabled={!more}
                    onClick={fetchDataResource}
                  >
                    {more ? "Load more resources?" : "There are no more resources"}
                  </Button>
                </Flex>
              ) : (
                <Flex flexDir="column">
                  <Box display="grid" gridTemplateColumns="1fr 1fr" gap="1rem" padding="1rem" w="full" h="full">
                    {resourcesIllustration.map(
                      (illustration, index) =>
                        illustration && (
                          <IllustrationItem
                            makeFavorite={makeFavorite}
                            onDragStart={onDragStart}
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
                    disabled={!more}
                    onClick={fetchDataResource}
                  >
                    {more ? "Load more resources?" : "There are no more resources"}
                  </Button>
                </Flex>
              )
            ) : (
              <Center h="40rem" w="full">
                <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="#5456f5" size="xl" />
              </Center>
            )}
          </InfiniteScroll>
        </Scrollable>
      ) : (
        <Center h="full" w="full" textAlign="center">
          {validateContent}
        </Center>
      )}
    </Box>
  )
}

function IllustrationItem({
  illustration,
  addObject,
  onDragStart,
  makeFavorite,
  listFavorite
}: {
  illustration: IResource
  addObject: () => void
  onDragStart: (a: any, b: any) => void
  makeFavorite: (obj: IResource) => void
  listFavorite: IResource[]
}) {
  const user = useSelector(selectUser)
  const [isHovering, setIsHovering] = React.useState(false)
  const [like, setLike] = React.useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [type, setType] = useState("")
  const [typeFilter, setTypeFilter] = useState<any>()

  useEffect(() => {
    listFavorite.find((resource) => resource.id === illustration.id) ? setLike(true) : setLike(false)
  }, [makeFavorite])

  const OpenModalIllustration = useCallback(async (type: string, illustration: IResource) => {
    setType(type)
    setTypeFilter(illustration)
    onOpen()
  }, [])

  const ValidateIcon = () => {
    if (like) {
      return <LikeClick size={20} />
    } else {
      return <Like size={20} />
    }
  }

  console.log(illustration.preview)

  return (
    <Flex
      sx={{
        height: "180px",
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
      <Flex
        flex={1}
        overflow={"hidden"}
        _hover={{ cursor: "pointer" }}
        justifyContent={"center"}
        onDragStart={(e) => onDragStart(e, illustration)}
        onMouseOver={() => setIsHovering(true)}
        onMouseOut={() => setIsHovering(false)}
      >
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
        {/* <Flex
          onClick={() => OpenModalIllustration("id", illustration)}
          zIndex={5}
          visibility={isHovering ? "visible" : "hidden"}
          position="absolute"
          marginLeft="35%"
          marginTop="12%"
          _hover={{ cursor: "pointer", bg: "brand.500" }}
          border="1px"
          borderRadius="10px"
          color="#545465"
        >
          <FilterByTemplates size={30} />
        </Flex> */}
        <Flex opacity={isHovering ? "0.2" : "1"} w="full" h="full" onClick={addObject}>
          <LazyLoadImage url={illustration.preview} />
        </Flex>
      </Flex>
      <Flex
        sx={{
          justifyContent: "space-between",
          height: "40px",
          alignItems: "center"
        }}
      >
        {illustration?.drawifier?.name && (
          <Flex>
            <Flex gap="5px" alignItems="center">
              <Avatar size={"xs"} name={illustration?.drawifier?.name} src={illustration?.drawifier?.avatar} />
              <Box sx={{ fontSize: "12px" }}>{limitCharacters(illustration?.drawifier?.name)}</Box>
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
        )}
      </Flex>
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
  const [like, setLike] = React.useState(false)
  const user = useSelector(selectUser)
  const editor = useEditor()
  const activeScene = useActiveScene()
  const [resources, setResources] = useState<IResource[]>([])
  const [load, setLoad] = useState(false)
  const [sort, setSort] = useState<string>("ALPHABETIC")
  const [idDrawifier, setIdDrawifier] = useState<string>("")
  const initialFocusRef = useRef<any>()
  const [name, setName] = useState<string>("")
  const { isOpen: isOpenDrawifier, onOpen: onOpenDrawifier, onClose: onCloseDrawifier } = useDisclosure()
  const drawifiers = useSelector(selectListDrawifiers)
  const [resourcesPrev, setResourcesPrev] = useState<IResource[]>([])
  const [nameResource, setNameResource] = useState<string>("")
  const projectSelect = useSelector(selectProject)
  const activeObject = useActiveObject()

  useEffect(() => {
    setSort("ALPHABETIC")
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
      const options = {
        type: "StaticVector",
        name: "Shape",
        src: resource.url,
        erasable: false,
        watermark:
          resource.license === "paid"
            ? user.plan !== "HERO" && "https://ik.imagekit.io/scenify/drawify-small.svg"
            : null
      }
      if (editor) {
        await activeScene.objects.add(options, { desiredSize: 200 })
      }
    },
    [activeScene, editor, activeObject, projectSelect, user]
  )

  const filterByName = useCallback(
    (e: string) => {
      setNameResource(e)
      setResources(resourcesPrev.filter((r) => r.name.includes(e)))
    },
    [resourcesPrev, resources]
  )

  const ValidateIcon = () => {
    if (like) {
      return <LikeClick size={20} />
    } else {
      return <Like size={20} />
    }
  }

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
          {load ? (
            <Flex gap="10px" border="1px solid #DDDFE5" flexDir="column" bg="white" padding="20px">
              <Center>
                <Input
                  w="40%"
                  value={nameResource}
                  onChange={(e) => {
                    filterByName(e.target.value)
                  }}
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
                          setIdDrawifier("")
                        }}
                        onBlur={onCloseDrawifier}
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
              <Box
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
            </Flex>
          ) : (
            <Center h="500px">
              <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="#5456f5" size="xl" />
            </Center>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
