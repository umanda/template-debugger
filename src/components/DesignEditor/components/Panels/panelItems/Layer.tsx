import React, { useCallback, useEffect, useState } from "react"
import { Box, Button, Center, Flex, IconButton, Image, Spacer } from "@chakra-ui/react"
import { useActiveObject, useActiveScene, useObjects } from "@layerhub-pro/react"
import Lock from "../../../../Icons/Lock"
import Unlock from "../../../../Icons/Unlock"
import Trash from "../../../../Icons/Trash"
import Drag from "../../../../Icons/Drag"
import Eye from "../../../../Icons/Eye"
import Scrollable from "../../../../utils/Scrollable"
import Eye_hide from "../../../../Icons/Eye_hide"
import CircleUp from "../../../../Icons/CircleUp"
import CircleDown from "../../../../Icons/CircleDown"
import Pencil from "../../../../Icons/Pencil"
import LetterUpperCase from "../../../../Icons/LetterUpperCase"
import useResourcesContext from "../../../../hooks/useResourcesContext"

export default function Layer() {
  const [objects, setObjects] = useState<any[]>([])
  const activeScene: any = useActiveScene()
  const activeObject = useActiveObject()
  const { order } = useResourcesContext()

  useEffect(() => {
    setObjects(activeScene.layers.filter((e: any) => e.name !== "Initial Frame" && e.name !== "Custom").reverse())
  }, [activeScene, activeObject, order])

  return (
    <Box h="full" sx={{ width: "320px", borderRight: "1px solid #DDDFE5", padding: ".5rem" }}>
      {objects.length === 0 && (
        <Center w="full" h="full">
          No layer found
        </Center>
      )}
      <Flex flexDirection="column" w="full" h="full">
        <Scrollable autoHide={true}>
          {objects.map((object, index) => (
            <LayerItem
              setObjects={setObjects}
              locked={object.locked}
              key={index}
              id={object.id}
              name={object.name}
              visible={object.visible}
            />
          ))}
        </Scrollable>
      </Flex>
    </Box>
  )

  interface Props {
    name: string
    visible: boolean
    locked: boolean
    id: string
    setObjects?: React.Dispatch<React.SetStateAction<any[]>>
  }

  interface State extends Props {}

  function LayerItem({ name, visible, id, locked, setObjects }: Props) {
    const activeScene = useActiveScene()
    const object: any = activeScene.objects.findById(id)
    const activeObject: any = useActiveObject()
    const [stateIcon, setStateIcon] = React.useState({ lock: object[0]?.locked, eye: object[0]?.visible })
    const [state, setState] = React.useState<State>({
      name,
      visible,
      id,
      locked
    })

    const handlevisibilityLayer = useCallback(() => {
      activeScene.objects.update({ visible: !state.visible }, id)
      setState({ ...state, visible: !state.visible })
    }, [activeScene, state, id, visible])

    const handleLockLayer = useCallback(() => {
      const object: any = activeScene.objects.findById(id)
      setStateIcon({ ...state, lock: !stateIcon.lock, eye: stateIcon.eye })
      if (object[0].locked) {
        activeScene.objects.unlock(id)
      } else {
        activeScene.objects.lock(id)
      }
    }, [stateIcon, activeScene, state, id])

    const handleRemoveLayer = useCallback(() => {
      activeScene.objects.removeById(id)
      //@ts-ignore
      setObjects(activeScene.layers.filter((e: any) => e.name !== "Custom"))
    }, [id, activeScene])

    const IconEye = useCallback(() => {
      if (stateIcon.eye) {
        return <Eye size={24} />
      } else {
        return <Eye_hide size={24} />
      }
    }, [stateIcon.eye])

    function IconLock() {
      if (stateIcon.lock) {
        return <Lock size={24} />
      } else {
        return <Unlock size={24} />
      }
    }

    const handleFront = useCallback(() => {
      activeScene.objects.bringForward(id)
      setObjects(activeScene.layers.filter((e: any) => e.name !== "Initial Frame" && e.name !== "Custom").reverse())
    }, [activeScene, id])

    const handleBack = useCallback(() => {
      activeScene.objects.sendBackwards(id)
      setObjects(activeScene.layers.filter((e: any) => e.name !== "Initial Frame" && e.name !== "Custom").reverse())
    }, [activeScene, id])

    return (
      <Flex
        draggable={true}
        sx={{ alignItems: "center", height: "32px" }}
        marginRight="10px"
        visibility={name === "Custom" ? "hidden" : "visible"}
        position={name === "Custom" ? "absolute" : "relative"}
      >
        <IconButton size="xs" aria-label="Search database" variant={"ghost"} icon={<Drag size={24} />} />
        {object[0]?.type === "StaticVector" ? (
          <Center
            borderRadius="md"
            sx={{
              alignItems: "center",
              display: "flex",
              ":hover": {
                backgroundColor: "brand.50",
                cursor: "pointer",
                color: "brand.500"
              }
            }}
          >
            <Image w="30px" h="30px" maxH="40px" maxW="40px" src={object[0].src} alt="Resource" />
          </Center>
        ) : object[0]?.type === "StaticText" ? (
          <IconButton size="30px" aria-label="Search database" variant={"ghost"} icon={<LetterUpperCase size={24} />} />
        ) : (
          <IconButton size="30px" aria-label="Search database" variant={"ghost"} icon={<Pencil size={24} />} />
        )}
        <Flex w="full" alignItems={"center"}>
          <Button
            size="xs"
            variant="ghost"
            w="full"
            onClick={() => activeScene.objects.select(id)}
            justifyContent="left"
            fontSize="14px"
            fontWeight={activeObject?.id === id ? "extrabold" : "light"}
          >
            {
              object[0]?.name === "StaticText"
                ? String(object[0]?.text).length <= 12
                  ? object[0]?.text
                  : `${object[0]?.text.substr(0, 12)}...`
                : name

              // name === undefined
              //   ? "Draw"
              //   : object[0]?.name === "StaticText"
              //   ? `${object[0]?.text.substr(0, 12)}...`
              //   : name
            }
          </Button>
        </Flex>
        <Spacer />
        <IconButton onClick={handleFront} size="xs" aria-label="Up" variant={"ghost"} icon={<CircleUp size={15} />} />
        <IconButton onClick={handleBack} size="xs" aria-label="Up" variant={"ghost"} icon={<CircleDown size={15} />} />
        <IconButton
          size="xs"
          onClick={handleLockLayer}
          aria-label="Search database"
          variant={"ghost"}
          icon={<IconLock />}
        />
        <IconButton size="xs" onClick={handlevisibilityLayer} aria-label="Eye" variant={"ghost"} icon={<IconEye />} />
        <IconButton
          size="xs"
          onClick={handleRemoveLayer}
          aria-label="Search database"
          variant={"ghost"}
          icon={<Trash size={24} />}
        />
      </Flex>
    )
  }
}
