import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
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
import { useActiveScene, useDesign, useZoomRatio } from "@layerhub-pro/react"
import React, { useCallback, useRef, useState } from "react"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import * as api from "~/services/api"
import lodash from "lodash"
import Search from "~/components/Icons/Search"
import Pro from "~/components/Icons/Pro"
import LikeClick from "~/components/Icons/LikeClick"
import Like from "~/components/Icons/Like"
import { useAppDispatch, useAppSelector } from "~/store/store"
import { selectUser } from "~/store/user/selector"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import HorizontalScroll from "~/utils/HorizontaScroll"
import Scrollable from "~/components/Scrollable/Scrollable"
import InfiniteScroll from "~/utils/InfiniteScroll"
import { IDesign, IResolveRecommend } from "~/interfaces/editor"
import { selectListTemplates } from "~/store/templates/selector"
import { getListFavoriteTemplates, getListPublicTemplates, makeFavoriteTemplate } from "~/store/templates/action"
import { selectListRecommendTemplate } from "~/store/recommend/selector"
import { getListRecommend } from "~/store/recommend/action"
import Order from "../../../../Modals/Order"
import LazyLoadImage from "~/utils/LazyLoadImage"
import { selectProject } from "~/store/project/selector"
import useResourcesContext from "~/hooks/useResourcesContext"
import { loadGraphicTemplate } from "~/utils/fonts"
import ModalUpgradePlan from "../../../../Modals/UpgradePlan"
import { generateEmptyDesign } from "~/constants/consts"
import { updateProject } from "~/store/project/action"
import { useParams } from "react-router-dom"

export default function Template() {
  const { setLoadCanva, loadCanva, setPreviewCanva, setDimensionZoom } = useResourcesContext()
  const zoomRatio = useZoomRatio()
  const { setInputActive } = useDesignEditorContext()
  const dispatch = useAppDispatch()
  const initialFocusRef = useRef<any>()
  const [validateContent, setValidateContent] = useState<string | null>(null)
  let [nameTemplate, setNameTemplate] = useState<string[]>([""])
  let [nameTemplatePrev, setNameTemplatePrev] = useState<string[]>([""])
  const [order, setOrder] = useState<string[]>(["ALPHABETIC"])
  const user = useAppSelector(selectUser)
  const { isOpen: isOpenLoadTemplate, onOpen: onOpenLoadTemplate, onClose: onCloseLoadTemplate } = useDisclosure()
  const { isOpen: isOpenUpgradeUser, onOpen: onOpenUpgradeUser, onClose: onCloseUpgradeUser } = useDisclosure()
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
  const [loadMoreResources, setLoadMoreResources] = useState<boolean>(false)
  const [toolTip, setToolTip] = useState(false)
  const design = useDesign()
  const [loadTemplate, setLoadTemplate] = useState<any>()
  const activeScene = useActiveScene()
  const projectSelector = useSelector(selectProject)
  const [loadModal, setLoadModal] = useState<boolean>(false)
  const toast = useToast()
  const { id } = useParams()
  const initialQuery = {
    page: 1,
    limit: 10,
    query: {
      plans: user?.plan === "FREE" ? ["FREE"] : user?.plan === "PRO" ? ["FREE", "PRO"] : undefined,
      is_published: true
    },
    sorts: ["LAST_UPDATE"]
  }

  useEffect(() => {
    loadCanva === true && setDimensionZoom(zoomRatio)
  }, [loadCanva])

  useEffect(() => {
    initialState()
  }, [user])

  useEffect(() => {
    if (resourcesTemplate.length === 0) {
      stateFavorite === true && setValidateContent("No favorite templates to display")
      stateRecent === true && setValidateContent("No recent template to display")
    }
  }, [resourcesTemplate])

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
      order[0] === "LAST_UPDATE"
    ) {
      let newQuery = initialQuery
      newQuery.page = resourcesTemplate.length / 10 + 1
      const resolve = (await (
        await dispatch(
          getListPublicTemplates({
            page: resourcesTemplate.length / 10 + 1,
            limit: 10,
            query: {
              plans: user?.plan === "FREE" ? ["FREE"] : user?.plan === "PRO" ? ["FREE", "PRO"] : undefined,
              is_published: true
            },
            sorts: ["LAST_UPDATE"]
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
          drawifier_ids: orderDrawifier[0] ? orderDrawifier : undefined,
          keywords:
            nameTemplate[0]?.length > 0
              ? nameTemplate[0] === "all" || nameTemplate[0] === "*"
                ? []
                : nameTemplate
              : undefined,
          plans: user?.plan === "FREE" ? ["FREE"] : user?.plan === "PRO" ? ["FREE", "PRO"] : undefined,
          favorited: stateFavorite === true ? true : undefined,
          used: stateRecent === true ? true : undefined,
          is_published: true
        },
        sorts: stateRecent ? ["USED_AT"] : order
      })
      if (resolve[0] === undefined && resourcesTemplate[0] === undefined) {
        stateFavorite === true
          ? setValidateContent("No favorite templates to display")
          : stateRecent === true
          ? setValidateContent("No recent templates to display")
          : setValidateContent("Nothing was found related to the filter entered")
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
        setLoadModal(false)
        onOpenLoadTemplate()
        if (user?.plan !== "FREE" || template.license !== "paid") {
          let designData: any = await api.getTemplateById(template.id)
          designData.frame.height = Number(designData.frame.height)
          designData.frame.width = Number(designData.frame.width)
          designData.scenes[0].frame = designData.frame
          setLoadTemplate({ designData, template })
          setLoadModal(true)
        } else {
          onOpenUpgradeUser()
        }
      } catch (err) {
        onCloseUpgradeUser()
        onCloseLoadTemplate()
      }
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

  const handleCustomize = useCallback(async () => {
    onCloseLoadTemplate()
    setLoadCanva(false)
    setPreviewCanva(loadTemplate?.designData?.preview)
    await loadGraphicTemplate(loadTemplate?.designData)
    await activeScene.setScene(loadTemplate?.designData.scenes[0])
    setPreviewCanva(null)
    activeScene.applyFit()
    setLoadCanva(true)
    if (user && projectSelector) {
      api.getUseTemplate({ project_id: projectSelector.id, template_id: loadTemplate?.template.id })
    } else if (user) {
      const emptyDesign = generateEmptyDesign({ width: 1920, height: 1080 })
      const resolve = await dispatch(updateProject({ ...emptyDesign, key: id }))
      api.getUseTemplate({ project_id: resolve?.payload.id, template_id: loadTemplate?.template.id })
    }
  }, [loadTemplate, projectSelector, user, activeScene, id])

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
    } else if (nameTemplatePrev[0] === "" || nameTemplatePrev[0] === "*") {
      if (
        nameTemplatePrev[0] === "" &&
        stateFavorite === false &&
        stateRecent === false &&
        orderDrawifier[0] === "" &&
        order[0] === undefined
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
    setInputActive(false)
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
      <ModalUpgradePlan
        type={"Template"}
        isOpen={isOpenUpgradeUser}
        onClose={onCloseUpgradeUser}
        onOpen={onOpenUpgradeUser}
      />
      <Modal size="4xl" isCentered onClose={onCloseLoadTemplate} isOpen={isOpenLoadTemplate}>
        <ModalOverlay />
        <ModalContent display="flex">
          {loadModal ? (
            <>
              <ModalHeader>OPEN A NEW TEMPLATE</ModalHeader>
              <ModalCloseButton />
              <ModalBody display="flex" marginBottom="10px">
                <Flex w="full" gap="20px">
                  <LazyLoadImage url={loadTemplate?.designData?.preview} />
                  <Flex w="full" flexDir="column" gap="15px">
                    <Flex align="center" gap="10px">
                      <Avatar src={loadTemplate?.template?.user?.avatar} name={loadTemplate?.template?.user?.name} />
                      <Flex fontWeight="bold">{loadTemplate?.template?.user?.name}</Flex>
                    </Flex>
                    <Flex fontWeight="bold" fontSize="23px">
                      {loadTemplate?.designData?.name}
                    </Flex>
                    <Flex>{loadTemplate?.designData?.description}</Flex>
                    <Button w="min-content" colorScheme="brand" onClick={handleCustomize}>
                      Customize this template
                    </Button>
                  </Flex>
                </Flex>
              </ModalBody>
            </>
          ) : (
            <Flex h="20vh" w="full" align="center" justify="center">
              <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="#5456f5" size="xl" />
            </Flex>
          )}
        </ModalContent>
      </Modal>
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
                  autoComplete="off"
                  spellCheck="false"
                  ref={initialFocusRef}
                  value={nameTemplatePrev}
                  placeholder="Search"
                  onFocus={() => {
                    onOpenInput()
                    setInputActive(true)
                  }}
                  onBlur={makeBlur}
                  onKeyDown={(e) => e.key === "Enter" && initialFocusRef.current.blur()}
                  onChange={(e) => makeChangeInput(e.target.value)}
                  sx={{
                    _focusVisible: {
                      boxShadow: "none"
                    }
                  }}
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
        {/* <IconButton aria-label="Search" variant="outline" icon={<Search size={18} />} /> */}
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
                w="126px"
                maxW="126px"
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
                setOrder(["LAST_UPDATE"])
                setOrderDrawifier([])
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
              Favorite
            </Tab>
          </TabList>
        </Tabs>
      </Box>
      <Flex w="full" h="full" flexDir="column">
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
                        >
                          <Flex
                            maxH="full"
                            minH="150px"
                            w="full"
                            border="1px solid #e2e8f0"
                            _hover={{ cursor: "pointer", border: "1px solid #5456F5" }}
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
                    visibility={more ? "visible" : "hidden"}
                    onClick={fetchDataResource}
                  >
                    Load More
                  </Button>
                </Flex>
              ) : (
                <Flex h="50%" w="full" align="end" justify="center">
                  <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="#5456f5" size="xl" />
                </Flex>
              )}
            </InfiniteScroll>
          </Scrollable>
        ) : (
          <Center flexDirection="column" h="full" w="full" textAlign="center" gap="20px">
            {stateFavorite === true ? (
              <img src={"https://drawify-images.s3.eu-west-3.amazonaws.com/editor/noTemplates.svg"} />
            ) : stateRecent === true ? (
              <img src={"https://drawify-images.s3.eu-west-3.amazonaws.com/editor/noTemplates.svg"} />
            ) : (
              <img src={"https://drawify-images.s3.eu-west-3.amazonaws.com/editor/noTemplates.svg"} />
            )}
            <p>{validateContent}</p>
          </Center>
        )}
      </Flex>
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

// function PopOverInput({
//   isOpen,
//   onClose,
//   refInput,
//   content,
//   setName
// }: {
//   isOpen: boolean
//   onClose: () => void
//   refInput: any
//   content: IResolveRecommend
//   setName: React.Dispatch<React.SetStateAction<string[]>>
// }) {
//   const makeFilterBySeggestion = (e: string) => {
//     setName([e])
//     onClose()
//   }

//   return (
//     <Popover initialFocusRef={refInput} isOpen={isOpen} returnFocusOnClose={false} onClose={onClose}>
//       <PopoverTrigger>
//         <Button visibility="hidden" position="absolute">
//           Trigger
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent>
//         <PopoverArrow />
//         <PopoverBody>
//           <Flex flexDir="column" fontSize="12px" gap="5px">
//             <Flex>
//               <Text>Recent searches</Text>
//               <Spacer />
//               <Text>Erase</Text>
//             </Flex>
//             <Flex></Flex>
//             <Flex>Suggestion</Flex>
//             {content?.words.map(
//               (obj, index) =>
//                 index <= 6 && (
//                   <Button
//                     size="xs"
//                     justifyItems="left"
//                     justifyContent="left"
//                     leftIcon={<Search size={15} />}
//                     variant="ghost"
//                     w="full"
//                     key={index}
//                     onClick={() => makeFilterBySeggestion(obj)}
//                   >
//                     {obj}
//                   </Button>
//                 )
//             )}
//           </Flex>
//         </PopoverBody>
//       </PopoverContent>
//     </Popover>
//   )
// }
