import { Flex, Image as CImage, Skeleton } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
const backend: string = import.meta.env.VITE_API_CONNECTION

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
        <CImage
          sx={style}
          src={
            backend?.includes("https://api.drawify.net")
              ? "https://project-drawify-v2.s3.eu-west-3.amazonaws.com/error_page/not_found_403.png"
              : "https://segregate-drawify-images.s3.eu-west-3.amazonaws.com/error_page/not_found_403.png"
          }
        />
      )}
    </Flex>
  )
}
