import { Flex, Image as CImage, Skeleton } from "@chakra-ui/react"
import React, { useCallback } from "react"

export default function LazyLoadImage({
  url,
  urlBack,
  style = {}
}: {
  url: string
  urlBack?: string
  style?: React.CSSProperties
}) {
  const [state, setState] = React.useState<{ image: HTMLImageElement | null }>({ image: null })
  const [load, setLoad] = React.useState<boolean>(false)

  React.useEffect(() => {
    initialState()
  }, [])

  const initialState = useCallback(async () => {
    const image = new Image()
    try {
      image.src = url
      console.log(image)
    } catch {
      image.src = urlBack
      console.log(image)
    }
    image.onload = async () => {
      setTimeout(() => {
        setState({ image: image })
      }, 1000)
    }
    setLoad(true)
  }, [])

  return (
    <Flex justify="center" h="full" w="full">
      {load ? <CImage sx={style} src={url} /> : <Skeleton isLoaded={load} height="full" width="full" />}
    </Flex>
  )
}
