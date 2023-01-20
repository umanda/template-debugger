import { Box, Flex, Popover, PopoverContent, PopoverTrigger, Portal } from "@chakra-ui/react"
import { useActiveObject, useActiveScene, useEditor } from "@layerhub-pro/react"
import { throttle } from "lodash"
import { useEffect, useRef, useState } from "react"
import { HexColorPicker } from "react-colorful"
import groupBy from "lodash/groupBy"
import Plus from "../../../../Icons/Plus"

interface State {
  colors: string[]
  flipX: boolean
  flipY: boolean
}

const initialState: State = {
  colors: [],
  flipX: false,
  flipY: false
}

export default function StaticVector() {
  const editor = useEditor()
  const activeObject = useActiveObject() as any
  const [state, setState] = useState<State>(initialState)
  const vectorPaths = useRef<any>({})

  useEffect(() => {
    if (activeObject) {
      if (activeObject._objects) {
        //@ts-ignore
        const objects = activeObject._objects[0]._objects
        const objectColors = groupBy(objects, "fill")
        vectorPaths.current = objectColors
        setState({ ...state, colors: Object.keys(objectColors) })
      }
    }
  }, [activeObject])

  const changeBackgroundColor = (next: any, prev: any, index: any) => {
    const current: any[] = vectorPaths.current[prev]
    if (current) {
      current.forEach((c) => {
        c.fill = next
      })
      const currentColors = [...state.colors]
      currentColors[index] = next
      setState({ ...state, colors: currentColors })
      vectorPaths.current[next] = current
    }
    editor.canvas.requestRenderAll()
  }

  return (
    <Box fontFamily="Outfit" fontSize="12px" sx={{ width: "320px" }}>
      <Flex color="#A9A9B2">ILLUSTRATION COLOR</Flex>
      <Flex gap="0.25rem" padding="0 1rem">
        {state.colors.map((c, index) => {
          return (
            <Popover key={index}>
              <PopoverTrigger>
                <div>
                  <Flex background={c} _hover={{ cursor: "pointer" }} boxSize="30px" borderRadius="20%" />
                </div>
              </PopoverTrigger>
              <Portal>
                <PopoverContent w="50px">
                  <div
                    style={{
                      padding: "1rem",
                      background: "#ffffff",
                      width: "200px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                      textAlign: "center"
                    }}
                  >
                    <HexColorPicker
                      onChange={(color) => {
                        changeBackgroundColor(color, c, index)
                      }}
                    />
                  </div>
                </PopoverContent>
              </Portal>
            </Popover>
          )
        })}
      </Flex>
      <Flex color="#A9A9B2">RECENT COLOR</Flex>
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
      <Flex color="#A9A9B2">PALETTES</Flex>
    </Box>
  )
}

function BoxColor({ boxColor }: { boxColor: string }) {
  const activeObject = useActiveObject() as any
  const activeScene = useActiveScene()
  const updateObjectFill = throttle((color: string) => {
    if (activeObject) {
      activeScene.objects.update({ fill: color })
    }
  }, 100)
  return (
    <Flex
      background={boxColor}
      onClick={() => updateObjectFill(boxColor)}
      _hover={{ cursor: "pointer" }}
      boxSize="30px"
      borderRadius="20%"
    />
  )
}
