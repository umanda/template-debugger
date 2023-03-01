import {
  Box,
  Flex,
  Grid,
  GridItem,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  useDisclosure
} from "@chakra-ui/react"
import { useActiveObject, useActiveScene, useEditor, useZoomRatio } from "@layerhub-pro/react"
import { DEFAULT_COLORS } from "../../../../constants/consts"
import useDesignEditorContext from "../../../../hooks/useDesignEditorContext"
import { getRecentColor } from "../../../../store/colors/action"
import { selectColors } from "../../../../store/colors/selector"
import { useEffect, useState } from "react"
import { HexColorPicker } from "react-colorful"
import { useAppDispatch, useAppSelector } from "../../../../store/store"
import { throttle } from "lodash"

export default function VectorColorPicker() {
  const { setInputActive, indexColorPicker, setIndexColorPicker, colors, setColors, setActiveMenu } =
    useDesignEditorContext()
  const editor = useEditor()
  const activeObject = useActiveObject() as any
  const [sliderValue, setSliderValue] = useState({
    sliderValue: activeObject?.opacity * 100,
    sliderValueTemp: activeObject?.opacity * 100
  })
  const dispatch = useAppDispatch()
  const recentColors = useAppSelector(selectColors).color
  const activeScene = useActiveScene()
  const zoomRatio = useZoomRatio()
  const [colorHex, setColorHex] = useState<string>("")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [inputHex, setInputHex] = useState<string>(Object.keys(colors.colorMap)[indexColorPicker])
  const [inputHexPrev, setInputHexPrev] = useState<string>(Object.keys(colors.colorMap)[indexColorPicker])

  useEffect(() => {
    if (activeObject) activeObject.type !== "StaticVector" && setActiveMenu("Illustrations")
  }, [activeObject])

  useEffect(() => {
    if (isOpen === false && colorHex !== "") dispatch(getRecentColor(colorHex))
  }, [isOpen])

  const changeBackgroundColor = throttle((prev: string, next: string) => {
    const objectRef = activeObject
    setColors({
      ...colors,
      colorMap: {
        ...colors.colorMap,
        [prev]: next
      }
    })

    if (activeObject) {
      objectRef.updateLayerColor(prev, next)
    }
    editor.zoom.zoomToRatio(zoomRatio + 0.000000001)
    editor.zoom.zoomToRatio(zoomRatio - 0.000000001)
  }, 100)

  const applyTextChange = (value: number, id: string) => {
    if (editor) {
      {
        setSliderValue({ sliderValue: value, sliderValueTemp: value })
        activeScene.objects.update(
          {
            opacity: value / 100
          },
          id
        )
      }
    }
    setInputActive(false)
  }

  const handleChange = (type: string, value: number) => {
    if (editor) {
      if (type.includes("emp")) {
        value >= 100
          ? setSliderValue({ ...sliderValue, sliderValueTemp: 100 })
          : setSliderValue({ ...sliderValue, sliderValueTemp: value })
      }
    }
    if (editor) {
      if (type.includes("emp")) {
        value >= 100
          ? setSliderValue({ ...sliderValue, sliderValueTemp: 100 })
          : setSliderValue({ ...sliderValue, sliderValueTemp: value })
      } else {
        setSliderValue({ ...sliderValue, sliderValue: value, sliderValueTemp: value })
        activeScene.objects.update({ opacity: value / 100 })
      }
    }
  }

  return (
    <Flex flexDir="column" fontSize="12px" sx={{ width: "320px" }} padding="10px" gap="10px">
      <Flex color="#A9A9B2">MORE COLORS</Flex>
      <GridItem>
        <Popover isOpen={isOpen} onClose={onClose} onOpen={onOpen} placement="bottom-start">
          <PopoverTrigger>
            <Box w="34px" sx={{ cursor: "pointer" }}>
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
                  onChange={(color) => {
                    setColorHex(color)
                    setInputHex(color)
                    setInputHexPrev(color)
                    changeBackgroundColor(Object.keys(colors.colorMap)[indexColorPicker], color)
                  }}
                />
                <Box sx={{ padding: "1rem 0", display: "grid", gridTemplateColumns: "40px 1fr", alignItems: "center" }}>
                  <Box sx={{ color: "#A9A9B2" }}>HEX</Box>
                  <Input
                    onBlur={(e) => {
                      setInputActive(false)
                      setColorHex(inputHex)
                      changeBackgroundColor(Object.keys(colors.colorMap)[indexColorPicker], inputHex)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setColorHex(inputHex)
                        changeBackgroundColor(Object.keys(colors.colorMap)[indexColorPicker], inputHex)
                      }
                    }}
                    onChange={(e) => {
                      setInputHex(e.target.value)
                      setInputHexPrev(e.target.value)
                      dispatch(getRecentColor(colorHex))
                    }}
                    onFocus={() => setInputActive(true)}
                    // onChange={(e) =>
                    //   changeBackgroundColor(Object.keys(colors.colorMap)[indexColorPicker], e.target.value)
                    // }
                    value={inputHexPrev}
                  />
                </Box>
              </Box>
            </PopoverContent>
          </Portal>
        </Popover>
      </GridItem>
      <Flex color="#A9A9B2">ILLUSTRATION COLOR</Flex>
      <Grid gap="10px" templateColumns="repeat(7, 1fr)">
        {Object.values(colors.colorMap).map((c: any, index) => {
          return (
            <div key={index}>
              <Flex
                background={c}
                _hover={{ cursor: "pointer" }}
                borderWidth={indexColorPicker === index ? "2px" : "1px"}
                borderStyle="solid"
                borderColor={indexColorPicker === index ? "brand.500" : "#A9A9B2"}
                onClick={() => {
                  setIndexColorPicker(index)
                }}
                boxSize="34px"
                borderRadius="20%"
              />
            </div>
          )
        })}
      </Grid>
      <Flex sx={{ fontSize: "12px" }} color="#A9A9B2">
        RECENT COLORS
      </Flex>
      <Grid gridGap="8px" templateColumns="repeat(7, 1fr)">
        {recentColors.map((color, index) => {
          return (
            <GridItem
              boxSize="34px"
              borderRadius="4px"
              borderWidth="1px"
              borderColor="#A9A9B2"
              _hover={{ cursor: "pointer" }}
              bg={color}
              onClick={() => {
                dispatch(getRecentColor(color))
                changeBackgroundColor(Object.keys(colors.colorMap)[indexColorPicker], color)
              }}
              key={index}
            ></GridItem>
          )
        })}
      </Grid>
      <Flex sx={{ fontSize: "12px" }} color="#A9A9B2">
        DEFAULT COLORS
      </Flex>
      <Grid gap="10px" templateColumns="repeat(7, 1fr)">
        {DEFAULT_COLORS.map((color) => (
          <Box
            onClick={() => {
              dispatch(getRecentColor(color))
              changeBackgroundColor(Object.keys(colors.colorMap)[indexColorPicker], color)
            }}
            borderWidth="1px"
            borderColor="#A9A9B2"
            key={color}
            sx={{ backgroundColor: color, height: "34px", borderRadius: "4px", cursor: "pointer" }}
          ></Box>
        ))}
      </Grid>
      <Grid templateColumns="repeat(6, 1fr)" gap="10px" marginTop="15px">
        <GridItem colSpan={1} alignItems="center">
          Opacity
        </GridItem>
        <GridItem colSpan={3} alignItems="center" justifyItems="center">
          <Slider
            value={sliderValue.sliderValue}
            aria-label="slider-ex-6"
            onChange={(val) => applyTextChange(val, activeObject.id)}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </GridItem>
        <GridItem colSpan={2} alignItems="center" justifyItems="center" justifyContent="center" alignContent="center">
          <Input
            textAlign={"center"}
            value={sliderValue.sliderValueTemp}
            type={"number"}
            inputMode="decimal"
            pattern="[0-9]*(.[0-9]+)?"
            size={"xs"}
            onKeyDown={(e) => e.key === "Enter" && applyTextChange(sliderValue.sliderValueTemp, activeObject.id)}
            onChange={(e) => handleChange("charSpacingTemp", parseFloat(e.target.value))}
            onBlur={(e) => applyTextChange(parseFloat(e.target.value), activeObject.id)}
            onFocus={() => setInputActive(true)}
          />
        </GridItem>
      </Grid>
    </Flex>
  )
}
