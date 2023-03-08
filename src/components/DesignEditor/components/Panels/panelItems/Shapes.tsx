import React, { useCallback, useEffect, useState } from "react"
import { Box, Button, Center, Flex, Grid, Spinner } from "@chakra-ui/react"
import { useActiveObject, useActiveScene, useEditor } from "@layerhub-pro/react"
import { Tabs, TabList, Tab } from "@chakra-ui/react"
import Scrollable from "~/components/Scrollable/Scrollable"
import { useAppDispatch } from "~/store/store"
import * as api from "~/services/api"
import { IResource } from "~/interfaces/editor"
import InfiniteScroll from "~/utils/InfiniteScroll"
import { useSelector } from "react-redux"
import { selectUser } from "~/store/user/selector"
import lodash from "lodash"
import LazyLoadImage from "~/utils/LazyLoadImage"
import { getListResourcesShapes } from "~/store/resources/action"
import { selectResourceShapes } from "~/store/resources/selector"
import { selectProject } from "~/store/project/selector"
import NoShapesImage from "~/assets/images/no-shapes-to-display.svg"

const defaultPreviewTemplate = import.meta.env.VITE_APP_DEFAULT_URL_PREVIEW_TEMPLATE
const replacePreviewTemplate = import.meta.env.VITE_APP_REPLACE_URL_PREVIEW_TEMPLATE

const initialQuery = {
  page: 1,
  limit: 40,
  query: {
    used: false,
    favorited: false
  },
  sorts: ["ALPHABETIC"]
}

export default function Shapes() {
  const editor = useEditor()
  const [resources, setResources] = useState<IResource[]>([])
  const [fetching, setFetching] = React.useState(true)
  const dispatch = useAppDispatch()
  const user = useSelector(selectUser)
  const [load, setLoad] = useState(false)
  const selectShapes = useSelector(selectResourceShapes).resources
  const [type, setType] = useState({ filled: false, outlined: false })
  const [types, setTypes] = useState<string | undefined>()
  const [stateRecent, setStateRecent] = useState(false)
  const [disableTab, setDisableTab] = useState(false)
  const [loadMoreResources, setLoadMoreResources] = useState<boolean>(false)
  const [validateContent, setValidateContent] = useState<string | null>(null)
  const activeScene = useActiveScene()
  const projectSelect = useSelector(selectProject)
  const activeObject = useActiveObject()

  useEffect(() => {
    initialState()
  }, [user])

  const dragObject = useCallback(
    (e: React.DragEvent<HTMLDivElement>, resource: any) => {
      try {
        let img = new Image()
        img.src = resource.preview
        if (editor) {
          e.dataTransfer.setDragImage(img, img.width, img.height)
          editor.dragger.onDragStart(
            {
              type: "StaticVector",
              name: "Shape",
              erasable: false,
              // watermark: resource.license === "paid" ? user.plan !== "HERO" && watermarkURL : null,
              preview: resource.url,
              src: resource.url
            },
            { desiredSize: 300 }
          )
        }
        if (user && projectSelect.id) {
          const ctx = { id: resource.id }
          try {
            api.useShapes({ project_id: projectSelect.id, resource_id: ctx.id })
          } catch {}
        }
      } catch {}
    },
    [editor, user, projectSelect]
  )

  const initialState = useCallback(async () => {
    if (selectShapes[0] === undefined) {
      const resolve: any = (await dispatch(getListResourcesShapes(initialQuery))).payload
      resolve && setResources(resolve)
      resolve ? setFetching(false) : setFetching(true)
    } else {
      setResources(selectShapes)
      setFetching(false)
    }
    setLoad(true)
    setDisableTab(false)
  }, [resources])

  const fetchDataResource = async () => {
    setFetching(true)
    setLoadMoreResources(true)
    if (stateRecent === false && type.filled === false && type.outlined === false) {
      let newQuery = initialQuery
      newQuery.page = resources.length / 40 + 1
      const resolve = (await dispatch(getListResourcesShapes(newQuery))).payload as IResource[]
      setResources(resources.concat(resolve))
      resolve[0] === undefined ? setFetching(true) : setFetching(false)
    } else {
      const resolve: any[] = await api.resourceSearchShapes({
        page: resources.length / 40 + 1,
        limit: 40,
        query: {
          content: types,
          used: stateRecent
        }
      })
      if (resolve[0] === undefined && resources[0] === undefined) {
        stateRecent === true
          ? setValidateContent("No recent shapes to display")
          : setValidateContent("Nothing was found related to the filter entered")
      } else {
        setValidateContent(null)
      }
      resolve[0] === undefined ? setFetching(true) : setFetching(false)
      resolve.map((obj) => {
        resources.find((resource) => {
          obj.id === resource.id && setFetching(true)
        })
      })
      const validateResources = lodash.uniqBy(resources.concat(resolve), "id")
      setResources(validateResources)
    }
    setDisableTab(false)
    setLoadMoreResources(false)
    setLoad(true)
  }

  const addObject = useCallback(
    (images: any) => {
      try {
        const options: any = {
          type: "StaticVector",
          name: "Shape",
          src: images.url,
          erasable: false
        }
        if (editor) {
          activeScene.objects.add(options, { desiredSize: 200 })
        }
        if (user && projectSelect.id) {
          const ctx = { id: images.id }
          api.useShapes({ project_id: projectSelect.id, resource_id: ctx.id })
        }
      } catch {}
    },
    [activeScene, editor, activeObject, projectSelect, user]
  )

  const makeFilter = useCallback(
    ({ outlined, filled, recent }: { outlined?: boolean; filled?: boolean; recent?: boolean }) => {
      setLoad(false)
      if (recent || stateRecent) {
        setStateRecent(true)
      }

      if (outlined) {
        setType({ filled: false, outlined: true })
        setTypes("outlined")
      } else if (outlined === false) {
        setType({ ...type, outlined: false })
        setTypes(undefined)
      }

      if (filled) {
        setType({ outlined: false, filled: true })
        setTypes("filled")
      } else if (filled === false) {
        setType({ ...type, filled: false })
        setTypes(undefined)
      }

      try {
        if (filled === false && filled === false && !recent) {
          setResources(selectShapes)
        } else {
          setResources([])
        }
      } catch {
        setResources([])
      }
      setFetching(false)
    },
    [stateRecent, selectShapes, types, type]
  )

  return (
    <Box h="full" width="320px" borderRight="1px solid #ebebeb" padding="1rem 0" display="flex" flexDirection="column">
      <Flex padding={"0.5rem 1rem"} gap="0.5rem">
        <Button
          bg={type.filled ? "#5456F5" : "#DDDFE5"}
          color={type.filled ? "white" : "#545465"}
          borderRadius="30px"
          size="sm"
          variant="outline"
          onClick={() => {
            if (type.filled) {
              if (type.outlined === false && stateRecent === false) {
                setResources(selectShapes)
                setFetching(false)
                setValidateContent(null)
                setType({ ...type, filled: false })
                setTypes(undefined)
              } else {
                makeFilter({ filled: false })
              }
            } else {
              makeFilter({ filled: true })
            }
          }}
        >
          Filled
        </Button>
        <Button
          bg={type.outlined ? "#5456F5" : "#DDDFE5"}
          color={type.outlined ? "white" : "#545465"}
          borderRadius="30px"
          size="sm"
          variant="outline"
          onClick={() => {
            if (type.outlined) {
              if (type.filled === false && stateRecent === false) {
                setFetching(true)
                setResources(selectShapes)
                setValidateContent(null)
                setType({ ...type, outlined: false })
                setTypes(undefined)
                setFetching(false)
              } else {
                makeFilter({ outlined: false })
              }
            } else {
              makeFilter({ outlined: true })
            }
          }}
        >
          Outlined
        </Button>
      </Flex>
      <Box sx={{ padding: "0 1rem" }}>
        <Tabs size={"sm"}>
          <TabList>
            <Tab
              isDisabled={disableTab}
              onClick={() => {
                setResources(selectShapes)
                setStateRecent(false)
                setType({ filled: false, outlined: false })
                setTypes(undefined)
                setFetching(false)
                setValidateContent(null)
              }}
            >
              All
            </Tab>
            {user && (
              <Tab
                isDisabled={disableTab}
                onClick={() =>
                  user ? makeFilter({ recent: true }) : setValidateContent("You need to login to see this panel.")
                }
              >
                Recent
              </Tab>
            )}
          </TabList>
        </Tabs>
      </Box>
      <Flex w="full" h="full" flexDir="column">
        {validateContent === null ? (
          <Scrollable>
            <InfiniteScroll hasMore={!fetching} fetchData={fetchDataResource}>
              {load ? (
                <Flex flexDir="column">
                  <Grid templateColumns="repeat(4, 72px)" gap="5px">
                    {resources?.map((obj: any, index: number) => {
                      return (
                        <Flex
                          onDragStart={(e) => dragObject(e, obj)}
                          draggable={true}
                          sx={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                          onClick={() => addObject(obj)}
                          key={index}
                          border="1px #DDDFE5 solid"
                          padding="2px"
                          h="70px"
                          _hover={{ cursor: "pointer", border: "3px solid #5456F5" }}
                        >
                          <Flex w="full" h="full">
                            <LazyLoadImage url={obj.url} />
                          </Flex>
                        </Flex>
                      )
                    })}
                  </Grid>
                  <Button
                    w="full"
                    marginBlock="5px"
                    variant="outline"
                    isLoading={loadMoreResources}
                    disabled={fetching}
                    onClick={fetchDataResource}
                  >
                    {!fetching ? "Load more resources?" : "There are no more resources"}
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
            {stateRecent === true ? <img src={NoShapesImage} /> : null}
            <p>{validateContent}</p>
          </Center>
        )}
      </Flex>
    </Box>
  )
}
