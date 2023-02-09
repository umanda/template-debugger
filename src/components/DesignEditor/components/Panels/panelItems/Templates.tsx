import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  IconButton,
  Input,
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast
} from "@chakra-ui/react"
import { Tabs, TabList, Tab } from "@chakra-ui/react"
import { useActiveScene, useDesign, useObjects } from "@layerhub-pro/react"
import React, { useCallback, useRef, useState } from "react"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import * as api from "../../../../services/api"
import lodash from "lodash"
import Search from "../../../../Icons/Search"
import Pro from "../../../../Icons/Pro"
import LikeClick from "../../../../Icons/LikeClick"
import Like from "../../../../Icons/Like"
import { useAppDispatch, useAppSelector } from "../../../../store/store"
import { selectUser } from "../../../../store/user/selector"
import useDesignEditorContext from "../../../../hooks/useDesignEditorContext"
import HorizontalScroll from "../../../../utils/HorizontaScroll"
import Scrollable from "../../../../utils/Scrollable"
import InfiniteScroll from "../../../../utils/InfiniteScroll"
import { IDesign, IResolveRecommend } from "../../../../interfaces/editor"
import { selectListTemplates } from "../../../../store/templates/selector"
import {
  getListFavoriteTemplates,
  getListPublicTemplates,
  makeFavoriteTemplate
} from "../../../../store/templates/action"
import { selectListRecommendTemplate } from "../../../../store/recommend/selector"
import { getListRecommend } from "../../../../store/recommend/action"
import Order from "../../../../Modals/Order"
import LazyLoadImage from "../../../../utils/LazyLoadImage"
import { useParams } from "react-router-dom"
import { selectProject } from "../../../../store/project/selector"

const initialQuery = {
  page: 1,
  limit: 10,
  query: {
    visibility: "public"
  },
  sorts: []
}

export default function Template() {
  const dispatch = useAppDispatch()
  const initialFocusRef = useRef<any>()
  const [validateContent, setValidateContent] = useState<string | null>(null)
  let [nameTemplate, setNameTemplate] = useState<string[]>([""])
  let [nameTemplatePrev, setNameTemplatePrev] = useState<string[]>([""])
  const [order, setOrder] = useState<string[]>(["ALPHABETIC"])
  const user = useAppSelector(selectUser)
  const { isOpen: isOpenInput, onOpen: onOpenInput, onClose: onCloseInput } = useDisclosure()
  const [resourcesTemplate, setResourcesTemplate] = useState<any[]>([])
  const [load, setLoad] = useState(false)
  const [more, setMore] = useState(true)
  const selectListTemplate = useAppSelector(selectListTemplates).template
  const selectListFavoriteTemplates = useAppSelector(selectListTemplates).favorited
  let [stateFavorite, setStateFavorite] = useState<boolean>(false)
  let [stateRecent, setStateRecent] = useState<boolean>(false)
  const [orderDrawifier, setOrderDrawifier] = useState<string[]>([""])
  const [disableTab, setDisableTab] = useState<boolean>(false)
  const defaultRecommend = useSelector(selectListRecommendTemplate)
  const [listRecommend, setListRecommend] = useState<IResolveRecommend>({ words: [] })
  const [contentInput, setContentInput] = useState<IResolveRecommend>(defaultRecommend)
  const { setDesignEditorLoading } = useDesignEditorContext()
  const [loadMoreResources, setLoadMoreResources] = useState<boolean>(false)
  const [toolTip, setToolTip] = useState(false)
  const design = useDesign()
  const activeScene = useActiveScene()
  const projectSelector = useSelector(selectProject)
  const toast = useToast()
  const objects: any = useObjects()

  useEffect(() => {
    initialState()
  }, [user])

  const initialState = useCallback(async () => {
    setMore(false)
    if (defaultRecommend?.words[0] === undefined) {
      const resolve = (await dispatch(getListRecommend({ index: "TEMPLATE", words: [] }))).payload as IResolveRecommend
      setContentInput(resolve)
    }
    if (selectListTemplate[0] === undefined) {
      const resolve = (await dispatch(getListPublicTemplates(initialQuery))).payload as IDesign[]
      resolve && setResourcesTemplate(resolve)
    } else {
      setResourcesTemplate(selectListTemplate)
    }

    if (user) {
      dispatch(getListFavoriteTemplates({ query: { favorited: true } }))
    }
    setMore(true)
    setLoad(true)
    setDisableTab(false)
  }, [selectListFavoriteTemplates, user, defaultRecommend])

  const fetchDataResource = async () => {
    setMore(false)
    setLoadMoreResources(true)
    if (
      nameTemplate[0] === "" &&
      stateFavorite === false &&
      stateRecent === false &&
      orderDrawifier[0] === "" &&
      order[0] === null
    ) {
      let newQuery = initialQuery
      newQuery.page = resourcesTemplate.length / 10 + 1
      const resolve = (await (
        await dispatch(
          getListPublicTemplates({
            page: resourcesTemplate.length / 10 + 1,
            limit: 10,
            query: {
              visibility: "public"
            },
            sorts: []
          })
        )
      ).payload) as IDesign[]
      setResourcesTemplate(resourcesTemplate.concat(resolve))
      resolve[0] === undefined ? setMore(false) : resolve[9] === undefined ? setMore(false) : setMore(true)
    } else {
      const resolve: any[] = await api.getListPublicTemplates({
        page: resourcesTemplate.length / 10 + 1,
        limit: 10,
        query: {
          drawifier_ids: orderDrawifier[0]?.length > 0 ? orderDrawifier : undefined,
          names: nameTemplate[0]?.length > 0 ? nameTemplate : undefined,
          visibility: "public",
          favorited: stateFavorite ? true : undefined,
          used: stateRecent ? true : undefined
        },
        sorts: order
      })
      if (resolve[0] === undefined && resourcesTemplate[0] === undefined) {
        setValidateContent("Nothing was found related to the filter entered")
      } else {
        setValidateContent(null)
      }
      resolve.map((obj) => {
        resourcesTemplate.find((template) => {
          obj.id === template.id && setMore(false)
        })
      })
      const validateResources = lodash.uniqBy(resourcesTemplate.concat(resolve), "id")
      setResourcesTemplate(validateResources)
      resolve[0] === undefined ? setMore(false) : resolve[9] === undefined ? setMore(false) : setMore(true)
    }
    setLoad(true)
    setDisableTab(false)
    setLoadMoreResources(false)
  }

  const loadTemplateById = React.useCallback(
    async (template: any) => {
      try {
        // if (user?.plan !== "FREE") {
        // @ts-ignore
        setDesignEditorLoading({ isLoading: true, preview: template.preview })
        // user && api.getUseTemplate({ template_id: template.id, project_id: projectSelector.id })
        let designData: any = await api.getTemplateById(template.id)
        designData.scenes[0].frame = designData.frame
        designData.scenes[0].layers.map((layer) => {
          if (layer.src) {
            if (layer.src.includes("https://segregate-drawify-images.s3.eu-west-3.amazonaws.com/"))
              layer.src = layer.src.replace(
                "https://segregate-drawify-images.s3.eu-west-3.amazonaws.com/",
                "https://ik.imagekit.io/jwzv5rwz9/drawify/"
              )
          }
          if (template?.license === "paid" && user?.plan !== "FREE" && layer.type === "StaticVector") {
            layer.watermark = "https://ik.imagekit.io/scenify/drawify-small.svg"
          }
        })
        await activeScene.setScene(designData.scenes[0])

        // console.log(activeScene.layers)
        // activeScene.objects.update({ watermark: "https://ik.imagekit.io/scenify/drawify-small.svg" })

        // } else {
        //   toast({
        //     title: "Subscribe to use this feature.",
        //     position: "top",
        //     isClosable: true
        //   })
        // }
      } catch (err) {}
    },
    [design, activeScene, projectSelector, user, toast]
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
    setMore(true)
    setLoad(false)
    setDisableTab(false)

    if (input) {
      setNameTemplate(input)
      setResourcesTemplate([])
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
        setResourcesTemplate(selectListTemplate)
      } else {
        setResourcesTemplate([])
      }
    } catch {
      setResourcesTemplate([])
    }
    setDisableTab(true)
    setValidateContent(null)
  }

  const makeChangeInput = useCallback(async (valueInput: string) => {
    setNameTemplatePrev([valueInput])
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

  const makeBlur = () => {
    if (nameTemplatePrev[0]?.length > 2) {
      nameTemplatePrev[0] !== nameTemplate[0] && makeFilter({ input: nameTemplatePrev })
      setDisableTab(false)
    } else if (nameTemplatePrev[0] === "") {
      if (
        nameTemplatePrev[0] === "" &&
        stateFavorite === false &&
        stateRecent === false &&
        orderDrawifier[0] === "" &&
        order[0] === "ALPHABETIC"
      ) {
        setResourcesTemplate(selectListTemplate)
        setListRecommend({ words: [] })
        setContentInput(defaultRecommend)
        setNameTemplatePrev([""])
        setNameTemplate([""])
      } else {
        nameTemplate[0] !== nameTemplatePrev[0] && makeFilter({ input: [""] })
        nameTemplate[0] !== nameTemplatePrev[0] && setResourcesTemplate([])
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
  }

  const makeFilterBySeggestion = useCallback((e: string) => {
    setNameTemplatePrev([e])
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
                  value={nameTemplatePrev}
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
          setResources={setResourcesTemplate}
          setSkeleton={setLoad}
          setOrder={setOrder}
          setDrawifier={setOrderDrawifier}
          order={order}
          drawifier={orderDrawifier}
        />
      </Flex>
      <Box>
        <HorizontalScroll>
          {listRecommend?.words.map((obj, index) => (
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
                setResourcesTemplate([])
                setNameTemplatePrev([""])
                setNameTemplate([""])
                setStateFavorite(false)
                setStateRecent(false)
                setValidateContent(null)
                setMore(false)
                setOrder(["ALPHABETIC"])
                setOrderDrawifier([""])
                initialState()
                setListRecommend({ words: [] })
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
              <Flex flexDir="column">
                <Box display="grid" gridTemplateColumns="1fr" padding="0.5rem">
                  {resourcesTemplate.map((template: any, index) => {
                    return (
                      <Box
                        paddingTop={"5px"}
                        borderRadius={"2px"}
                        marginBottom={"10px"}
                        alignItems={"center"}
                        display={"flex"}
                        flexDirection="column"
                        key={index}
                        _hover={{
                          border: "3px solid #5456F5"
                        }}
                      >
                        <Flex
                          maxH="full"
                          minH="150px"
                          w="full"
                          border="1px solid #d0d0d0"
                          _hover={{ cursor: "pointer" }}
                          onClick={() => loadTemplateById(template)}
                        >
                          {/* @ts-ignore */}
                          <LazyLoadImage url={template.preview} />
                        </Flex>
                        <Flex fontSize={"12px"} align="center" flexDirection={"row"} w="100%" padding="3px">
                          <Text color="#545465" fontWeight={400}>
                            {template.name}
                          </Text>
                          <Spacer />
                          {template.license === "paid" && (
                            <Center bg="#F6D056" color="white" borderRadius="4px" boxSize="21px">
                              <Pro size={20} />
                            </Center>
                          )}
                          {user && (
                            <IconButtonLike
                              listFavorite={selectListFavoriteTemplates}
                              template={template}
                              setListTemplates={setResourcesTemplate}
                              listTemplates={resourcesTemplate}
                              stateFavorite={stateFavorite}
                            />
                          )}
                        </Flex>
                      </Box>
                    )
                  })}
                </Box>
                <Button
                  w="full"
                  variant="outline"
                  isLoading={loadMoreResources}
                  isDisabled={!more}
                  onClick={fetchDataResource}
                >
                  {more ? "Load more resources?" : "There are no more resources"}
                </Button>
              </Flex>
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

function IconButtonLike({
  template,
  listFavorite,
  listTemplates,
  setListTemplates,
  stateFavorite
}: {
  template: any
  listFavorite: any[]
  listTemplates: any[]
  setListTemplates: React.Dispatch<React.SetStateAction<any[]>>
  stateFavorite: boolean
}) {
  const [state, setState] = React.useState<boolean>(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    listFavorite.find((resource) => resource.id === template.id) ? setState(true) : setState(false)
  }, [template, listFavorite])

  const ValidateLike = () => {
    if (state) {
      return <LikeClick size={20} />
    } else {
      return <Like size={20} />
    }
  }

  const handleClickFavorite = async () => {
    setState(!state)
    stateFavorite && setListTemplates(listTemplates.filter((obj) => obj.id !== template.id))
    dispatch(makeFavoriteTemplate(template))
  }

  return (
    <>
      <IconButton
        variant={"ghost"}
        aria-label="Like"
        size={"xs"}
        onClick={handleClickFavorite}
        icon={<ValidateLike />}
      />
    </>
  )
}

function PopOverInput({
  isOpen,
  onClose,
  refInput,
  content,
  setName
}: {
  isOpen: boolean
  onClose: () => void
  refInput: any
  content: IResolveRecommend
  setName: React.Dispatch<React.SetStateAction<string[]>>
}) {
  const makeFilterBySeggestion = (e: string) => {
    setName([e])
    onClose()
  }

  return (
    <Popover initialFocusRef={refInput} isOpen={isOpen} returnFocusOnClose={false} onClose={onClose}>
      <PopoverTrigger>
        <Button visibility="hidden" position="absolute">
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
            <Flex>Suggestion</Flex>
            {content?.words.map(
              (obj, index) =>
                index <= 6 && (
                  <Button
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
  )
}
