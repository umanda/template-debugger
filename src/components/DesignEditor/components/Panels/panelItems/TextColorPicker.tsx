import {
  Box,
  Flex,
  GridItem,
  Input,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  useDisclosure
} from "@chakra-ui/react"
import { Grid, Popover, PopoverContent, PopoverTrigger, Portal } from "@chakra-ui/react"
import { HexColorPicker } from "react-colorful"
import { useActiveObject, useActiveScene, useEditor } from "@layerhub-pro/react"
import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "~/store/store"
import { selectColors } from "~/store/colors/selector"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import { getRecentColor } from "~/store/colors/action"
import { DEFAULT_COLORS } from "~/constants/consts"

export default function TextColorPicker() {
  const dispatch = useAppDispatch()
  const recentColors = useAppSelector(selectColors).color
  const editor = useEditor()
  const activeObject = useActiveObject() as any
  const { setColorText, setActiveMenu, setInputActive } = useDesignEditorContext()
  const activeScene = useActiveScene()
  const [colorHex, setColorHex] = useState<string>("")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [state, setState] = React.useState<{
    color: string
    opacity: number
    opacityTemp: number
  }>({ color: activeObject?.fill, opacity: activeObject?.opacity * 100, opacityTemp: activeObject?.opacity * 100 })

  useEffect(() => {
    if (activeObject) activeObject.type !== "StaticText" && setActiveMenu("Text")
  }, [activeObject])

  useEffect(() => {
    if (isOpen === false && colorHex !== "") dispatch(getRecentColor(colorHex))
  }, [isOpen])

  const onChange = (type: string, value: number) => {
    if (editor) {
      if (type.includes("emp")) {
        value >= 100 ? setState({ ...state, opacityTemp: 100 }) : setState({ ...state, opacityTemp: value })
      } else {
        setState({ ...state, opacity: value, opacityTemp: value })
        activeScene.objects.updateText({ opacity: value / 100 })
      }
    }
  }

  const updateObjectFill = (color: string) => {
    if (editor) {
      setState({ ...state, color })
      activeScene.objects.updateText({ fill: color })
      setColorText(color)
    }
  }

  const applyTextChange = (e: any) => {
    let value: any
    try {
      value = e.target.value
    } catch {
      value = e
    }
    if (editor) {
      setState({ ...state, opacity: value, opacityTemp: value })
      activeScene.objects.updateText({ opacity: value / 100 })
    }
  }

  return (
    <Flex
      flexDir="column"
      sx={{ width: "320px", borderRight: "1px solid #ebebeb" }}
      textColor="#A9A9B2"
      padding="1rem"
      gap="1rem"
    >
      <Flex sx={{ fontSize: "14px" }}>MORE COLORS</Flex>
      <Flex>
        <Popover isOpen={isOpen} onClose={onClose} onOpen={onOpen} placement="bottom-start">
          <PopoverTrigger>
            <Box sx={{ cursor: "pointer" }}>
              <img style={{ height: "34px" }} src="https://i.ibb.co/ngvxh62/color-Picker-24-2-1.png" />
            </Box>
          </PopoverTrigger>
          <Portal>
            <PopoverContent sx={{ width: "320px" }}>
              <Box
                className="custom"
                style={{
                  padding: "1rem"
                }}
              >
                <HexColorPicker
                  style={{ width: "100%" }}
                  color={state.color}
                  onChange={(color) => {
                    setColorHex(color)
                    updateObjectFill(color)
                  }}
                />
                <Box sx={{ padding: "1rem 0", display: "grid", gridTemplateColumns: "40px 1fr", alignItems: "center" }}>
                  <Box sx={{ color: "#A9A9B2" }}>HEX</Box>
                  <Input
                    onFocus={() => setInputActive(true)}
                    onBlur={() => setInputActive(false)}
                    onChange={(e) => updateObjectFill(e.target.value)}
                    value={state.color}
                  />
                </Box>
              </Box>
            </PopoverContent>
          </Portal>
        </Popover>
      </Flex>
      <Flex sx={{ fontSize: "14px" }}>RECENT COLORS</Flex>
      <Grid gridGap="8px" templateColumns="repeat(7, 1fr)">
        {recentColors.map((color, index) => {
          return (
            <GridItem
              boxSize="34px"
              borderRadius="4px"
              borderWidth={state.color === color ? "2px" : "1px"}
              borderColor={state.color === color ? "brand.500" : "#A9A9B2"}
              _hover={{ cursor: "pointer" }}
              bg={color}
              onClick={() => {
                dispatch(getRecentColor(color))
                updateObjectFill(color)
              }}
              key={index}
            ></GridItem>
          )
        })}
      </Grid>
      <Flex flexDir="column" gap="10px">
        <Flex sx={{ fontSize: "14px" }}>DEFAULT COLORS</Flex>
        <Grid gap="8px" templateColumns="repeat(7, 1fr)">
          {DEFAULT_COLORS.map((color) => (
            <Box
              boxSize="34px"
              borderRadius="4px"
              borderWidth={state.color === color ? "2px" : "1px"}
              borderColor={state.color === color ? "brand.500" : "#A9A9B2"}
              _hover={{ cursor: "pointer" }}
              bg={color}
              onClick={() => {
                dispatch(getRecentColor(color))
                updateObjectFill(color)
              }}
              key={color}
              sx={{ backgroundColor: color, height: "34px", borderRadius: "4px", cursor: "pointer" }}
            ></Box>
          ))}
        </Grid>
      </Flex>
      <Box sx={{ display: "grid", gridTemplateColumns: "60px 1fr 50px", gap: "0.8rem" }}>
        <Box>Opacity</Box>
        <Slider value={state.opacity} onChange={(value: number) => onChange("sliderValue", value)}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <Input
          textAlign={"center"}
          value={state.opacityTemp}
          type={"number"}
          inputMode="decimal"
          textColor="black"
          pattern="[0-9]*(.[0-9]+)?"
          size={"xs"}
          onKeyDown={(e) => e.key === "Enter" && applyTextChange(state.opacityTemp)}
          onChange={(e) => onChange("sliderValueTemp", parseFloat(e.target.value))}
          onBlur={(e) => applyTextChange(e)}
        />
      </Box>
    </Flex>
  )
}
