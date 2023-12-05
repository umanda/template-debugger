import { Box, Stack, Heading, Text, Container, Input, Button, SimpleGrid, FormControl, Center } from "@chakra-ui/react"
import { useCallback, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { SigninDto } from "~/interfaces/user"
import { useEditor } from "~/layerhub"
import { useAppDispatch } from "~/store/store"
import { signin } from "~/store/user/action"
import { useSelector } from "react-redux"
import { selectUser } from "~/store/user/selector"
import Navigation from "~/home/Navigation"

export default function SignIn() {
  const navigate = useNavigate()
  const editor = useEditor()
  const [err, setErr] = useState<string>("")
  const dispath = useAppDispatch()
  const { id } = useParams()
  const [loading, setLoading] = useState<boolean>(false)

  const [options, setOptions] = useState<SigninDto>({
    email: "",
    password: ""
  })

  const user = useSelector(selectUser)

  const makeJoin = async () => {
    try {
      setLoading(true)
      const response: any = await dispath(signin(options))
      if (!response?.error) {
        lodaById()
      } else {
        setErr("Authentication failed. Please check your credentials and try again.")
        setLoading(false)
      }
    } catch {
      setLoading(false)
    }
  }

  const lodaById = useCallback(async () => {
    setLoading(false)
    localStorage.setItem("token", user?.token)
    navigate(`/`)
  }, [id, navigate])

  return (
    <Box position={"relative"}>
      <Navigation />
      <Container
        as={SimpleGrid}
        py={{ base: 10, sm: 20, lg: 32 }}
      >
        
        <Stack bg={"gray.50"} rounded={"xl"} p={{ base: 4, sm: 6, md: 8 }}  maxW={{ lg: "lg" }}>
          <Stack spacing={4}>
            <Heading color={"gray.800"} lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}>
              Sign in to{" "}
              <Text as={"span"} bgGradient="linear(to-r, primary.500,secondary.300)" bgClip="text">
                Drawify Debugger
              </Text>
            </Heading>
            <Text color={"gray.500"} fontSize={{ base: "sm", sm: "md" }}>
              Drawify Debugger a.k.a Hadrif is a tool for debugih templates and projects
            </Text>
          </Stack>
          <Box mt={10}>
            <Stack spacing={4}>
              <Input
                id="email"
                name="email"
                type="email"
                variant="filled"
                placeholder="Email"
                bg={"gray.100"}
                border={0}
                borderRadius="md"
                color={"gray.500"}
                height={"50px"}
                _placeholder={{
                  color: "gray.500"
                }}
                value={options.email}
                onChange={(e) => setOptions({ ...options, email: e.target.value })}
                onFocus={() => setErr("")}
                onKeyDown={(e) => e.key === "Enter" && makeJoin()}
              />
              <FormControl>
                <Input
                  id="password"
                  name="password"
                  variant="filled"
                  placeholder="Password"
                  type={"password"}
                  bg={"gray.100"}
                  borderRadius="md"
                  border={0}
                  height={"50px"}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500"
                  }}
                  onFocus={() => setErr("")}
                  onKeyDown={(e) => e.key === "Enter" && makeJoin()}
                  onChange={(e) => setOptions({ ...options, password: e.target.value })}
                  value={options.password}
                />
              </FormControl>
            </Stack>
            <Button
              type="button"
              fontFamily={"heading"}
              py={6}
              mt={8}
              fontSize={"lg"}
              w={"full"}
              bgGradient="linear(to-r, primary.500,secondary.300)"
              color={"white"}
              _hover={{
                bgGradient: "linear(to-r, secondary.300,primary.500)",
                boxShadow: "md"
              }}
              isLoading={loading}
              onClick={makeJoin}
              loadingText='Signing in...'
              variant='outline'
              spinnerPlacement='end'
            >
              Sign in ✨
            </Button>
          </Box>
          <Center color="red">{err}</Center>
        </Stack>
      </Container>
    </Box>
  )
}
