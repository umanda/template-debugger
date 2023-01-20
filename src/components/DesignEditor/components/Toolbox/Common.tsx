import React from "react"
import { Box, Button, Flex, IconButton } from "@chakra-ui/react"
import { useActiveObject, useActiveScene, useEditor } from "@layerhub-pro/react"
import { Popover, PopoverTrigger, PopoverContent } from "@chakra-ui/react"
import AlignTop from "../../../Icons/AlignTop"
import AlignMiddle from "../../../Icons/AlignMiddle"
import AlignBottom from "../../../Icons/AlignBottom"
import AlignLeft from "../../../Icons/AlignLeft"
import AlignCenter from "../../../Icons/AlignCenter"
import AlignRight from "../../../Icons/AlignRight"
import LayerForward from "../../../Icons/LayerForward"
import LayerToFront from "../../../Icons/LayerToFront"
import LayerToBack from "../../../Icons/LayerToBack"
import LayerBackward from "../../../Icons/LayerBackward"
import FlipHorizontal from "../../../Icons/FlipHorizontal"
import FlipVertical from "../../../Icons/FlipVertical"

export default function Common() {
  const [state, setState] = React.useState({ isGroup: false, isMultiple: false })
  const activeObject = useActiveObject() as any
  const editor = useEditor()
  const activeScene = useActiveScene()

  React.useEffect(() => {
    if (activeObject) {
      setState({ isGroup: activeObject.type === "group", isMultiple: activeObject.type === "activeSelection" })
    }
  }, [activeObject])

  React.useEffect(() => {
    let watcher = async () => {
      if (activeObject) {
        // @ts-ignore
        setState({ isGroup: activeObject.type === "group", isMultiple: activeObject.type === "activeSelection" })
      }
    }
    if (editor) {
      editor.on("history:changed", watcher)
    }
    return () => {
      if (editor) {
        editor.off("history:changed", watcher)
      }
    }
  }, [editor, activeObject])

  return (
    <Flex gap={"0.5rem"}>
      <CommonFlip />
      <CommonAlignment />
      {(state.isGroup || !state.isMultiple) && <CommonOrder />}
      {state.isGroup ? (
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => {
            activeScene.objects.ungroup()
            setState({ ...state, isGroup: false })
          }}
        >
          Ungroup
        </Button>
      ) : state.isMultiple ? (
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => {
            activeScene.objects.group()
            setState({ ...state, isGroup: true })
          }}
        >
          Group
        </Button>
      ) : null}
    </Flex>
  )
}

function CommonAlignment() {
  const editor = useEditor()
  const activeScene = useActiveScene()
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button variant={"outline"} size={"sm"}>
          Aligment
        </Button>
      </PopoverTrigger>
      <PopoverContent
        sx={{
          background: "#FFFFFF",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.5rem",
          padding: "1rem",
          width: "280px"
        }}
      >
        <Box sx={{ display: "grid", flexDirection: "column", gap: "0.5rem" }}>
          <Button
            variant={"outline"}
            justifyContent={"flex-start"}
            size="sm"
            leftIcon={<AlignTop size={24} />}
            onClick={() => activeScene.objects.alignTop()}
          >
            Top
          </Button>

          <Button
            variant={"outline"}
            justifyContent={"flex-start"}
            size="sm"
            leftIcon={<AlignMiddle size={24} />}
            onClick={() => activeScene.objects.alignMiddle()}
          >
            Middle
          </Button>

          <Button
            variant={"outline"}
            justifyContent={"flex-start"}
            size="sm"
            leftIcon={<AlignBottom size={24} />}
            onClick={() => activeScene.objects.alignBottom()}
          >
            Bottom
          </Button>
        </Box>
        <Box sx={{ display: "grid", flexDirection: "column", gap: "0.5rem" }}>
          <Button
            variant={"outline"}
            justifyContent={"flex-start"}
            size="sm"
            leftIcon={<AlignLeft size={24} />}
            onClick={() => activeScene.objects.alignLeft()}
          >
            Left
          </Button>

          <Button
            variant={"outline"}
            justifyContent={"flex-start"}
            size="sm"
            leftIcon={<AlignCenter size={24} />}
            onClick={() => activeScene.objects.alignCenter()}
          >
            Center
          </Button>

          <Button
            variant={"outline"}
            justifyContent={"flex-start"}
            size="sm"
            leftIcon={<AlignRight size={24} />}
            onClick={() => activeScene.objects.alignRight()}
          >
            Right
          </Button>
        </Box>
      </PopoverContent>
    </Popover>
  )
}

function CommonOrder() {
  const editor = useEditor()
  const activeScene = useActiveScene()
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button variant={"outline"} size={"sm"}>
          Order
        </Button>
      </PopoverTrigger>
      <PopoverContent
        sx={{
          background: "#FFFFFF",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.5rem",
          padding: "1rem",
          width: "280px"
        }}
      >
        <Box sx={{ display: "grid", flexDirection: "column", gap: "0.5rem" }}>
          <Button
            variant={"outline"}
            justifyContent={"flex-start"}
            size="sm"
            leftIcon={<LayerToFront size={24} />}
            onClick={() => activeScene.objects.bringToFront()}
          >
            To Front
          </Button>

          <Button
            variant={"outline"}
            justifyContent={"flex-start"}
            size="sm"
            leftIcon={<LayerForward size={24} />}
            onClick={() => activeScene.objects.bringForward()}
          >
            Forward
          </Button>
        </Box>
        <Box sx={{ display: "grid", flexDirection: "column", gap: "0.5rem" }}>
          <Button
            variant={"outline"}
            justifyContent={"flex-start"}
            size="sm"
            leftIcon={<LayerToBack size={24} />}
            onClick={() => activeScene.objects.sendToBack()}
          >
            To Back
          </Button>
          <Button
            variant={"outline"}
            justifyContent={"flex-start"}
            size="sm"
            leftIcon={<LayerBackward size={24} />}
            onClick={() => activeScene.objects.sendBackwards()}
          >
            Backward
          </Button>
        </Box>
      </PopoverContent>
    </Popover>
  )
}

function CommonFlip() {
  const activeObject = useActiveObject() as any
  const [state, setState] = React.useState({ flipX: false, flipY: false })
  const activeScene = useActiveScene()
  React.useEffect(() => {
    if (activeObject) {
      setState({
        flipX: activeObject.flipX,
        flipY: activeObject.flipY
      })
    }
  }, [activeObject])

  const flipHorizontally = React.useCallback(() => {
    activeScene.objects.update({ flipX: !state.flipX })
    setState({ ...state, flipX: !state.flipX })
  }, [activeScene, state])

  const flipVertically = React.useCallback(() => {
    activeScene.objects.update({ flipY: !state.flipY })
    setState({ ...state, flipY: !state.flipY })
  }, [activeScene, state])

  return (
    <Flex gap={"0.5rem"}>
      <IconButton
        variant={"outline"}
        onClick={flipHorizontally}
        aria-label="flip horizontal"
        icon={<FlipHorizontal size={24} />}
      />
      <IconButton
        variant={"outline"}
        onClick={flipVertically}
        aria-label="flip horizontal"
        icon={<FlipVertical size={24} />}
      />
    </Flex>
  )
}
