import { Box, Button, Center, Flex, HStack, IconButton, Input, PopoverArrow, useDisclosure } from "@chakra-ui/react"
import React, { useCallback } from "react"
import { useActiveObject, useActiveScene, useEditor, useScenes } from "@layerhub-pro/react"
import Common from "./Common"
import { Popover, PopoverTrigger, PopoverContent } from "@chakra-ui/react"
import Scrollbar from "@layerhub-io/react-custom-scrollbar"
import { useSelector } from "react-redux"
import { IStaticText } from "@layerhub-pro/types"
import Bold from "../../../Icons/Bold"
import Italic from "../../../Icons/Italic"
import Underline from "../../../Icons/Underline"
import LetterMixedCase from "../../../Icons/LetterMixedCase"
import LetterUpperCase from "../../../Icons/LetterUpperCase"
import LetterLowerCase from "../../../Icons/LetterLowerCase"
import TextAlignLeft from "../../../Icons/TextAlignLeft"
import TextAlignCenter from "../../../Icons/TextAlignCenter"
import TextAlignRight from "../../../Icons/TextAlignRight"
import TextAlignJustify from "../../../Icons/TextAlignJustify"
import Minus from "../../../Icons/Minus"
import Plus from "../../../Icons/Plus"
import { selectFonts } from "~/store/fonts/selector"
import { getTextProperties } from "~/utils/text"
import { loadFonts } from "~/utils/fonts"
import { FONT_SIZES, TEXT_ALIGNS } from "~/constants/consts"
import Down from "../../../Icons/Down"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"

export interface TextState {
  color: string
  bold: boolean
  italic: boolean
  underline: boolean
  family: string
  styleOptions: StyleOptions
}

interface StyleOptions {
  hasItalic: boolean
  hasBold: boolean
  options: any[]
}

export const initialOptions: TextState = {
  family: "CoreLang",
  bold: false,
  italic: false,
  underline: false,
  color: "#00000",
  styleOptions: {
    hasBold: true,
    hasItalic: true,
    options: []
  }
}

export default function Text() {
  const [state, setState] = React.useState<TextState>(initialOptions)
  const activeObject = useActiveObject() as Required<IStaticText>
  const editor = useEditor()
  const fonts = useSelector(selectFonts)
  const { setActiveMenu, colorText, setColorText, activeMenu, isSidebarVisible, setIsSidebarVisible } =
    useDesignEditorContext()
  const activeScene = useActiveScene()
  const scenes = useScenes()
  const [statePrevSidebar, setStatePrevSidebar] = React.useState<boolean>(true)

  React.useEffect(() => {
    if (activeObject && activeObject.type === "StaticText") {
      const textProperties = getTextProperties(activeObject, fonts)
      setState({ ...state, ...textProperties })
    }
  }, [activeObject, scenes])

  React.useEffect(() => {
    activeObject && setColorText(activeObject.fill)
  }, [activeObject])

  React.useEffect(() => {
    let watcher = async () => {
      if (activeObject && activeObject.type === "StaticText") {
        const textProperties = getTextProperties(activeObject, fonts)
        setState({ ...state, ...textProperties })
      }
    }
    if (editor) {
      editor.on("history:updated", watcher)
    }
    return () => {
      if (editor) {
        editor.off("history:updated", watcher)
      }
    }
  }, [editor, activeObject])

  const makeBold = React.useCallback(async () => {
    if (state.bold) {
      let desiredFont

      if (state.italic) {
        desiredFont = state.styleOptions.options.find((option) => {
          const postscriptnames = option.post_script_name.split("-")
          return postscriptnames[postscriptnames.length - 1].match(/^Italic$/)
        })
      } else {
        desiredFont = state.styleOptions.options.find((option) => {
          const postscriptnames = option.post_script_name.split("-")
          return postscriptnames[postscriptnames.length - 1].match(/^Regular$/)
        })
      }

      const font = {
        name: desiredFont.post_script_name,
        url: desiredFont.url
      }
      await loadFonts([font])

      activeScene.objects.updateText({
        fontFamily: desiredFont.post_script_name,
        fontURL: font.url
      })
      setState({ ...state, bold: false })
    } else {
      let desiredFont
      if (state.italic) {
        desiredFont = state.styleOptions.options.find((option) => {
          const postscriptnames = option.post_script_name.split("-")
          return postscriptnames[postscriptnames.length - 1].match(/^BoldItalic$/)
        })
      } else {
        desiredFont = state.styleOptions.options.find((option) => {
          const postscriptnames = option.post_script_name.split("-")
          return postscriptnames[postscriptnames.length - 1].match(/^Bold$/)
        })
      }

      const font = {
        name: desiredFont.post_script_name,
        url: desiredFont.url
      }
      await loadFonts([font])

      activeScene.objects.updateText({
        fontFamily: desiredFont.post_script_name,
        fontURL: font.url
      })
      setState({ ...state, bold: true })
    }
  }, [editor, state])

  const makeItalic = React.useCallback(async () => {
    if (state.italic) {
      let desiredFont
      if (state.bold) {
        desiredFont = state.styleOptions.options.find((option) => {
          const postscriptnames = option.post_script_name.split("-")
          return postscriptnames[postscriptnames.length - 1].match(/^Bold$/)
        })
      } else {
        desiredFont = state.styleOptions.options.find((option) => {
          const postscriptnames = option.post_script_name.split("-")
          return postscriptnames[postscriptnames.length - 1].match(/^Regular$/)
        })
      }
      const font = {
        name: desiredFont.post_script_name,
        url: desiredFont.url
      }
      await loadFonts([font])

      activeScene.objects.update({
        fontFamily: desiredFont.post_script_name,
        fontURL: font.url
      })
      setState({ ...state, italic: false })
    } else {
      let desiredFont

      if (state.bold) {
        desiredFont = state.styleOptions.options.find((option) => {
          const postscriptnames = option.post_script_name.split("-")
          return postscriptnames[postscriptnames.length - 1].match(/^BoldItalic$/)
        })
      } else {
        desiredFont = state.styleOptions.options.find((option) => {
          const postscriptnames = option.post_script_name.split("-")
          return postscriptnames[postscriptnames.length - 1].match(/^Italic$/)
        })
      }
      const font = {
        name: desiredFont.post_script_name,
        url: desiredFont.url
      }
      await loadFonts([font])

      activeScene.objects.updateText({
        fontFamily: desiredFont.post_script_name,
        fontURL: font.url
      })
      setState({ ...state, italic: true })
    }
  }, [editor, state])

  const makeUnderline = React.useCallback(() => {
    activeScene.objects.updateText({
      underline: !state.underline
    })
    setState({ ...state, underline: !state.underline })
  }, [editor, state])

  const changeSidebar = useCallback(
    (menu: string) => {
      if (activeMenu !== menu) {
        setActiveMenu(menu)
        setStatePrevSidebar(isSidebarVisible)
        setIsSidebarVisible(true)
      } else {
        setIsSidebarVisible(statePrevSidebar)
        setActiveMenu("")
      }
    },
    [isSidebarVisible, activeMenu, isSidebarVisible, statePrevSidebar]
  )

  return (
    <Flex flex={1} alignItems={"center"} justifyContent={"space-between"} gap="10px">
      <Flex gap={"0.5rem"} alignItems={"center"} w="full">
        <Flex
          boxSize="30px"
          background={colorText}
          _hover={{ cursor: "pointer" }}
          borderWidth="2px"
          borderStyle="solid"
          onClick={() => changeSidebar("TextColorPicker")}
        ></Flex>
        <Button
          onClick={() => changeSidebar("FontSelector")}
          variant={"outline"}
          size={"sm"}
          rightIcon={<Down size={24} />}
        >
          {state.family}
        </Button>
        <TextFontSize />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "30px 30px 30px",
            border: "1px solid #E2E8F0",
            borderRadius: "0.375rem",
            padding: "0 0.25rem"
          }}
        >
          <IconButton
            aria-label="Bold"
            isDisabled={!state.styleOptions.hasBold}
            onClick={makeBold}
            display={"flex"}
            alignItems={"center"}
            variant="ghost"
            icon={<Bold size={24} />}
          />
          <IconButton
            aria-label="Italic"
            isDisabled={!state.styleOptions.hasItalic}
            onClick={makeItalic}
            display={"flex"}
            alignItems={"center"}
            variant="ghost"
            icon={<Italic size={24} />}
          />
          <IconButton
            aria-label="Underline"
            onClick={makeUnderline}
            display={"flex"}
            alignItems={"center"}
            variant="ghost"
            icon={<Underline size={24} />}
          />
        </Box>

        <LetterCase />
        <TextAlign />
      </Flex>
      <Box>
        <Common />
      </Box>
    </Flex>
  )
}

function LetterCase() {
  const activeScene = useActiveScene()
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button variant={"outline"} size={"sm"}>
          <LetterMixedCase size={24} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        sx={{
          background: "#FFFFFF",
          display: "grid",
          gridTemplateColumns: " 40px 40px 40px",
          gap: "0.5rem",
          padding: "0.5rem",
          width: "auto"
        }}
      >
        <Button
          variant={"unstyled"}
          justifyContent={"center"}
          display={"flex"}
          alignItems={"center"}
          size="sm"
          onClick={() => activeScene.objects.toUppercase()}
        >
          <LetterUpperCase size={24} />
        </Button>
        <Button
          variant={"unstyled"}
          justifyContent={"center"}
          display={"flex"}
          alignItems={"center"}
          size="sm"
          onClick={() => activeScene.objects.toCapitalize()}
        >
          <LetterMixedCase size={24} />
        </Button>
        <Button
          variant={"unstyled"}
          justifyContent={"center"}
          display={"flex"}
          alignItems={"center"}
          size="sm"
          onClick={() => activeScene.objects.toLowerCase()}
        >
          <LetterLowerCase size={24} />
        </Button>
      </PopoverContent>
    </Popover>
  )
}

function TextAlign() {
  const activeScene = useActiveScene()
  const activeObject = useActiveObject()

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button variant={"outline"} size={"sm"}>
          <TextAlignLeft size={24} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        sx={{
          background: "#FFFFFF",
          display: "grid",
          gridTemplateColumns: "40px 40px 40px 40px",
          gap: "0.5rem",
          padding: "0.5rem",
          width: "200px"
        }}
      >
        <Button
          variant={"unstyled"}
          justifyContent={"center"}
          display={"flex"}
          alignItems={"center"}
          size="sm"
          onClick={() => {
            // @ts-ignore
            activeScene.objects.update({ textAlign: TEXT_ALIGNS[0] })
          }}
        >
          <TextAlignLeft size={24} />
        </Button>
        <Button
          variant={"unstyled"}
          justifyContent={"center"}
          display={"flex"}
          alignItems={"center"}
          size="sm"
          onClick={() => {
            // @ts-ignore
            activeScene.objects.update({ textAlign: TEXT_ALIGNS[1] })
          }}
        >
          <TextAlignCenter size={24} />
        </Button>
        <Button
          variant={"unstyled"}
          justifyContent={"center"}
          display={"flex"}
          alignItems={"center"}
          size="sm"
          onClick={() => {
            // @ts-ignore
            activeScene.objects.update({ textAlign: TEXT_ALIGNS[2] })
          }}
        >
          <TextAlignRight size={24} />
        </Button>
        <Button
          variant={"unstyled"}
          justifyContent={"center"}
          display={"flex"}
          alignItems={"center"}
          size="sm"
          onClick={() => {
            // @ts-ignore
            activeScene.objects.update({ textAlign: TEXT_ALIGNS[3] })
          }}
        >
          <TextAlignJustify size={24} />
        </Button>
      </PopoverContent>
    </Popover>
  )
}

function TextFontSize() {
  const activeObject: any = useActiveObject()
  let [value, setValue] = React.useState(12)
  const [prevValue, setPrevValue] = React.useState(value)
  const { isOpen, onToggle, onClose } = useDisclosure()
  const activeScene = useActiveScene()
  const scenes = useScenes()
  const ref = React.useRef<any>()
  const { setInputActive } = useDesignEditorContext()

  React.useEffect(() => {
    // @ts-ignore
    if (activeObject && activeObject.type === "StaticText") {
      // @ts-ignore
      setValue(Math.round(activeObject.fontSize))
      // @ts-ignore
      setPrevValue(Math.round(activeObject.fontSize))
    }
  }, [activeObject, scenes])

  const onChange = (size: number) => {
    activeScene.objects.updateText({ fontSize: size })
    setValue(size)
    setInputActive(false)
  }

  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "30px 30px 30px",
          border: "1px solid #E2E8F0",
          borderRadius: "0.375rem",
          padding: "0 0.25rem"
        }}
      >
        <Button
          isDisabled={activeObject?.isEditing == false || activeObject?.isEditing === undefined ? false : true}
          onClick={() => {
            onChange((value -= 1))
          }}
          display={"flex"}
          alignItems={"center"}
          size={"sm"}
          variant="unstyled"
        >
          <Minus size={24} />
        </Button>

        <Popover initialFocusRef={ref}>
          <PopoverTrigger>
            <HStack>
              <Input
                ref={ref}
                onBlur={(e) => onChange(Number(e.target.value))}
                onChange={(e: any) => setPrevValue(e.target.value)}
                onClick={onToggle}
                onKeyDown={(e) => e.code === "Enter" && ref.current.blur()}
                onFocus={() => setInputActive(true)}
                textAlign={"center"}
                variant={"unstyled"}
                value={prevValue}
                type="number"
                size={"sm"}
              />
            </HStack>
          </PopoverTrigger>
          <PopoverContent display="flex" w="auto">
            <PopoverArrow />
            <Scrollbar style={{ height: "320px", width: "90px" }}>
              <Flex flexDir="column" marginRight="10px" backgroundColor={"#ffffff"}>
                {FONT_SIZES.map((size: any, index: number) => (
                  <Center
                    onClick={() => {
                      onChange(size.label)
                      onClose()
                    }}
                    _hover={{
                      background: "rgb(243,243,243)"
                    }}
                    style={{
                      height: "32px",
                      fontSize: "14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center"
                    }}
                    key={index}
                  >
                    {size.label}
                  </Center>
                ))}
              </Flex>
            </Scrollbar>
          </PopoverContent>
        </Popover>

        <Button
          isDisabled={activeObject?.isEditing == false || activeObject?.isEditing === undefined ? false : true}
          onClick={() => {
            onChange((value += 1))
          }}
          display={"flex"}
          alignItems={"center"}
          size={"sm"}
          variant="unstyled"
        >
          <Plus size={24} />
        </Button>
      </Box>

      <Box
        sx={{
          border: "1px solid #E2E8F0",
          position: "absolute",
          top: "107px",
          marginLeft: "5px",
          borderRadius: "0.375rem",
          zIndex: "2"
        }}
      ></Box>
    </Box>
  )
}
