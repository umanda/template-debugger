import {
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  ModalBody,
  ModalHeader,
  Text
} from "@chakra-ui/react"
import { useCallback, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { SigninDto } from "../../interfaces/user"
import { useAppDispatch } from "~/store/store"
import { signin } from "~/store/user/action"
import { generateId } from "../../utils/unique"
import { AuthType } from "./AuthModal"
import * as api from "../../services/api"
import { useEditor } from "@layerhub-pro/react"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"

export default function SignIn({
  setAuthtype,
  onClose
}: {
  setAuthtype: React.Dispatch<React.SetStateAction<AuthType>>
  onClose: () => void
}) {
  const navigate = useNavigate()
  const editor = useEditor()
  const [err, setErr] = useState<string>("")
  const [show, setShow] = useState(false)
  const dispath = useAppDispatch()
  const { id } = useParams()
  const [options, setOptions] = useState<SigninDto>({
    email: "",
    password: ""
  })

  const makeJoin = async () => {
    try {
      try {
        const response: any = await dispath(signin(options))
        if (!response?.error) {
          lodaById()
          onClose()
        } else {
          setErr("Authentication failed. Please check your credentials and try again.")
        }
      } catch {}
    } catch {}
  }

  const lodaById = useCallback(async () => {
    try {
      const resolve: any = await api.getProjectByKey({ id })
      editor.design.setDesign(resolve)
      let sceneNames: string[] = []
      for (const scn of resolve.scenes) {
        sceneNames.push(scn.name)
      }
    } catch {
      navigate(`/composer/${generateId("", 10)}`)
    }
  }, [id, navigate])

  return (
    <Flex flexDir="column">
      <ModalHeader>
        <Center>Welcome to Drawify 3.0 Demo</Center>
      </ModalHeader>
      <ModalBody>
        <Flex flexDir="column" gap="10px">
          <Flex flexDir="column" gap="20px">
            <Grid>
              <GridItem>
                <Image src="/login_resize.png" alt="Welcome to Drawify 3.0 Demo" />
              </GridItem>
            </Grid>

            <Grid templateColumns="repeat(4, 1fr)">
              <Text>User:</Text>
              <GridItem colSpan={3}>
                <InputGroup size="md">
                  <Input
                    w="full"
                    placeholder="Enter username"
                    value={options.email}
                    onChange={(e) => setOptions({ ...options, email: e.target.value })}
                    onFocus={() => setErr("")}
                    onKeyDown={(e) => e.key === "Enter" && makeJoin()}
                  />
                </InputGroup>
              </GridItem>
            </Grid>
            <Grid templateColumns="repeat(4, 1fr)">
              <Text>Password:</Text>
              <GridItem colSpan={3}>
                <InputGroup size="md">
                  <Input
                    onFocus={() => setErr("")}
                    onKeyDown={(e) => e.key === "Enter" && makeJoin()}
                    onChange={(e) => setOptions({ ...options, password: e.target.value })}
                    value={options.password}
                    size="md"
                    type={show ? "text" : "password"}
                    placeholder="Enter password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </GridItem>
            </Grid>
            <Button
              fontSize="18px"
              fontWeight="600"
              h="40px"
              background="#5456F5"
              color="white"
              w="full"
              onClick={makeJoin}
              _hover={{ cursor: "pointer" }}
            >
              Join Drawify 3.0
            </Button>
          </Flex>
          <Center>
            Not a member?
            <Button paddingLeft="5px" color="#5456F5" variant={"link"} onClick={() => setAuthtype("signup")}>
              Sign Up Now!
            </Button>
          </Center>
          <Center color="red">{err}</Center>
        </Flex>
      </ModalBody>
    </Flex>
  )
}
