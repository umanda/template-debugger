import React, { useCallback, useEffect, useState } from "react"
import { Box, Button, Center, Flex, IconButton, Spacer } from "@chakra-ui/react"
import { useActiveScene, useObjects } from "@layerhub-pro/react"
import Lock from "../../../../Icons/Lock"
import Unlock from "../../../../Icons/Unlock"
import Images from "../../../../Icons/Images"
import Trash from "../../../../Icons/Trash"
import Drag from "../../../../Icons/Drag"
import Eye from "../../../../Icons/Eye"
import Scrollable from "../../../../utils/Scrollable"
import Eye_hide from "../../../../Icons/Eye_hide"

export default function Layer() {
  const [objects, setObjects] = useState<any[]>([])
  const activeScene: any = useActiveScene()
  const object = useObjects()

  useEffect(() => {
    setObjects(activeScene.layers.filter((e: any) => e.name !== "Initial Frame" && e.name !== "Custom"))
  }, [activeScene, object])

  return (
    <Box h="full" sx={{ width: "320px" }}>
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
    const activeScene: any = useActiveScene()
    const object: any = activeScene.objects.findById(id)
    const [stateIcon, setStateIcon] = React.useState({ lock: object[0]?.locked, eye: object[0].visible })
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

    return (
      <Flex
        sx={{ alignItems: "center", height: "32px" }}
        marginRight="10px"
        visibility={name === "Custom" ? "hidden" : "visible"}
        position={name === "Custom" ? "absolute" : "relative"}
      >
        <IconButton size="xs" aria-label="Search database" variant={"ghost"} icon={<Drag size={24} />} />
        <IconButton
          size="xs"
          aria-label="Search database"
          onClick={() => activeScene.objects.select(id)}
          variant={"ghost"}
          icon={<Images size={22} />}
        />
        <Flex w="full" alignItems={"center"}>
          <Button
            size="xs"
            variant="ghost"
            w="full"
            onClick={() => activeScene.objects.select(id)}
            justifyContent="left"
            fontSize="14px"
          >
            {name === undefined ? "Draw" : name}
          </Button>
        </Flex>
        <Spacer />
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
