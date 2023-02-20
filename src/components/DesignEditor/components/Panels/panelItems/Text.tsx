import { Box, Center, Flex, Grid, GridItem, IconButton, Image, Spinner } from "@chakra-ui/react"
import { Tabs, TabList, Tab } from "@chakra-ui/react"
import { useActiveScene, useEditor } from "@layerhub-pro/react"
import React, { useEffect, useState } from "react"
import { nanoid } from "nanoid"
import { useSelector } from "react-redux"
// import { deleteResourceComposite, getListResourcesComposite } from "~/store/resources/action"
// import { selectListResourcesComposite } from "~/store/resources/selector"
import { selectUser } from "../../../../store/user/selector"
import { useAppDispatch } from "../../../../store/store"
import { loadFonts } from "../../../../utils/fonts"
import Scrollable from "../../../../utils/Scrollable"
import InfiniteScroll from "../../../../utils/InfiniteScroll"
import LazyLoadImage from "../../../../utils/LazyLoadImage"
import Trash from "../../../../Icons/Trash"
import { selectListResourcesComposite } from "../../../../store/resources/selector"
import { deleteResourceComposite, getListResourcesComposite } from "../../../../store/resources/action"
import useResourcesContext from "../../../../hooks/useResourcesContext"

const font = {
  name: "JustAnotherHand-Regular",
  url: "https://fonts.gstatic.com/s/justanotherhand/v12/845CNN4-AJyIGvIou-6yJKyptyOpOcr_BmmlS5aw.ttf",
  preview: "https://segregate-drawify-images.s3.eu-west-3.amazonaws.com/fonts-v3/preview/JustAnotherHand-Regular.png"
}

export default function Text() {
  const { setResourceDrag } = useResourcesContext()
  const user = useSelector(selectUser)
  const editor = useEditor()
  const dispatch = useAppDispatch()
  const [listResources, setListResources] = useState<any[]>([])
  const selectListResources = useSelector(selectListResourcesComposite)
  const [more, setMore] = useState(false)
  const [load, setLoad] = useState(true)
  const activeScene = useActiveScene()

  useEffect(() => {
    initialState()
  }, [user, selectListResources.length])

  const initialState = async () => {
    // if (user) {
    //   if (selectListResources[0] === undefined) {
    //     const resolve: any = (await (
    //       await dispatch(getListResourcesComposite({ page: 1, limit: 10, query: {} }))
    //     ).payload) as any[]
    //     resolve.name !== "AxiosError" && setListResources(resolve)
    //     resolve[0] !== undefined ? setMore(true) : setMore(false)
    //   } else {
    //     // setListResources(selectListResources)
    //     setMore(true)
    //   }
    // }
    // setLoad(true)
  }

  const fetchDataResource = async () => {
    // setMore(false)
    // const resolve = (
    //   await dispatch(getListResourcesComposite({ page: listResources.length / 10 + 1, limit: 10, query: {} }))
    // ).payload as any[]
    // setListResources(listResources.concat(resolve))
    // resolve[0] !== undefined ? setMore(true) : setMore(false)
    // setLoad(true)
  }

  const addHeader = React.useCallback(async () => {
    if (editor) {
      await loadFonts([font])
      const options = {
        id: nanoid(),
        width: 340,
        type: "StaticText",
        textAlign: "center",
        text: "Add header",
        fontFamily: font.name,
        fontURL: font.url,
        fontSize: 120,
        metadata: {}
      }
      activeScene.objects.add(options)
    }
  }, [activeScene, editor])

  const makeDeleteResource = async (id: string) => {
    dispatch(deleteResourceComposite(id))
  }

  const addObject = (images: any) => {}

  const addSubHeader = React.useCallback(async () => {
    if (editor) {
      await loadFonts([font])

      const options = {
        id: nanoid(),
        width: 240,
        type: "StaticText",
        textAlign: "center",
        text: "Sub header",
        fontFamily: font.name,
        fontURL: font.url,
        fontSize: 80,
        metadata: {}
      }
      activeScene.objects.add(options)
    }
  }, [activeScene, editor])

  const addParagraph = React.useCallback(async () => {
    if (editor) {
      await loadFonts([font])
      const options = {
        id: nanoid(),
        width: 360,
        type: "StaticText",
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
        fontFamily: font.name,
        fontURL: font.url,
        fontSize: 40,
        metadata: {}
      }
      activeScene.objects.add(options)
    }
  }, [activeScene, editor])

  const onDragStart = React.useCallback(
    (ev: React.DragEvent<HTMLDivElement>, type: string) => {
      loadFonts([font])
      const options = {
        id: nanoid(), //"Add header"
        width: type === "header" ? 360 : type === "subHeader" ? 240 : 120,
        type: "StaticText",
        textAlign: "center",
        text:
          type === "header"
            ? "Add Header"
            : type === "subHeader"
            ? "Add sub Header"
            : "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
        fontFamily: font.name,
        fontURL: font.url,
        fontSize: type === "header" ? 120 : type === "subHeader" ? 80 : 40,
        metadata: {}
      }
      setResourceDrag(options)
      ev.dataTransfer.setData("resource", "text")
    },
    [editor, setResourceDrag]
  )

  return (
    <Box h="full" width="320px" borderRight="1px solid #ebebeb" padding="1rem 0" display="flex" flexDirection="column">
      <Flex flexDirection="column" alignItems="center" padding={"1rem 0"} textAlign="center">
        <Box
          userSelect="none"
          draggable={true}
          onDragStart={(e) => onDragStart(e, "header")}
          onClick={addHeader}
          sx={{
            cursor: "pointer",
            width: "240px",
            padding: "0.5rem",
            ":hover": {
              background: "rgba(0,0,0,0.05)"
            }
          }}
        >
          <Box
            sx={{
              fontSize: "36px"
            }}
          >
            Header
          </Box>
          <Box
            sx={{
              fontSize: "12px",
              color: "#A9A9B2"
            }}
          >
            A hint is a helpful piece of advice
          </Box>
        </Box>
        <Box
          userSelect="none"
          draggable={true}
          onDragStart={(e) => onDragStart(e, "subHeader")}
          onClick={addSubHeader}
          sx={{
            cursor: "pointer",
            width: "240px",
            padding: "0.5rem",
            ":hover": {
              background: "rgba(0,0,0,0.05)"
            }
          }}
        >
          <Box
            sx={{
              fontSize: "24px"
            }}
          >
            Sub Header
          </Box>
          <Box
            sx={{
              fontSize: "12px",
              color: "#A9A9B2"
            }}
          >
            A hint is a helpful pice of advice
          </Box>
        </Box>
        <Box
          userSelect="none"
          draggable={true}
          onDragStart={(e) => onDragStart(e, "paragraph")}
          onClick={addParagraph}
          sx={{
            cursor: "pointer",
            width: "240px",
            padding: "0.5rem",
            ":hover": {
              background: "rgba(0,0,0,0.05)"
            }
          }}
        >
          <Box
            sx={{
              fontSize: "18px"
            }}
          >
            Paragraph
          </Box>
          <Box
            sx={{
              fontSize: "12px",
              color: "#A9A9B2"
            }}
          >
            A hint is a helpful pice of advice
          </Box>
        </Box>
      </Flex>
      {/* <Box sx={{ padding: "0 1rem" }}>
        <Tabs size={"sm"}>
          <TabList>
            <Tab>All</Tab>
          </TabList>
        </Tabs>
      </Box> */}
      <Flex w="full" h="full">
        <Scrollable autoHide={true}>
          <InfiniteScroll hasMore={more} fetchData={fetchDataResource}>
            {load ? (
              <Grid templateColumns="repeat(2, 1fr)" gap={6} margin="10px">
                {listResources?.map((e, index) => (
                  <Center
                    key={index}
                    h="full"
                    w="full"
                    _hover={{
                      cursor: "pointer",
                      border: "3px solid #5456F5"
                    }}
                  >
                    <Flex w="full" h="120px" onClick={addObject}>
                      <LazyLoadImage url={e.preview} />
                    </Flex>
                    <IconButton
                      marginLeft="90px"
                      marginTop="80px"
                      pos="absolute"
                      aria-label="Delete"
                      onClick={() => makeDeleteResource(e.id)}
                      icon={<Trash size={20} />}
                    />
                  </Center>
                ))}
              </Grid>
            ) : (
              <Center h="40rem" w="full">
                <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="#5456f5" size="xl" />
              </Center>
            )}
          </InfiniteScroll>
        </Scrollable>
      </Flex>
    </Box>
  )
}
