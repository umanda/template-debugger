import { Avatar, AvatarGroup, Flex, Stack, Text, useBreakpointValue } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { avatars } from "~/data/avatars"

function UsersGroup() {
  const [selectedAvatars, setSelectedAvatars] = useState([])

  // Function to shuffle array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  // Function to update selected avatars
  const updateSelectedAvatars = () => {
    // Shuffle the avatars array
    const shuffledAvatars = shuffleArray(avatars)

    // Randomly pick two elements
    const selectedAvatars = shuffledAvatars.slice(0, 6)

    // Update state with the selected avatars
    setSelectedAvatars(selectedAvatars.map((avatar) => ({ ...avatar })))
  }

  // Update selected avatars on mount and every 5 seconds
  useEffect(() => {
    updateSelectedAvatars() // Initial update
    const intervalId = setInterval(updateSelectedAvatars, 10000)

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId)
  }, [avatars])

  return (
    <Stack direction={"row"} spacing={4} align={"center"}>
      <AvatarGroup max={6}>
        {selectedAvatars.map((avatar) => (
          <Avatar
            key={avatar.name}
            name={avatar.name}
            src={avatar.url}
            // eslint-disable-next-line react-hooks/rules-of-hooks
            //size={useBreakpointValue({ base: "md", md: "lg" })}
            minWidth={{ base: "40px", md: "60px" }}
            minHeight={{ base: "40px", md: "60px" }}
            size={'md'}
            position={"relative"}
            zIndex={2}
            _before={{
              content: '""',
              width: "full",
              height: "full",
              rounded: "full",
              transform: "scale(1.125)",
              bgGradient: "linear(to-r, primary.500,secondary.600)",
              position: "absolute",
              zIndex: -1,
              top: 0,
              left: 0
            }}
          />
        ))}
      </AvatarGroup>
      <Text fontFamily={"heading"} fontSize={{ base: "4xl", md: "6xl" }}>
        +
      </Text>
      <Flex
        align={"center"}
        justify={"center"}
        fontFamily={"heading"}
        fontSize={{ base: "sm", md: "lg" }}
        bg={"gray.800"}
        color={"white"}
        rounded={"full"}
        minWidth={useBreakpointValue({ base: "40px", md: "60px" })}
        minHeight={useBreakpointValue({ base: "40px", md: "60px" })}
        position={"relative"}
        _before={{
          content: '""',
          width: "full",
          height: "full",
          rounded: "full",
          transform: "scale(1.125)",
          bgGradient: "linear(to-bl, orange.400,yellow.400)",
          position: "absolute",
          zIndex: -1,
          top: 0,
          left: 0
        }}
      >
        YOU
      </Flex>
    </Stack>
  )
}

export default UsersGroup
