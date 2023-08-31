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
import { DEFAULT_COLORS } from "~/constants/consts"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import { useCallback, useEffect, useRef, useState } from "react"
import { HexColorPicker } from "react-colorful"
import { useDebounce } from "use-debounce"
import { stateRecentColors } from "~/utils/recentColors"

export default function VectorColorPicker() {
  const { setInputActive, indexColorPicker, colors, setColors } = useDesignEditorContext()
  const editor = useEditor()
  const activeObject = useActiveObject() as any
  const [sliderValue, setSliderValue] = useState({
    sliderValue: activeObject?.opacity * 100,
    sliderValueTemp: activeObject?.opacity * 100
  })
  const recentColors: string[] | null = JSON.parse(localStorage.getItem("recentColors"))
  const activeScene = useActiveScene()
  const zoomRatio = useZoomRatio()
  const [colorHex, setColorHex] = useState<string>("")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [inputHex, setInputHex] = useState<string>(Object.keys(colors.colorMap)[indexColorPicker])
  const [inputHexPrev, setInputHexPrev] = useState<string>(Object.keys(colors.colorMap)[indexColorPicker])
  const [stateChange] = useDebounce(colorHex, 500)

  useEffect(() => {
    changeBackgroundColor(Object.keys(colors.colorMap)[indexColorPicker], inputHex)
  }, [stateChange])

  const changeBackgroundColor = useCallback(
    (prev: string, next: string, inactive?: boolean) => {
      if (prev !== next) {
        if (activeObject) {
          editor.design.activeScene.objects.updateLayerColor(prev, next)
        }
        stateRecentColors(next, recentColors)
        setColors({ ...colors, colorMap: activeObject.colorMap })
        editor.zoom.zoomToRatio(zoomRatio + 0.000000001)
        editor.zoom.zoomToRatio(zoomRatio - 0.000000001)
      }
    },
    [activeObject, colors, editor]
  )

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
                  //@ts-ignore
                  color={Object.values(colors.colorMap)[indexColorPicker]}
                  onChange={(color) => {
                    setColorHex(color)
                    setInputHex(color)
                    setInputHexPrev(color)
                  }}
                />
                <Box sx={{ padding: "1rem 0", display: "grid", gridTemplateColumns: "40px 1fr", alignItems: "center" }}>
                  <Box sx={{ color: "#A9A9B2" }}>HEX</Box>
                  <Input
                    onBlur={() => {
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
                      if (e.target.value.length <= 7) {
                        setInputHex(e.target.value)
                        setInputHexPrev(e.target.value)
                      }
                    }}
                    onFocus={() => setInputActive(true)}
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
            <GridItem key={index}>
              <HexColorVector index={index} c={c} changeBackgroundColor={changeBackgroundColor} />
            </GridItem>
          )
        })}
      </Grid>
      <Flex sx={{ fontSize: "12px" }} color="#A9A9B2">
        RECENT COLORS
      </Flex>
      <Grid gridGap="8px" templateColumns="repeat(7, 1fr)">
        {recentColors?.map((color, index) => {
          return (
            <GridItem
              boxSize="34px"
              borderRadius="4px"
              borderWidth={Object.values(colors.colorMap)[indexColorPicker] === color ? "2px" : "1px"}
              borderColor={Object.values(colors.colorMap)[indexColorPicker] === color ? "brand.500" : "#A9A9B2"}
              _hover={{ cursor: "pointer" }}
              bg={color}
              onClick={() => {
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
              changeBackgroundColor(Object.keys(colors.colorMap)[indexColorPicker], color)
            }}
            borderWidth={Object.values(colors.colorMap)[indexColorPicker] === color ? "2px" : "1px"}
            borderColor={Object.values(colors.colorMap)[indexColorPicker] === color ? "brand.500" : "#A9A9B2"}
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

function HexColorVector({
  index,
  c,
  changeBackgroundColor
}: {
  index: number
  c
  changeBackgroundColor: (prev: string, next: string, inactive?: boolean) => void
}) {
  const { setInputActive, indexColorPicker, setIndexColorPicker, colors } = useDesignEditorContext()
  const { isOpen: isOpenColor, onOpen: onOpenColor, onClose: onCloseColor } = useDisclosure()
  const ref = useRef<any>()
  const editor = useEditor()
  const zoomRatio = useZoomRatio()
  const [inputHex, setInputHex] = useState<string>(Object?.keys(colors?.colorMap)[indexColorPicker])
  const [inputHexPrev, setInputHexPrev] = useState<string>(Object?.keys(colors?.colorMap)[indexColorPicker])
  const [colorHex, setColorHex] = useState<string>("")
  const [stateChange] = useDebounce(colorHex, 100)
  const recentColors: string[] | null = JSON.parse(localStorage.getItem("recentColors"))

  useEffect(() => {
    changeBackgroundColor(Object.keys(colors.colorMap)[indexColorPicker], inputHex, true)
  }, [stateChange])

  useEffect(() => {
    if (!isOpenColor) {
      stateRecentColors(colorHex, recentColors)
      editor.zoom.zoomToRatio(zoomRatio + 0.000000001)
      editor.zoom.zoomToRatio(zoomRatio - 0.000000001)
    }
  }, [isOpenColor])

  return (
    <Popover
      key={index}
      closeOnBlur={true}
      isOpen={isOpenColor}
      onClose={onCloseColor}
      onOpen={onOpenColor}
      placement="bottom-start"
    >
      <PopoverTrigger>
        <div>
          <Flex
            background={c}
            _hover={{ cursor: "pointer" }}
            borderWidth={indexColorPicker === index ? "2px" : "1px"}
            borderColor={indexColorPicker === index ? "brand.500" : "#A9A9B2"}
            borderStyle="solid"
            onClick={() => setIndexColorPicker(index)}
            boxSize="34px"
            borderRadius="20%"
          />
        </div>
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
              //@ts-ignore
              color={Object.values(colors.colorMap)[indexColorPicker]}
              onChange={(color) => {
                setColorHex(color)
                setInputHex(color)
                setInputHexPrev(color)
              }}
            />
            <Box sx={{ padding: "1rem 0", display: "grid", gridTemplateColumns: "40px 1fr", alignItems: "center" }}>
              <Box sx={{ color: "#A9A9B2" }}>HEX</Box>
              <Input
                ref={ref}
                onBlur={(e) => {
                  if (Object.keys(colors.colorMap)[indexColorPicker] !== inputHexPrev) {
                    setInputActive(false)
                    setColorHex(inputHex)
                    changeBackgroundColor(Object.keys(colors.colorMap)[indexColorPicker], inputHex)
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    ref.current.blur()
                  }
                }}
                onChange={(e) => {
                  if (e.target.value.length <= 7) {
                    setInputHex(e.target.value)
                    setInputHexPrev(e.target.value)
                  }
                }}
                onFocus={() => setInputActive(true)}
                value={inputHexPrev}
              />
            </Box>
          </Box>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}
