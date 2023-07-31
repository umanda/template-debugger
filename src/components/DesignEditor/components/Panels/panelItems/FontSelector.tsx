import React, { useCallback, useEffect, useState } from "react"
import {
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Box,
  Tabs,
  TabList,
  Tab,
  Input,
  Center
} from "@chakra-ui/react"
import { useActiveObject, useActiveScene, useEditor, useScenes } from "@layerhub-pro/react"
import { useSelector } from "react-redux"
import { useAppDispatch } from "~/store/store"
import { selectUser } from "~/store/user/selector"
import { IFont } from "../../../../../interfaces/editor"
import { loadFonts } from "../../../../../utils/fonts"
import Scrollable from "../../../../Scrollable/Scrollable"
import InfiniteScroll from "../../../../../utils/InfiniteScroll"
import { getCategoryFonts, getListUseFonts, getUseFont } from "~/store/fonts/action"
import { selectCategoryFonts, selectFonts } from "~/store/fonts/selector"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import { getTextProperties } from "../../../../../utils/text"

export default function FontSelector() {
  const dispatch = useAppDispatch()
  const selectCategoryFont = useSelector(selectCategoryFonts)
  const user = useSelector(selectUser)
  const editor = useEditor()
  const fonts = useSelector(selectFonts)
  const [commonFonts, setCommonFonts] = React.useState<any[]>([])
  const [content, setContent] = React.useState<string>("")
  const activeScene = useActiveScene()
  const activeObject: any = useActiveObject()
  const [typeFont, setTypeFont] = useState("4725")
  const scenes = useScenes()

  useEffect(() => {
    if (activeObject) {
      getTextProperties(activeObject, fonts)
      setTypeFont(fonts.find((e) => e?.post_script_name === activeObject?.fontFamily)?.id)
    }
  }, [editor, activeScene, activeObject, scenes])

  useEffect(() => {
    initialState()
  }, [])

  const initialState = async () => {
    setContent("")
    if (selectCategoryFont === null) {
      await dispatch(getCategoryFonts())
    }
    setCommonFonts(fonts)
  }

  const makeFilter = async ({ recent, all }: { recent?: boolean; all?: boolean }) => {
    if (recent) {
      const resolve = (await (await dispatch(getListUseFonts())).payload) as any[]
      setCommonFonts(resolve)
    } else if (all) {
      setCommonFonts(fonts)
    }
  }

  const handleFontFamilyChange = useCallback(
    async (x: IFont) => {
      user && dispatch(getUseFont(x))
      if (editor) {
        const font = {
          name: x.post_script_name,
          url: x.url
        }
        await loadFonts([font])
        activeScene.objects.updateText({
          fontFamily: x.post_script_name,
          fontURL: font.url
        })
      }
    },
    [editor, activeScene]
  )

  return (
    <Flex
      sx={{
        width: "320px",
        height: "100%",
        flexDirection: "column",
        borderRight: "1px solid #ebebeb"
      }}
    >
      <Flex margin="10px" color="#A9A9B2">
        TEXT
      </Flex>
      <TextSpacing />
      <Box sx={{ padding: "0 1rem" }}>
        <Tabs size={"sm"}>
          <TabList>
            <Tab onClick={() => makeFilter({ all: true })}>All</Tab>
            <Tab onClick={() => makeFilter({ recent: true })} visibility={user ? "visible" : "hidden"}>
              Recent
            </Tab>
          </TabList>
        </Tabs>
      </Box>
      <Scrollable>
        <InfiniteScroll hasMore={false} fetchData={() => {}}>
          <Flex flexDir="column">
            {commonFonts?.map((font: any, index) => (
              <Box
                key={index}
                onClick={() => handleFontFamilyChange(font)}
                border={font.id === typeFont ? "3px solid #5456F5" : null}
                sx={{
                  height: "full",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  fontSize: "14px",
                  padding: "1rem",
                  ":hover": {
                    backgroundColor: "rgb(245,246,247)"
                  }
                }}
                id={font.id}
              >
                <img src={font.preview} />
              </Box>
            ))}
          </Flex>
        </InfiniteScroll>
      </Scrollable>
      <Center
        w={content === "" ? "0px" : "full"}
        h={content === "" ? "0px" : "full"}
        margin={content === "" ? "0px" : "20px"}
        visibility={content === "" ? "hidden" : "visible"}
      >
        {content}
      </Center>
    </Flex>
  )
}

function TextSpacing() {
  const editor = useEditor()
  const activeObject = useActiveObject()
  const activeScene = useActiveScene()
  const { setInputActive } = useDesignEditorContext()
  const [state, setState] = React.useState<{
    charSpacing: number
    lineHeight: number
    charSpacingTemp: number
    lineHeightTemp: number
  }>({ charSpacing: 0, lineHeight: 0, charSpacingTemp: 0, lineHeightTemp: 0 })

  React.useEffect(() => {
    if (activeObject) {
      // @ts-ignore
      const { charSpacing, lineHeight } = activeObject
      if (charSpacing !== undefined && lineHeight !== undefined) {
        setState({
          ...state,
          charSpacing: charSpacing / 10,
          lineHeight: lineHeight * 10,
          charSpacingTemp: charSpacing / 10,
          lineHeightTemp: lineHeight * 10
        })
      }
    }
  }, [activeObject])

  const handleChange = (type: string, value: number) => {
    if (editor) {
      if (type.includes("emp")) {
        if (type === "charSpacingTemp") {
          value >= 100 ? setState({ ...state, charSpacingTemp: 100 }) : setState({ ...state, charSpacingTemp: value })
        } else {
          value >= 100 ? setState({ ...state, lineHeightTemp: 100 }) : setState({ ...state, lineHeightTemp: value })
        }
      } else {
        if (type === "charSpacing") {
          setState({ ...state, [type]: value, charSpacingTemp: value })
          activeScene.objects.update({
            [type]: value * 10
          })
        } else {
          setState({ ...state, [type]: value, lineHeightTemp: value })
          activeScene.objects.update({
            [type]: value / 10
          })
        }
      }
    }
  }

  const applyTextChange = (type: string, e: any) => {
    let value: any
    try {
      value = e.target.value
    } catch {
      value = e
    }
    if (editor) {
      if (type === "charSpacing") {
        if (value !== "") {
          const parsedValue = parseFloat(value)
          setState({ ...state, charSpacing: parsedValue, charSpacingTemp: parsedValue })
          activeScene.objects.update({
            charSpacing: parsedValue * 10
          })
        } else {
          setState({ ...state, charSpacing: state.charSpacing, charSpacingTemp: state.charSpacing })
        }
      } else {
        if (value !== "" && value !== "0") {
          setState({ ...state, lineHeight: value, lineHeightTemp: value })
          activeScene.objects.update({
            lineHeight: value / 10
          })
        } else {
          setState({ ...state, lineHeight: state.lineHeight, lineHeightTemp: state.lineHeight })
        }
      }
    }
    setInputActive(false)
  }
  return (
    <Flex flexDirection="column" gap="20px" fontSize={"14px"} padding={"1rem"}>
      <Box sx={{ display: "grid", gridTemplateColumns: "94px 1fr 50px", gap: "0.2rem" }}>
        <Box>Letter spacing</Box>
        <Slider value={state.charSpacing} onChange={(value: number) => handleChange("charSpacing", value)}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <Input
          textAlign="center"
          value={state.charSpacingTemp}
          type="number"
          inputMode="decimal"
          pattern="[0-9]*(.[0-9]+)?"
          size="xs"
          onFocus={() => setInputActive(true)}
          onKeyDown={(e) => e.key === "Enter" && applyTextChange("charSpacing", state.charSpacingTemp)}
          onChange={(e) => handleChange("charSpacingTemp", parseFloat(e.target.value))}
          onBlur={(e) => applyTextChange("charSpacing", e)}
        />
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "94px 1fr 50px", gap: "0.2rem" }}>
        <Box> Line spacing</Box>

        <Slider min={1} value={state.lineHeight} onChange={(value: number) => handleChange("lineHeight", value)}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <Input
          onFocus={() => setInputActive(true)}
          textAlign={"center"}
          value={state.lineHeightTemp}
          type={"number"}
          inputMode="decimal"
          pattern="[0-9]*(.[0-9]+)?"
          size={"xs"}
          onKeyDown={(e) => e.key === "Enter" && applyTextChange("lineHeight", state.lineHeightTemp)}
          onChange={(e) => handleChange("lineHeightTemp", parseFloat(e.target.value))}
          onBlur={(e) => applyTextChange("lineHeight", e)}
        />
      </Box>
    </Flex>
  )
}
