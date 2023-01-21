import React, { useCallback, useEffect, useState } from "react"
import { Box, Button, Center, Flex, Grid, GridItem, Spinner } from "@chakra-ui/react"
import { useActiveScene, useEditor } from "@layerhub-pro/react"
import { Tabs, TabList, Tab } from "@chakra-ui/react"
import Scrollable from "../../../../utils/Scrollable"
import { useAppDispatch } from "../../../../store/store"
import * as api from "../../../../services/api"
import { IResource } from "../../../../interfaces/editor"
import InfiniteScroll from "../../../../utils/InfiniteScroll"
import { useSelector } from "react-redux"
import { selectUser } from "../../../../store/user/selector"
import lodash from "lodash"
import LazyLoadImage from "../../../../utils/LazyLoadImage"
import useResourcesContext from "../../../../hooks/useResourcesContext"
import { getListResourcesShapes } from "../../../../store/resources/action"
import { selectResourceShapes } from "../../../../store/resources/selector"

const initialQuery = {
  page: 1,
  limit: 40,
  query: {
    categories: ["SHAPE"],
    used: false,
    visibility: "public",
    favorited: false
  },
  sorts: ["ALPHABETIC"]
}

export default function Shapes() {
  const { setResourceDrag } = useResourcesContext()
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
  useEffect(() => {
    initialState()
  }, [user])

  const initialState = useCallback(async () => {
    if (selectShapes[0] === undefined) {
      const resolve = (await dispatch(getListResourcesShapes(initialQuery))).payload as IResource[]
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
      const resolve = (await (await dispatch(getListResourcesShapes(newQuery))).payload) as IResource[]
      setResources(resources.concat(resolve))
      resolve[0] === undefined ? setFetching(true) : setFetching(false)
    } else {
      const resolve: any[] = await api.searchResources({
        page: resources.length / 40 + 1,
        limit: 40,
        query: {
          content: types,
          visibility: "public",
          categories: ["SHAPE"],
          used: stateRecent
        },
        sorts: ["ALPHABETIC"]
      })
      if (resolve[0] === undefined && resources[0] === undefined) {
        setValidateContent("Nothing was found related to the filter entered")
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
      if (user) {
        const ctx = { id: images.id }
        api.recentResource(ctx.id)
      }
      const options = {
        type: "StaticVector",
        name: "Shape",
        src: images.url,
        metadata: {}
      }
      if (editor) {
        activeScene.objects.add(options)
      }
    },
    [activeScene, editor]
  )

  const onDragStart = React.useCallback(
    (ev: React.DragEvent<HTMLDivElement>, resource: any) => {
      setResourceDrag(resource)
      ev.dataTransfer.setData("resource", "image")
    },
    [activeScene, editor, setResourceDrag]
  )

  const makeFilter = useCallback(
    ({ outlined, filled, recent }: { outlined?: boolean; filled?: boolean; recent?: boolean }) => {
      setLoad(false)
      if (recent || stateRecent) {
        setStateRecent(true)
      }

      if (outlined) {
        setType({ filled: false, outlined: true })
        setTypes("OUTLINED")
      } else if (outlined === false) {
        setType({ ...type, outlined: false })
        setTypes(undefined)
      }

      if (filled) {
        setType({ outlined: false, filled: true })
        setTypes("FILLED")
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
    [stateRecent, selectShapes]
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
      {validateContent === null ? (
        <Scrollable>
          <InfiniteScroll hasMore={!fetching} fetchData={fetchDataResource}>
            {load ? (
              <Flex flexDir="column">
                <Grid templateColumns="repeat(4, 72px)" gap="5px">
                  {resources?.map((obj: any, index: number) => {
                    return (
                      <GridItem
                        sx={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                        onClick={() => addObject(obj)}
                        key={index}
                        border="1px #DDDFE5 solid"
                        padding="2px"
                        h="70px"
                        onDragStart={(e) => onDragStart(e, obj)}
                        _hover={{ cursor: "pointer", border: "3px solid #5456F5" }}
                      >
                        <Flex w="full" h="full">
                          <LazyLoadImage url={obj.preview} />
                        </Flex>
                      </GridItem>
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