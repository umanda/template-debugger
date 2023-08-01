import {
  Button,
  Center,
  Flex,
  Grid,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure
} from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { selectListDrawifiers } from "~/store/user/selector"
import Scrollable from "../Scrollable"
import { DEFAULT_ORDER } from "~/constants/consts"
import Filter from "../Icons/Filter"

export default function Order({
  setResources,
  setFetching,
  order,
  setDrawifier,
  setSkeleton,
  setOrder,
  drawifier,
  setPage
}: {
  setResources: any
  setFetching: React.Dispatch<React.SetStateAction<boolean>>
  order: string[]
  setDrawifier: React.Dispatch<React.SetStateAction<string[]>>
  setSkeleton: React.Dispatch<React.SetStateAction<boolean>>
  setOrder: React.Dispatch<React.SetStateAction<string[]>>
  drawifier: string[]
  setPage?: React.Dispatch<React.SetStateAction<number>>
}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  // const { isOpen: isOpenDrawifier, onOpen: onOpenDrawifier, onClose: onCloseDrawifier } = useDisclosure()
  // const [drawifiers, setDrawifiers] = useState<any[]>([useSelector(selectListDrawifiers)])
  const listDrawifiers = useSelector(selectListDrawifiers)
  const getListDraw = async () => {}
  const [id, setId] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [value, setValue] = useState<string>("")

  // useEffect(() => {
  //   listDrawifiers ? setDrawifiers(listDrawifiers) : getListDraw()
  // }, [getListDraw])

  useEffect(() => {
    order[0] === "ALPHABETIC" && setValue("A - Z")
    drawifier[0] === undefined && setName("")
  }, [isOpen])

  useEffect(() => {
    name === "" && setId("")
    // name === "" && onCloseDrawifier()
  }, [name])

  const orderByStats = () => {
    setSkeleton(false)
    setPage && setPage(0)
    id !== "" ? setDrawifier([id]) : setDrawifier([])
    if (value === "A - Z") {
      setOrder(["ALPHABETIC"])
    } else if (value === "Most recent") {
      setOrder(["NEWEST"])
    } else if (value === "Most favorites") {
      setOrder(["LIKED"])
    } else if (value === "Most downloads") {
      setOrder(["DOWNLOADED"])
    }
    setResources([])
    setFetching(true)
    setSkeleton(true)
  }

  return (
    <Popover returnFocusOnClose={false} isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement="right-end">
      <PopoverTrigger>
        <IconButton size="sm" aria-label="Close" variant="outline" icon={<Filter size={22} />} />
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverBody>
            <Flex flexDir="column" gap="10px">
              <Text color="#A9A9B2" fontSize="12px">
                ORDER BY STATS
              </Text>
              <Grid templateColumns="repeat(1, 1fr)" gap="10px">
                <RadioGroup onChange={setValue}>
                  <Stack spacing={5}>
                    {DEFAULT_ORDER.map((value: any, index: number) => (
                      <Radio
                        size="sm"
                        isDisabled={value === "Most downloads" || value === "A - Z" ? true : false}
                        value={value}
                        key={index}
                      >
                        {value}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </Grid>
              <Button
                bg="#5456F5"
                onClick={() => {
                  onClose()
                  orderByStats()
                }}
                _hover={{}}
                color="#DDDFE5"
              >
                Filter
              </Button>
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

export function FilterByDrawifier({
  setId,
  listDrawifiers,
  setName,
  name,
  onClose
}: {
  setId: any
  listDrawifiers: any
  setName: any
  name: string
  onClose: () => void
}) {
  const [multiplicate, setMultiplicate] = useState<number>(0)
  const [content, setContent] = useState(true)

  useEffect(() => {
    setMultiplicate(1)
  }, [name])

  useEffect(() => {
    setContent(true)
    let cont = 0
    listDrawifiers?.drawifiers?.map((drawifier: any, index: number) => {
      if (`${drawifier.first_name} ${drawifier.last_name}`.toLowerCase().includes(name.toLowerCase())) {
        cont = cont + 1
        setMultiplicate(cont + 1)
      }
    })
    cont === 0 && setContent(false)
  }, [name])

  return (
    <Flex
      flexDir="column"
      maxH="165px"
      h={content ? `${33 * multiplicate - 33}px` : "33px"}
      visibility={name === "" ? "hidden" : "visible"}
      zIndex="999"
    >
      <Scrollable autoHide={true}>
        <Flex flexDir="column">
          {listDrawifiers?.drawifiers?.map((drawifier: any, index: number) => {
            if (`${drawifier.first_name} ${drawifier.last_name}`.toLowerCase().includes(name.toLowerCase())) {
              return (
                <Button
                  size="sm"
                  variant="outline"
                  key={index}
                  onClick={() => {
                    onClose()
                    setName(`${drawifier.first_name} ${drawifier.last_name}`)
                    setId(drawifier.id)
                  }}
                >
                  {`${drawifier.first_name} ${drawifier.last_name}`}
                </Button>
              )
            }
          })}
          {!content && (
            <Center onClick={onClose} h="full" w="full" fontSize="15px" fontFamily="Outfit">
              No registered drawifiers
            </Center>
          )}
        </Flex>
      </Scrollable>
    </Flex>
  )
}
