import Scrollbars from "@layerhub-io/react-custom-scrollbar"
import React from "react"
import { Flex } from "@chakra-ui/react"
import { Scrollbars as ScrollHorizontalbars } from "react-custom-scrollbars"

export default function Scrollable({ children, autoHide }: { children: React.ReactNode; autoHide?: boolean }) {
  return (
    <Flex position="relative" h="full">
      <Scrollbars autoHide={autoHide}>{children}</Scrollbars>
    </Flex>
  )
}

export function ScrollableHorizontal({ children, autoHide }: { children: React.ReactNode; autoHide?: boolean }) {
  return (
    <Flex position="relative" h="full" w="full" flexDir="column">
      <ScrollHorizontalbars
        renderScrollbarHorizontal={(props) => <div {...props} className="scrollbar-horizontal" />}
        autoHide={autoHide}
      >
        {children}
      </ScrollHorizontalbars>
    </Flex>
  )
}
