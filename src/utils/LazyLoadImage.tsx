import { Flex, Image as CImage, Skeleton } from "@chakra-ui/react"
import React from "react"

export default function LazyLoadImage({ url, style = {} }: { url: string; style?: React.CSSProperties }) {
  const [state, setState] = React.useState<{ image: HTMLImageElement | null }>({ image: null })

  React.useEffect(() => {
    const image = new Image()
    image.src = url
    image.onload = () => {
      setTimeout(() => {
        setState({ image: image })
      }, 1000)
    }
  }, [])

  return (
    <Flex justify="center" h="full" w="full">
      {state.image ? <CImage sx={style} src={url} /> : <Skeleton isLoaded={false} height="full" width="full" />}
    </Flex>
  )
}
