import { Box, Flex, Grid, Spacer } from "@chakra-ui/react"
import Common from "./Common"

export default function Vector() {
  return (
    <Flex flex={1} alignItems={"center"} justifyContent={"space-between"}>
      <Spacer />
      <Box>
        <Common />
      </Box>
    </Flex>
  )
}
