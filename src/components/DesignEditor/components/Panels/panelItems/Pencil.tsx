import { Box, Button, Center, Flex, Grid, GridItem, Input, Text } from "@chakra-ui/react"
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@chakra-ui/react"
import { useEditor } from "@layerhub-pro/react"
import { DEFAULT_COLORS } from "../../../../constants/consts"
import useResourcesContext from "../../../../hooks/useResourcesContext"
import Pencil1 from "../../../../Icons/Pencil1"
import Pencil2 from "../../../../Icons/Pencil2"
import Pencil3 from "../../../../Icons/Pencil3"
import Pencil4 from "../../../../Icons/Pencil4"
import Pencil5 from "../../../../Icons/Pencil5"
import React, { useCallback, useState } from "react"
import useDesignEditorContext from "../../../../hooks/useDesignEditorContext"

export default function Pencil() {
  const editor = useEditor()
  const { draw, setDraw } = useResourcesContext()
  const { setInputActive } = useDesignEditorContext()
  const [typeDraw, setTypeDraw] = useState<any>("")

  React.useEffect(() => {
    updateDrawing()
  }, [draw])

  const updateDrawing = useCallback(() => {
    if (draw.type) {
      editor?.freeDrawer?.enable(draw.type, { color: draw.color, opacity: draw.opacity / 100, size: draw.size })
    }
  }, [draw, editor])

  const enableDrawing = useCallback(
    (type: any) => {
      if (editor) {
        if (type == "EraserBrush") {
          setDraw({ ...draw, type: type })
          editor.freeDrawer.enable("EraserBrush", {})
        } else if (type) {
          setDraw({ ...draw, type: type })
          editor.freeDrawer.enable(type, { color: draw.color, opacity: draw.opacity / 100, size: draw.size })
        }
      }
    },
    [draw, editor]
  )

  const makeChangeDraw = useCallback(
    (type: string, e: any) => {
      if (type === "transparency") {
        setDraw({
          ...draw,
          opacity: e,
          opacityPrev: e
        })
      } else if (type === "size") {
        setDraw({
          ...draw,
          size: e,
          sizePrev: e
        })
      }
      setInputActive(false)
    },
    [draw]
  )

  const makeChangeInput = useCallback(
    (type: string, e: any) => {
      if (type === "transparency") {
        e === ""
          ? setDraw({
              ...draw,
              opacityPrev: 0
            })
          : setDraw({
              ...draw,
              opacityPrev: e
            })
      } else {
        e === ""
          ? setDraw({
              ...draw,
              sizePrev: 0
            })
          : setDraw({
              ...draw,
              sizePrev: e
            })
      }
    },
    [draw]
  )

  const toggleDrawing = useCallback(() => {
    if (editor?.freeDrawer?.canvas?.isDrawingMode) {
      editor.freeDrawer.disable()
      setTypeDraw(draw.type)
      setDraw({ ...draw, type: null })
    } else {
      if (typeDraw === "") {
        editor.freeDrawer.enable(draw.type !== null ? draw.type : "PencilBrush", {
          opacity: draw.opacity,
          size: draw.size,
          color: draw.color
        })
        draw.type === null && setDraw({ ...draw, type: "PencilBrush" })
      } else {
        editor.freeDrawer.enable(typeDraw, {
          opacity: draw.opacity,
          size: draw.size,
          color: draw.color
        })
        setDraw({ ...draw, type: typeDraw })
      }
    }
  }, [editor, draw, typeDraw])

  return (
    <Flex h="full" flexDir="column" sx={{ width: "full", borderRight: "1px solid #ebebeb" }}>
      <Box>
        <Text margin="10px" color="#A9A9B2">
          PENS & ERASER
        </Text>
        <Grid templateColumns="repeat(4, 1fr)" gap="3" marginInline="10px" fontSize="12px">
          <Flex
            onClick={() => enableDrawing("PencilBrush")}
            sx={{ cursor: "pointer", gap: "0.25rem" }}
            flexDir="column"
          >
            <Center
              marginX={"auto"}
              sx={{ border: `2px solid ${draw.type === "PencilBrush" ? "#5456F5" : "#DDDFE5"}`, borderRadius: "4px" }}
            >
              <Pencil1 size={62} />
            </Center>
            <Center>Marker</Center>
          </Flex>
          <Flex
            onClick={() => enableDrawing("MarkerBrush")}
            sx={{ cursor: "pointer", gap: "0.25rem" }}
            flexDir="column"
          >
            <Center
              marginX={"auto"}
              sx={{ border: `2px solid ${draw.type === "MarkerBrush" ? "#5456F5" : "#DDDFE5"}`, borderRadius: "4px" }}
            >
              <Pencil2 size={60} />
            </Center>
            <Center>Highlight</Center>
          </Flex>
          <Flex
            onClick={() => enableDrawing("RibbonBrush")}
            sx={{ cursor: "pointer", gap: "0.25rem" }}
            flexDir="column"
          >
            <Center
              marginX={"auto"}
              sx={{ border: `2px solid ${draw.type === "RibbonBrush" ? "#5456F5" : "#DDDFE5"}`, borderRadius: "4px" }}
            >
              <Pencil3 size={60} />
            </Center>
            <Center>Glow</Center>
          </Flex>
          <Flex
            onClick={() => enableDrawing("SpraypaintBrush")}
            sx={{ cursor: "pointer", gap: "0.25rem" }}
            flexDir="column"
          >
            <Center
              marginX={"auto"}
              sx={{
                border: `2px solid ${draw.type === "SpraypaintBrush" ? "#5456F5" : "#DDDFE5"}`,
                borderRadius: "4px"
              }}
            >
              <Pencil4 size={60} />
            </Center>
            <Center>Spray</Center>
          </Flex>
          <Flex
            onClick={() => enableDrawing("EraserBrush")}
            sx={{ cursor: "pointer", gap: "0.25rem" }}
            flexDir="column"
          >
            <Box
              marginX={"auto"}
              sx={{
                border: `2px solid ${draw.type === "EraserBrush" ? "#5456F5" : "#DDDFE5"}`,
                borderRadius: "4px"
              }}
            >
              <Pencil5 size={60} />
            </Box>
            <Center>Eraser</Center>
          </Flex>
        </Grid>
      </Box>
      <Center flexDir="row" marginRight="20px" marginLeft="20px" marginTop="10px">
        <Button
          _hover={{}}
          colorScheme="brand"
          variant={editor?.freeDrawer?.canvas?.isDrawingMode ? "solid" : "outline"}
          //background={editor?.freeDrawer?.canvas?.isDrawingMode ? "brand.500" : "inherit"}
          onClick={toggleDrawing}
          w="full"
        >
          {editor?.freeDrawer?.canvas?.isDrawingMode ? "Disable pen" : "Enable pen"}
        </Button>
      </Center>
      <Box padding={"10px 0"}>
        <Grid marginInline="10px" templateColumns="repeat(6, 1fr)" gap="10px" marginTop="15px">
          <GridItem fontSize={"14px"} color="#545465" colSpan={2} alignItems="center">
            Size
          </GridItem>
          <GridItem colSpan={3} alignItems="center" justifyItems="center">
            <Slider value={draw.size} aria-label="slider-ex-6" onChange={(val) => makeChangeDraw("size", val)}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </GridItem>
          <GridItem colSpan={1} alignItems="center" justifyItems="center" justifyContent="center" alignContent="center">
            <Input
              textAlign={"center"}
              value={draw.sizePrev}
              type={"number"}
              inputMode="decimal"
              pattern="[0-9]*(.[0-9]+)?"
              size={"xs"}
              onFocus={() => setInputActive(true)}
              onKeyDown={(e) => e.key === "Enter" && makeChangeDraw("size", draw.sizePrev)}
              onChange={(e) => makeChangeInput("size", e.target.value)}
              onBlur={(e) => makeChangeDraw("size", e.target.value)}
            />
          </GridItem>
        </Grid>
        {draw.type !== "EraserBrush" && (
          <Grid marginInline="10px" templateColumns="repeat(6, 1fr)" gap="10px" marginTop="15px">
            <GridItem fontSize={"14px"} color="#545465" colSpan={2} alignItems="center">
              Opacity
            </GridItem>
            <GridItem colSpan={3} alignItems="center" justifyItems="center">
              <Slider
                value={draw.opacity}
                aria-label="slider-ex-6"
                onChange={(val) => makeChangeDraw("transparency", val)}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </GridItem>
            <GridItem
              colSpan={1}
              alignItems="center"
              justifyItems="center"
              justifyContent="center"
              alignContent="center"
            >
              <Input
                textAlign={"center"}
                onFocus={() => setInputActive(true)}
                value={draw.opacityPrev}
                type={"number"}
                inputMode="decimal"
                pattern="[0-9]*(.[0-9]+)?"
                size={"xs"}
                onKeyDown={(e) => e.key === "Enter" && makeChangeDraw("transparency", draw.opacityPrev)}
                onChange={(e) => makeChangeInput("transparency", e.target.value)}
                onBlur={(e) => makeChangeDraw("transparency", e.target.value)}
              />
            </GridItem>
          </Grid>
        )}
      </Box>
      {draw.type !== "EraserBrush" && (
        <Box>
          <Flex sx={{ fontSize: "14px", color: "#A9A9B2", margin: "10px" }}>DEFAULT COLORS</Flex>
          <Grid gap="10px" templateColumns="repeat(7, 1fr)" marginInline="10px">
            {DEFAULT_COLORS.map((color) => (
              <Box
                onClick={() => setDraw({ ...draw, color })}
                boxSize="34px"
                borderRadius="4px"
                borderWidth="1px"
                borderColor="#A9A9B2"
                _hover={{ cursor: "pointer" }}
                key={color}
                sx={{ backgroundColor: color, height: "34px", borderRadius: "4px", cursor: "pointer" }}
              ></Box>
            ))}
          </Grid>
        </Box>
      )}
    </Flex>
  )
}
