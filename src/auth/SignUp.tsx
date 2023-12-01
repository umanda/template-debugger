import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  SimpleGrid,
  Avatar,
  AvatarGroup,
  useBreakpointValue,
  Textarea,
  useToast
} from "@chakra-ui/react"
import { AnyAction } from "@reduxjs/toolkit"
import axios from "axios"
import React, { useState } from "react"
import { useSelector } from "react-redux"
import Navigation from "~/home/Navigation"
import { selectUser } from "~/store/user/selector"
import UsersGroup from "./UsersGroup"

export default function SignUp() {
  const toast = useToast()

  const [loading, setLoading] = useState<boolean>(false)
  const [options, setOptions] = useState<any>({
    name: "",
    email: "",
    message: ""
  })
  const [error, setErr] = React.useState<string>("")

  const user = useSelector(selectUser)

  const handleSignUp = async () => {
    

    const formData: any = {
      name: options.name,
      email: options.email,
      message: options.message
    }
    try {
      setLoading(true)

      const data =
        "Wow :see_no_evil: A new user is requesting MAIA access from drawify.ai.\n\n" +
        "*Name:* " +
        formData.name +
        "\n" +
        "*Email:* " +
        formData.email +
        "\n" +
        "*Message:* " +
        formData.message

      const payload = {
        attachments: [{ text: data, color: "green" }]
      }
      const options = {
        method: "post",
        baseURL: "https://hooks.slack.com/services/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",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        data: payload
      }
      await axios.request(options).finally(() => {
        setLoading(false)
        tostMessage()
      })
    } catch {
      setLoading(false)
    }
  }

  const tostMessage = () => {
    toast({
      position: "top",
      duration: 5000,
      isClosable: true,
      render: () => (
        <Stack p="4" boxShadow="lg" m="4" borderRadius="sm" background={"green.500"} textColor={"white"}>
          <Stack direction="row" alignItems="center">
            <Text fontSize={"xl"} fontWeight="semibold">
              Beep Beep Boop
            </Text>
          </Stack>

          <Stack direction={{ base: "column", md: "row" }} justifyContent="space-between">
            <Text fontSize={"lg"} textAlign={"center"} maxW={"4xl"}>
              Current limit is exceeded hence your request has been under queue. We got your message and we will get
              back to you soon.
            </Text>
          </Stack>
        </Stack>
      )
    })
  }

  return (
    <Box position={"relative"}>
      <Navigation />
      <Container
        as={SimpleGrid}
        maxW={"7xl"}
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 10, lg: 32 }}
        py={{ base: 10, sm: 20, lg: 32 }}
      >
        <Stack spacing={{ base: 10, md: 20 }}>
          <Heading lineHeight={1.1} fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}>
            Join{" "}
            <Text as={"span"} bgGradient="linear(to-r, primary.500,secondary.600)" bgClip="text">
              Beta
            </Text>{" "}
            : Test New Features Before Others
          </Heading>
          <UsersGroup />
        </Stack>
        <Stack bg={"gray.50"} rounded={"xl"} p={{ base: 4, sm: 6, md: 8 }} spacing={{ base: 8 }} maxW={{ lg: "lg" }}>
          <Stack spacing={4}>
            <Heading color={"gray.800"} lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}>
              Join Our{" "}
              <Text as={"span"} bgGradient="linear(to-r, primary.500,secondary.600)" bgClip="text">
                BETA
              </Text>{" "}
              Testing Team
            </Heading>
            <Text color={"gray.500"} fontSize={{ base: "sm", sm: "md" }}>
              Become a Beta tester and enjoy early access to new features! Your feedback helps us improve and create a better experience for everyone.
            </Text>
          </Stack>
          <Box as={"form"} mt={10}>
            <Stack spacing={4}>
              <Input
                placeholder="Your Name"
                variant="filled"
                type={"text"}
                bg={"gray.100"}
                borderRadius="md"
                border={0}
                height={"50px"}
                color={"gray.500"}
                _placeholder={{
                  color: "gray.500"
                }}
                onFocus={() => setErr("")}
                onKeyDown={(e) => e.key === "Enter" && handleSignUp()}
                onChange={(e) => setOptions({ ...options, name: e.target.value })}
                value={options.name}
              />
              <Input
                placeholder="Your Email"
                variant="filled"
                type="email"
                required
                bg={"gray.100"}
                borderRadius="md"
                border={0}
                height={"50px"}
                color={"gray.500"}
                _placeholder={{
                  color: "gray.500"
                }}
                onFocus={() => setErr("")}
                onKeyDown={(e) => e.key === "Enter" && handleSignUp()}
                onChange={(e) => setOptions({ ...options, email: e.target.value })}
                value={options.email}
              />
              <Textarea
                placeholder="What do you think about us?"
                bg={"gray.100"}
                border={0}
                resize={"none"}
                color={"gray.500"}
                _placeholder={{
                  color: "gray.500"
                }}
                onFocus={() => setErr("")}
                onKeyDown={(e) => e.key === "Enter" && handleSignUp()}
                onChange={(e) => setOptions({ ...options, message: e.target.value })}
                value={options.message}
              />
            </Stack>
            <Button
              fontFamily={"heading"}
              mt={8}
              py={6}
              w={"full"}
              fontSize={"md"}
              bgGradient="linear(to-r, primary.500,secondary.600)"
              color={"white"}
              _hover={{
                bgGradient: "linear(to-r, secondary.600,primary.500)",
                boxShadow: "md"
              }}
              isLoading={loading}
              onClick={handleSignUp}
              loadingText="Requesting..."
              variant="outline"
              spinnerPlacement="end"
            >
              Request Beta Access ✨
            </Button>
          </Box>
          form
        </Stack>
      </Container>
      <Blur position={"absolute"} top={-10} left={-10} style={{ filter: "blur(70px)" }} />
      <Footer/>
    </Box>
  )
}
