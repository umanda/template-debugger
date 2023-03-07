import React, { useCallback, useEffect, useState } from "react"
import { Box, Button, Center, Flex, Grid, GridItem, IconButton, Image, List, ListItem, Spacer } from "@chakra-ui/react"
import { useActiveObject, useActiveScene, useObjects } from "@layerhub-pro/react"
import Lock from "~/components/Icons/Lock"
import Unlock from "~/components/Icons/Unlock"
import Trash from "~/components/Icons/Trash"
import Drag from "~/components/Icons/Drag"
import Eye from "~/components/Icons/Eye"
import Scrollable from "~/components/Scrollable/Scrollable"
import Eye_hide from "~/components/Icons/Eye_hide"
import CircleUp from "~/components/Icons/CircleUp"
import CircleDown from "~/components/Icons/CircleDown"
import Pencil from "~/components/Icons/Pencil"
import LetterUpperCase from "~/components/Icons/LetterUpperCase"
import useResourcesContext from "~/hooks/useResourcesContext"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

export default function Layer() {
  const [objects, setObjects] = useState<any[]>([])
  const activeScene = useActiveScene()
  const activeObject: any = useActiveObject()
  const { order } = useResourcesContext()
  const [indexDrag, setIndexDrag] = useState<number | null>(null)
  const [changeOrder, setChangeOrder] = useState<{
    cont: number | null
    to: "front" | "back" | null
    id: string | null
  }>({
    cont: null,
    to: null,
    id: null
  })

  useEffect(() => {
    changeOrder.to !== null && handleChangeOrder()
  }, [changeOrder.cont])

  useEffect(() => {
    setObjects(activeScene.layers.filter((e: any) => e.name !== "Initial Frame" && e.name !== "Custom").reverse())
  }, [activeScene, activeObject, order])

  const handleChangeOrder = useCallback(() => {
    if (changeOrder.to === "front") {
      activeScene.layers.map((e, index) => {
        if (index < changeOrder.cont) {
          setTimeout(async () => activeScene.objects.bringForward(changeOrder.id), 100)
        }
      })
    } else if (changeOrder.to === "back") {
      activeScene.layers.map((e, index) => {
        if (index < changeOrder.cont) {
          setTimeout(() => activeScene.objects.sendBackwards(changeOrder.id), 100)
        }
      })
    }
    setChangeOrder({ ...changeOrder, to: null })
  }, [changeOrder, activeScene])

  const reorder = (list, startIndex, endIndex) => {
    const resource = activeScene?.layers
      ?.filter((e: any) => e.name !== "Initial Frame" && e.name !== "Custom")
      ?.reverse()[startIndex]
    if (startIndex - endIndex > 0) {
      setChangeOrder({
        cont: startIndex - endIndex,
        to: "front",
        id: resource?.id
      })
    } else if (startIndex - endIndex < 0) {
      setChangeOrder({
        cont: endIndex - startIndex,
        to: "back",
        id: resource?.id
      })
    }
    const result = [...list]
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }

  return (
    <Flex h="full" width="300px" padding="0.5rem">
      {objects.length === 0 ? (
        <Center w="full" h="full">
          No layer found
        </Center>
      ) : (
        <Flex w="320px" h="full">
          <DragDropContext
            onDragEnd={(result) => {
              const { source, destination } = result
              if (!destination) return
              if (source.index === destination.index && source.droppableId === destination.droppableId) {
                return
              }
              setObjects((prevTasks) => reorder(prevTasks, source.index, destination.index))
            }}
          >
            <Flex w="full" h="full" flexDir="column">
              <Scrollable autoHide={true}>
                <Droppable droppableId="key">
                  {(droppableProvided) => (
                    <List w="full" {...droppableProvided.droppableProps} ref={droppableProvided.innerRef}>
                      {objects.map((object, index) => (
                        <Draggable key={index} draggableId={String(index)} index={index}>
                          {(draggableProvided) => (
                            <ListItem
                              {...draggableProvided.draggableProps}
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.dragHandleProps}
                            >
                              <LayerItem
                                indexDrag={indexDrag}
                                setIndexDrag={setIndexDrag}
                                setObjects={setObjects}
                                locked={object.locked}
                                key={index}
                                id={object.id}
                                name={object.name}
                                visible={object.visible}
                                index={index}
                              />
                            </ListItem>
                          )}
                        </Draggable>
                      ))}
                      {droppableProvided.placeholder}
                    </List>
                  )}
                </Droppable>
              </Scrollable>
            </Flex>
          </DragDropContext>
        </Flex>
      )}
    </Flex>
  )

  interface Props {
    name: string
    visible: boolean
    locked: boolean
    id: string
    setObjects?: React.Dispatch<React.SetStateAction<any[]>>
    index?: number
    indexDrag?: number
    setIndexDrag?: React.Dispatch<React.SetStateAction<number | null>>
  }

  interface State extends Props {}

  function LayerItem({ name, visible, id, locked, setObjects, index, indexDrag, setIndexDrag }: Props) {
    const { order, setOrder } = useResourcesContext()
    const activeScene = useActiveScene()
    const object: any = activeScene.objects.findById(id)
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
      setOrder(!order)
    }, [activeScene, id, order])

    const handleBack = useCallback(() => {
      activeScene.objects.sendBackwards(id)
      setOrder(!order)
    }, [activeScene, id, order])

    return (
      <Flex
        w="full"
        alignItems="center"
        height="45px"
        paddingRight="20px"
        justify="center"
        flex={1}
        flexDir="column"
        visibility={name === "Custom" ? "hidden" : "visible"}
        position={name === "Custom" ? "relative" : "relative"}
        borderBottom="1px"
        borderColor="#e2e8f0"
        backgroundColor={activeObject?.id === object[0]?.id ? "#EDF2F7" : ""}
      >
        <Flex w="full">
          <IconButton
            onClick={() => activeScene.objects.select(id)}
            _hover={{ cursor: "grab" }}
            size="30px"
            aria-label="Search database"
            variant="ghost"
            icon={<Drag size={24} />}
          />
          {object[0]?.type === "StaticVector" ? (
            <Center
              onClick={() => activeScene.objects.select(id)}
              borderRadius="md"
              alignItems="center"
              display="flex"
              _hover={{}}
            >
              <Image w="30px" h="30px" maxH="40px" maxW="40px" src={object[0].src} alt="Resource" />
            </Center>
          ) : object[0]?.type === "StaticText" ? (
            <IconButton
              onClick={() => activeScene.objects.select(id)}
              _hover={{ cursor: "grab" }}
              size="30px"
              aria-label="Search database"
              variant="ghost"
              icon={<LetterUpperCase size={24} />}
            />
          ) : object[0]?.name === "group" ? (
            <Button
              onClick={() => activeScene.objects.select(id)}
              _hover={{ cursor: "grab" }}
              size="30px"
              aria-label="Search database"
              variant="ghost"
            >
              G
            </Button>
          ) : (
            <IconButton
              onClick={() => activeScene.objects.select(id)}
              _hover={{ cursor: "grab" }}
              size="30px"
              aria-label="Search database"
              variant="ghost"
              icon={<Pencil size={24} />}
            />
          )}
          <Center
            onClick={() => activeScene.objects.select(id)}
            borderRadius="md"
            alignItems="center"
            display="flex"
            fontSize="12px"
            _hover={{}}
            marginLeft="10px"
            fontWeight={activeObject?.id === object[0]?.id ? "bold" : "normal"}
          >
            {object[0]?.name === "StaticText"
              ? String(object[0]?.text).length <= 12
                ? object[0]?.text
                : `${object[0]?.text.substr(0, 12)}...`
              : object[0]?.name === "StaticVector"
              ? "Illustration"
              : name}
          </Center>
          <Spacer />
          <IconButton
            onClick={handleFront}
            size="xs"
            aria-label="Up"
            variant={"ghost"}
            icon={<CircleUp size={15} />}
            color={"#A0AEC0"}
          />
          <IconButton
            onClick={handleBack}
            size="xs"
            aria-label="Up"
            variant={"ghost"}
            icon={<CircleDown size={15} />}
            color={"#A0AEC0"}
          />
          <IconButton
            size="xs"
            onClick={handleLockLayer}
            aria-label="Lock / Unlock"
            variant={"ghost"}
            icon={<IconLock />}
          />
          <IconButton size="xs" onClick={handlevisibilityLayer} aria-label="Eye" variant={"ghost"} icon={<IconEye />} />
          <IconButton
            size="xs"
            onClick={handleRemoveLayer}
            aria-label="Remove Element"
            variant={"ghost"}
            icon={<Trash size={24} />}
          />
        </Flex>
      </Flex>
    )
  }
}
