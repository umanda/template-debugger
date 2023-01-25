import {
  Button,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow
} from "@chakra-ui/react"
import { useActiveObject, useActiveScene, useEditor } from "@layerhub-pro/react"
import React, { useCallback } from "react"
import { throttle } from "lodash"
import Plus from "../../../../Icons/Plus"
import { useAppDispatch } from "../../../../store/store"
import { getRecentColor } from "../../../../store/colors/action"

export default function Statictext() {
  const editor = useEditor()
  const [opacity, setOpacity] = React.useState({ opacityValue: 1 })
  const activeObject = useActiveObject() as any
  const activeScene = useActiveScene()
  const [state, setState] = React.useState<{
    charSpacing: number
    lineHeight: number
  }>({ charSpacing: 0, lineHeight: 0 })

  React.useEffect(() => {
    if (activeObject) {
      setOpacity({ opacityValue: activeObject.opacity * 100 })
    }
  }, [activeObject])

  React.useEffect(() => {
    if (activeObject) {
      // @ts-ignore
      const { charSpacing, lineHeight } = activeObject
      setState({ ...state, charSpacing: charSpacing / 10, lineHeight: lineHeight * 10 })
    }
  }, [activeObject])

  const onChange = React.useCallback(
    (value: number) => {
      setOpacity({ opacityValue: value })
      activeScene.objects.update({ opacity: value / 100 })
    },
    [activeScene]
  )

  const handleChange = useCallback(
    (type: string, value: number) => {
      if (editor) {
        if (type === "charSpacing") {
          setState({ ...state, [type]: value })
          // @ts-ignore
          activeScene.objects.update({
            [type]: value * 10
          })
        } else {
          setState({ ...state, [type]: value })
          // @ts-ignore
          activeScene.objects.update({
            [type]: value / 10
          })
        }
      }
    },
    [editor, activeScene]
  )

  return (
    <Box fontFamily="Outfit" fontSize="12px" sx={{ width: "320px" }}>
      <Flex color="#A9A9B2">TEXT</Flex>
      <Flex flexDirection="row" gap="20px" margin="10px">
        <Popover>
          <PopoverTrigger>
            <Button w="96px" h="24px" fontSize="12px" boxSize="">
              English
            </Button>
          </PopoverTrigger>
          <PopoverContent w="96px" h="71px">
            <PopoverArrow />
            <Flex margin="10px">Option</Flex>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger>
            <Button w="88px" h="24px" fontSize="12px" boxSize="">
              Mulish
            </Button>
          </PopoverTrigger>
          <PopoverContent w="96px" h="71px">
            <PopoverArrow />
            <Flex margin="10px">Option</Flex>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger>
            <Button w="96px" h="24px" fontSize="12px" boxSize="">
              8
            </Button>
          </PopoverTrigger>
          <PopoverContent w="96px" h="71px">
            <PopoverArrow />
            <Flex margin="10px">Option</Flex>
          </PopoverContent>
        </Popover>
      </Flex>
      <Flex flexDirection="column" gap="20px">
        <Flex flexDirection="row" justifyContent="center" alignItems="center" gap="10px">
          Letter spacing
          <Slider
            defaultValue={state.charSpacing}
            aria-label="slider-ex-6"
            onChange={(value: number) => handleChange("charSpacing", value)}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          {state.charSpacing}%
        </Flex>
        <Flex flexDirection="row" justifyContent="center" alignItems="center" gap="10px">
          Line spacing
          <Slider
            defaultValue={state.lineHeight}
            aria-label="slider-ex-6"
            onChange={(value: number) => handleChange("lineHeight", value)}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          {state.lineHeight}%
        </Flex>
        <Flex flexDirection="row" justifyContent="center" alignItems="center" gap="10px">
          Opacity
          <Slider defaultValue={opacity.opacityValue} onChange={(value) => onChange(value)}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          {opacity.opacityValue}%
        </Flex>
      </Flex>
      <Flex marginTop="10px" color="#A9A9B2">
        RECENT COLORS
      </Flex>
      <Flex flexWrap="wrap" gap="15px" margin="10px">
        <BoxColor boxColor="#A19B9A" />
      </Flex>
      <Flex color="#A9A9B2">DEFAULT COLORS</Flex>
      <Flex flexWrap="wrap" gap="15px" margin="10px">
        <BoxColor boxColor="#A19B9A" />
        <BoxColor boxColor="#DCD5D4" />
        <BoxColor boxColor="#D9A1DC" />
        <BoxColor boxColor="#7E8DD3" />
        <BoxColor boxColor="#2B43BC" />
        <BoxColor boxColor="#2BA2BC" />
        <BoxColor boxColor="#7BD1E5" />
        <BoxColor boxColor="#5EDA74" />
        <BoxColor boxColor="#F98F31" />
        <BoxColor boxColor="#F6F931" />
        <BoxColor boxColor="#E37E05" />
        <BoxColor boxColor="#450DA2" />
        <BoxColor boxColor="#BB7C2B" />
        <BoxColor boxColor="#C61010" />
        <BoxColor boxColor="#D66673" />
        <BoxColor boxColor="#1B7880" />
        <Flex
          bgGradient="linear-gradient(45deg, rgba(122,116,57,1) 0%, rgba(115,114,68,1) 17%, rgba(40,113,30,1) 34%, rgba(9,113,121,1) 50%, rgba(63,68,94,1) 67%, rgba(126,45,127,1) 84%, rgba(255,0,0,1) 100%)"
          boxSize="30px"
          borderRadius="20%"
          alignItems="center"
          justifyContent="center"
        >
          <Flex boxSize="20px" alignItems="center" justifyContent="center" background="white">
            <Plus size={15} />
          </Flex>
        </Flex>
      </Flex>
      <Flex color="#A9A9B2">EFFECTS</Flex>
    </Box>
  )
}

function BoxColor({ boxColor }: { boxColor: string }) {
  const [color, setColor] = React.useState("#b32aa9")
  const activeObject = useActiveObject() as any
  const dispatch = useAppDispatch()
  const activeScene = useActiveScene()
  const updateObjectFill = throttle((color: string) => {
    if (activeObject) {
      activeScene.objects.update({ fill: color })
    }
    setColor(color)
  }, 100)
  return (
    <Flex
      background={boxColor}
      onClick={() => {
        dispatch(getRecentColor(boxColor))
        updateObjectFill(boxColor)
      }}
      _hover={{ cursor: "pointer" }}
      boxSize="30px"
      borderRadius="20%"
    />
  )
}
