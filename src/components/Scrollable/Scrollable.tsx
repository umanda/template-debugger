import Scrollbars from "@layerhub-io/react-custom-scrollbar"
import React from "react"
import { Flex } from "@chakra-ui/react"

export default function Scrollable({ children, autoHide }: { children: React.ReactNode; autoHide?: boolean }) {
  return (
    <Flex position="relative" h="full">
      <Scrollbars autoHide={autoHide}>{children}</Scrollbars>
    </Flex>
  )
}
