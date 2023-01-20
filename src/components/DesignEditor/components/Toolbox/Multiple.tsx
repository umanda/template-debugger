import { Box, Flex } from "@chakra-ui/react"
import Common from "./Common"

export default function Multiple() {
  return (
    <Flex flex={1} alignItems={"center"} justifyContent={"space-between"}>
      <Box>Multiple</Box>
      <Box>
        <Common />
      </Box>
    </Flex>
  )
}
