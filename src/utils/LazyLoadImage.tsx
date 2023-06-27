import { Flex, Image as CImage, Skeleton } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"

export default function LazyLoadImage({ url, style = {} }: { url: string; style?: React.CSSProperties }) {
  const [state, setState] = useState<{ image: HTMLImageElement | null }>({ image: null })
  const [imageExists, setImageExists] = useState(true)

  useEffect(() => {
    const image = new Image()
    image.src = url
    image.onload = () => {
      setTimeout(() => {
        setState({ image: image })
        setImageExists(true)
      }, 500)
    }
    image.onerror = () => {
      setImageExists(false)
    }
  }, [url])

  return (
    <Flex justify="center" h="full" w="full">
      {imageExists ? (
        <CImage sx={style} src={url} />
      ) : (
        <CImage sx={style} src={"https://dev-drawify-v3.s3.eu-west-3.amazonaws.com/main/error.png"} />
      )}
    </Flex>
  )
}
