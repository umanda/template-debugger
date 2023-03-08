import {
  Box,
  Flex,
  Grid,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useDisclosure
} from "@chakra-ui/react"
import { useEditor } from "@layerhub-pro/react"
import { DEFAULT_COLORS } from "~/constants/consts"
import { getRecentColor } from "~/store/colors/action"
import { selectColors } from "~/store/colors/selector"
import { useAppDispatch, useAppSelector } from "~/store/store"
import React, { useEffect, useState } from "react"
import { HexColorPicker } from "react-colorful"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"

export default function Backogrund() {
  const dispatch = useAppDispatch()
  const { setInputActive } = useDesignEditorContext()
  const recentColors = useAppSelector(selectColors).color
  const editor = useEditor()
  const [colorHex, setColorHex] = useState<string>("")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [state, setState] = React.useState<{
    color: string
  }>({ color: "#000000" })

  useEffect(() => {
    if (isOpen === false && colorHex !== "") dispatch(getRecentColor(colorHex))
  }, [isOpen])

  const setBackgroundColor = (color: string) => {
    setState({ color })
    editor.design.activeScene.background.update({ fill: color })
  }

  return (
    <Flex
      sx={{
        width: "320px",
        borderRight: "1px solid #ebebeb",
        padding: "1rem",
        gap: "1rem",
        color: "#A9A9B2",
        flexDirection: "column"
      }}
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
                  onChange={(color) => {
                    setColorHex(color)
                    setBackgroundColor(color)
                  }}
                />
                <Box sx={{ padding: "1rem 0", display: "grid", gridTemplateColumns: "40px 1fr", alignItems: "center" }}>
                  <Box sx={{ color: "#A9A9B2" }}>HEX</Box>
                  <Input
                    onBlur={() => setInputActive(false)}
                    onFocus={() => setInputActive(true)}
                    onChange={(e) => setBackgroundColor(e.target.value)}
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
            <Flex
              boxSize="34px"
              borderRadius="4px"
              borderWidth="1px"
              borderColor="#A9A9B2"
              _hover={{ cursor: "pointer" }}
              bg={color}
              onClick={() => {
                dispatch(getRecentColor(color))
                setBackgroundColor(color)
              }}
              key={index}
            ></Flex>
          )
        })}
      </Grid>
      <Flex flexDir="column" gap="10px">
        <Flex sx={{ fontSize: "14px" }}>DEFAULT COLORS</Flex>
        <Grid gap="8PX" templateColumns="repeat(7, 1fr)">
          {DEFAULT_COLORS.map((color) => (
            <Box
              onClick={() => {
                dispatch(getRecentColor(color))
                setBackgroundColor(color)
              }}
              key={color}
              boxSize="34px"
              borderRadius="4px"
              borderWidth="1px"
              borderColor="#A9A9B2"
              _hover={{ cursor: "pointer" }}
              bg={color}
            ></Box>
          ))}
          <Flex></Flex>
        </Grid>
      </Flex>
    </Flex>
  )
}
