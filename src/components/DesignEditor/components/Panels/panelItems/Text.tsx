import { Box, Center, Flex, Grid, IconButton, Spinner } from "@chakra-ui/react"
import { useActiveScene, useEditor } from "@layerhub-pro/react"
import React, { useEffect, useState } from "react"
import { nanoid } from "nanoid"
import { useSelector } from "react-redux"
import { selectUser } from "~/store/user/selector"
import { useAppDispatch } from "~/store/store"
import { loadFonts } from "~/utils/fonts"
import Scrollable from "~/components/Scrollable/Scrollable"
import InfiniteScroll from "~/utils/InfiniteScroll"
import LazyLoadImage from "~/utils/LazyLoadImage"
import Trash from "../../../../Icons/Trash"
import { selectListResourcesComposite } from "~/store/resources/selector"
import { deleteResourceComposite } from "~/store/resources/action"
import { selectListUseFonts } from "~/store/fonts/selector"

const defaultFont = {
  name: "JustAnotherHand-Regular",
  url: "https://fonts.gstatic.com/s/justanotherhand/v12/845CNN4-AJyIGvIou-6yJKyptyOpOcr_BmmlS5aw.ttf",
  preview: "https://segregate-drawify-images.s3.eu-west-3.amazonaws.com/fonts-v3/preview/JustAnotherHand-Regular.png"
}

export default function Text() {
  const user = useSelector(selectUser)
  const editor = useEditor()
  const dispatch = useAppDispatch()
  const [listResources, setListResources] = useState<any[]>([])
  const selectListResources = useSelector(selectListResourcesComposite)
  const [more, setMore] = useState(false)
  const [load, setLoad] = useState(true)
  const activeScene = useActiveScene()
  const [font, setFont] = useState<any>(defaultFont)
  const useFont = useSelector(selectListUseFonts)

  useEffect(() => {
    useFont[0] && setFont({ name: useFont[0]?.full_name, url: useFont[0]?.url, preview: useFont[0]?.preview })
  }, [])

  useEffect(() => {
    initialState()
  }, [user, selectListResources.length])

  const initialState = async () => {}

  const fetchDataResource = async () => {}

  const addHeader = React.useCallback(async () => {
    if (editor) {
      await loadFonts([font])
      const options = {
        id: nanoid(),
        type: "StaticText",
        textAlign: "center",
        text: "Add Header",
        fontFamily: font.name,
        fontURL: font.url,
        fontSize: 120,
        metadata: {}
      }
      activeScene.objects.add(options)
    }
  }, [activeScene, editor, font])

  const makeDeleteResource = async (id: string) => {
    dispatch(deleteResourceComposite(id))
  }

  // const addObject = (images: any) => {}

  const addSubHeader = React.useCallback(async () => {
    if (editor) {
      await loadFonts([font])

      const options = {
        id: nanoid(),
        type: "StaticText",
        textAlign: "center",
        text: "Add Sub Header",
        fontFamily: font.name,
        fontURL: font.url,
        fontSize: 80,
        metadata: {}
      }
      activeScene.objects.add(options)
    }
  }, [activeScene, editor, font])

  const addParagraph = React.useCallback(async () => {
    if (editor) {
      await loadFonts([font])
      const options = {
        id: nanoid(),
        type: "StaticText",
        text: "Use this sample paragraph to add multiple lines of text and provide additional information for your visual story.",
        fontFamily: font.name,
        fontURL: font.url,
        fontSize: 40
      }
      activeScene.objects.add(options)
    }
  }, [activeScene, editor, font])

  const onDragStart = React.useCallback(
    (ev: React.DragEvent<HTMLDivElement>, type: string) => {
      loadFonts([font])
      const options = {
        id: nanoid(),
        type: "StaticText",
        text:
          type === "header"
            ? "Add Header"
            : type === "subHeader"
            ? "Add Sub Header"
            : "Use this sample paragraph to add multiple lines of text and provide additional information for your visual story.",
        fontFamily: font.name,
        fontURL: font.url,
        fontSize: type === "header" ? 120 : type === "subHeader" ? 80 : 40,
        //@ts-ignore
        textAlign: type === "paragraph" ? "left" : "center"
      }
      editor.dragger.onDragStart(options, { desiredSize: type === "header" ? 292 : type === "subHeader" ? 240 : 255 })
    },
    [editor, font]
  )

  return (
    <Box h="full" width="320px" borderRight="1px solid #ebebeb" padding="1rem 0" display="flex" flexDirection="column">
      <Flex flexDirection="column" alignItems="center" padding={"1rem 0"} textAlign="center">
        <Box
          userSelect="none"
          draggable={true}
          onClick={addHeader}
          onDragStart={(e) => onDragStart(e, "header")}
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
            Captivate with a strong title
          </Box>
        </Box>
        <Box
          userSelect="none"
          draggable={true}
          onClick={addSubHeader}
          onDragStart={(e) => onDragStart(e, "subHeader")}
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
            Clear and short, with juicy keywords
          </Box>
        </Box>
        <Box
          userSelect="none"
          onClick={addParagraph}
          draggable={true}
          onDragStart={(e) => onDragStart(e, "paragraph")}
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
            Regular text, extraordinary content
          </Box>
        </Box>
      </Flex>
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
                    <Flex
                      w="full"
                      h="120px"
                      // onClick={addObject}
                    >
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
